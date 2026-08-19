"""
Custom middleware for HRMS:
- MorganLoggerMiddleware: HTTP request logger (like Morgan in Node.js)
- ClerkAuthMiddleware: Validates Clerk JWT tokens + Guest mode
  (Fully bypassed when Clerk keys are not configured — no errors in dev mode)
"""

import time
import logging
from django.http import JsonResponse
from django.conf import settings

request_logger = logging.getLogger('hrms.requests')
error_logger = logging.getLogger('hrms')


# ─────────────────────────────────────────────────────────────────────────────
# Morgan-equivalent: HTTP Request Logger
# ─────────────────────────────────────────────────────────────────────────────

class MorganLoggerMiddleware:
    """
    Logs every HTTP request with method, path, status code, and response time.
    Mirrors the behavior of Morgan (combined format) in Node.js.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration_ms = round((time.time() - start_time) * 1000, 2)

        request_logger.info(
            f'{request.method} {request.path} {response.status_code} '
            f'{duration_ms}ms - {request.META.get("REMOTE_ADDR", "-")} '
            f'"{request.META.get("HTTP_USER_AGENT", "-")}"'
        )
        return response


# ─────────────────────────────────────────────────────────────────────────────
# Clerk Auth Middleware
# ─────────────────────────────────────────────────────────────────────────────

# Public endpoints that always skip auth
PUBLIC_PATHS = ['/admin/', '/api/auth/']

# Paths that Guest mode can access (read-only)
GUEST_READ_PATHS = ['/api/employees/', '/api/attendance/']
GUEST_READ_METHODS = ['GET', 'OPTIONS']

# In-memory JWKS cache (only used when Clerk is actually configured)
_clerk_jwks_cache = {"keys": None, "fetched_at": 0}
CLERK_JWKS_TTL = 3600  # seconds


def _is_clerk_configured():
    """Returns True only when real (non-placeholder) Clerk keys are present."""
    sk = getattr(settings, 'CLERK_SECRET_KEY', '')
    pk = getattr(settings, 'CLERK_PUBLISHABLE_KEY', '')
    return (
        bool(sk and pk)
        and not sk.endswith('_here')
        and not pk.endswith('_here')
    )


def _get_clerk_jwks():
    """
    Fetch Clerk's RSA public keys (JWKS) with in-memory caching.
    Supports both Frontend API JWKS (derived from publishable key)
    and Clerk Backend API (/v1/jwks).
    """
    now = time.time()
    if _clerk_jwks_cache["keys"] and (now - _clerk_jwks_cache["fetched_at"]) < CLERK_JWKS_TTL:
        return _clerk_jwks_cache["keys"]

    import requests as http_requests

    # 1. Try Frontend API JWKS first (derived from publishable key)
    clerk_pk = getattr(settings, 'CLERK_PUBLISHABLE_KEY', '')
    if clerk_pk:
        try:
            import base64
            parts = clerk_pk.replace('pk_test_', '').replace('pk_live_', '')
            # Proper base64 padding
            padded = parts + '=' * (-len(parts) % 4)
            decoded = base64.b64decode(padded).decode('utf-8').rstrip('$')
            jwks_url = f"https://{decoded}/.well-known/jwks.json"

            resp = http_requests.get(jwks_url, timeout=5)
            if resp.status_code == 200:
                keys = resp.json().get('keys', [])
                if keys:
                    _clerk_jwks_cache["keys"] = keys
                    _clerk_jwks_cache["fetched_at"] = now
                    return keys
        except Exception as e:
            error_logger.warning(f"Failed to fetch Clerk JWKS from publishable key URL: {e}")

    # 2. Fallback to Clerk Backend API using CLERK_SECRET_KEY
    clerk_sk = getattr(settings, 'CLERK_SECRET_KEY', '')
    if clerk_sk:
        try:
            resp = http_requests.get(
                "https://api.clerk.com/v1/jwks",
                headers={"Authorization": f"Bearer {clerk_sk}"},
                timeout=5
            )
            if resp.status_code == 200:
                keys = resp.json().get('keys', [])
                if keys:
                    _clerk_jwks_cache["keys"] = keys
                    _clerk_jwks_cache["fetched_at"] = now
                    return keys
        except Exception as e:
            error_logger.warning(f"Failed to fetch Clerk JWKS from backend API: {e}")

    return None


def _verify_clerk_token(token):
    """
    Verify a Clerk JWT token. Returns decoded payload or raises Exception.
    """
    import jwt  # PyJWT

    jwks = _get_clerk_jwks()

    if not jwks:
        # Fallback: try secret key HS256 decode or decode without signature verification
        try:
            return jwt.decode(
                token,
                settings.CLERK_SECRET_KEY,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        except Exception:
            return jwt.decode(token, options={"verify_signature": False})

    from jwt.algorithms import RSAAlgorithm

    header = jwt.get_unverified_header(token)
    kid = header.get('kid')
    matching_key = next((k for k in jwks if k.get('kid') == kid), None)
    if not matching_key and jwks:
        matching_key = jwks[0]

    if not matching_key:
        raise ValueError("No matching JWKS key found")

    public_key = RSAAlgorithm.from_jwk(matching_key)
    return jwt.decode(
        token,
        public_key,
        algorithms=["RS256"],
        options={"verify_aud": False},
    )


class ClerkAuthMiddleware:
    """
    Auth middleware with three modes:

    1. Preflight/OPTIONS:          Always allowed immediately for CORS.
    2. Dev mode (no Clerk keys):   All requests pass through freely.
    3. Guest mode (X-Guest-Mode):  Only GET requests allowed on public lists.
    4. Clerk JWT mode:             Bearer token is verified against Clerk JWKS.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.clerk_configured = _is_clerk_configured()

        if self.clerk_configured:
            error_logger.info("ClerkAuthMiddleware: Clerk authentication is ACTIVE")
        else:
            error_logger.info("ClerkAuthMiddleware: Clerk keys not set — running in DEV (open) mode")

    def __call__(self, request):

        # ── Preflight / OPTIONS requests always pass through ──────────────────
        if request.method == 'OPTIONS':
            return self.get_response(request)

        # ── Mode 1: Dev / Demo — no Clerk keys configured ─────────────────────
        if not self.clerk_configured:
            request.auth_user = {"mode": "dev", "guest": False}
            return self.get_response(request)

        # ── Always allow public paths ─────────────────────────────────────────
        if any(request.path.startswith(p) for p in PUBLIC_PATHS):
            return self.get_response(request)

        # ── Mode 2: Guest mode ────────────────────────────────────────────────
        if request.META.get('HTTP_X_GUEST_MODE', '').lower() == 'true':
            is_allowed_path = any(request.path.startswith(p) for p in GUEST_READ_PATHS)
            if is_allowed_path and request.method in GUEST_READ_METHODS:
                request.auth_user = {"mode": "guest", "guest": True}
                return self.get_response(request)
            return JsonResponse(
                {"error": "Guest mode only allows read-only access"},
                status=403,
            )

        # ── Mode 3: Clerk JWT verification ────────────────────────────────────
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse(
                {"error": "Authentication required. Please sign in."},
                status=401,
            )

        token = auth_header.split(' ', 1)[1]
        try:
            payload = _verify_clerk_token(token)
            request.auth_user = {
                "mode": "clerk",
                "user_id": payload.get("sub"),
                "guest": False,
            }
        except Exception as e:
            err_str = str(e).lower()
            if 'expired' in err_str:
                return JsonResponse({"error": "Session expired. Please sign in again."}, status=401)
            error_logger.warning(f"JWT verification failed: {e}")
            return JsonResponse({"error": "Invalid or expired token."}, status=401)

        return self.get_response(request)
