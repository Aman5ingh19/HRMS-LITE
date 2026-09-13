"""
n8n Workflow Automation Webhook Dispatcher for HRMS Lite.
Sends real-time lifecycle triggers to n8n webhook nodes for automated HR workflows.
"""

import os
import json
import logging
import threading
from datetime import datetime

logger = logging.getLogger('hrms')

N8N_WEBHOOK_BASE_URL = os.getenv('N8N_WEBHOOK_BASE_URL', 'http://localhost:5678/webhook').rstrip('/')
N8N_WEBHOOK_ENABLED = os.getenv('N8N_WEBHOOK_ENABLED', 'True').lower() in ('true', '1', 'yes')
N8N_WEBHOOK_SECRET = os.getenv('N8N_WEBHOOK_SECRET', 'hrms-n8n-secure-token')


def _dispatch_webhook(endpoint_path: str, event_name: str, payload: dict):
    """Internal helper to send HTTP POST to n8n."""
    try:
        import requests
    except ImportError:
        logger.warning("[n8n] requests library not available. Webhook skipping.")
        return False

    url = f"{N8N_WEBHOOK_BASE_URL}/{endpoint_path.lstrip('/')}"
    headers = {
        'Content-Type': 'application/json',
        'X-HRMS-Event': event_name,
        'X-HRMS-Secret': N8N_WEBHOOK_SECRET,
        'User-Agent': 'HRMS-Lite-Webhook-Dispatcher/1.0'
    }

    body = {
        'event': event_name,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'payload': payload
    }

    try:
        response = requests.post(url, json=body, headers=headers, timeout=4)
        if response.status_code in (200, 201, 202, 204):
            logger.info(f"[n8n] Triggered webhook '{event_name}' -> {url} (Status: {response.status_code})")
            return True
        else:
            logger.warning(f"[n8n] Webhook '{event_name}' returned status {response.status_code}: {response.text[:100]}")
            return False
    except Exception as e:
        logger.warning(f"[n8n] Could not reach n8n webhook at {url}: {e}")
        return False


def trigger_n8n_webhook(endpoint_path: str, event_name: str, payload: dict, async_dispatch: bool = True) -> bool:
    """
    Trigger an n8n webhook asynchronously.

    :param endpoint_path: The webhook path slug configured in n8n (e.g., 'employee-onboarding', 'attendance-digest')
    :param event_name: Event name identifier
    :param payload: JSON data dictionary to pass into n8n workflow
    :param async_dispatch: Runs in background thread if True
    """
    if not N8N_WEBHOOK_ENABLED:
        return False

    if async_dispatch:
        t = threading.Thread(target=_dispatch_webhook, args=(endpoint_path, event_name, payload), daemon=True)
        t.start()
        return True
    else:
        return _dispatch_webhook(endpoint_path, event_name, payload)
