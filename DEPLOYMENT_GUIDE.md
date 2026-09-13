# 🚀 HRMS-Lite Enterprise Cloud-Native Deployment & Operations Guide

This comprehensive guide walks you through deploying, configuring, and scaling **HRMS-Lite** using **Docker**, **Kubernetes**, **Apache Kafka**, **RabbitMQ**, **n8n Workflow Automation**, and **GitHub Actions CI/CD**.

---

## 🏛️ System Architecture

```
                    ┌────────────────────────────────────────┐
                    │               End Users                │
                    └───────────────────┬────────────────────┘
                                        │
                         (HTTPS / Ingress / Port 80)
                                        │
                                        ▼
                           ┌─────────────────────────┐
                           │   React 18 SPA (Nginx)  │
                           └────────────┬────────────┘
                                        │ (Proxy /api/)
                                        ▼
                           ┌─────────────────────────┐
                           │  Django 5 REST API      │
                           │  (Gunicorn WSGI)        │
                           └───────┬─────┬────┬──────┘
                                   │     │    │
            ┌──────────────────────┘     │    └──────────────────────┐
            ▼                            ▼                           ▼
  ┌───────────────────┐        ┌───────────────────┐       ┌───────────────────┐
  │   MongoDB Atlas   │        │    Redis Cache    │       │   n8n Workflows   │
  │ (Persistent DB)   │        │  (Session / TTL)  │       │ (Webhooks Engine) │
  └───────────────────┘        └───────────────────┘       └───────────────────┘
                                         │                           │
                                         ▼                           ▼
                               ┌───────────────────┐       ┌───────────────────┐
                               │     RabbitMQ      │       │   Apache Kafka    │
                               │  (AMQP Tasks/Mail)│       │ (Event Telemetry) │
                               └─────────┬─────────┘       └─────────┬─────────┘
                                         │                           │
                                         ▼                           ▼
                               ┌───────────────────┐       ┌───────────────────┐
                               │  RabbitMQ Worker  │       │  Kafka Consumer   │
                               │  (Background Ops) │       │ (Live Analytics)  │
                               └───────────────────┘       └───────────────────┘
```

---

## 🐳 1. Local Deployment with Docker Compose

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+ / Compose v2+)

### Step-by-Step Launch
1. **Configure Environment Variables**:
   Verify or update `backend/hrms/.env`:
   ```env
   SECRET_KEY=your-django-production-key
   DEBUG=False
   ALLOWED_HOSTS=*
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hrms_db?retryWrites=true&w=majority
   MONGO_DB_NAME=hrms_db

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Messaging & Event-Driven Engine
   REDIS_URL=redis://redis:6379/1
   RABBITMQ_HOST=rabbitmq
   RABBITMQ_PORT=5672
   RABBITMQ_USER=guest
   RABBITMQ_PASSWORD=guest
   KAFKA_BOOTSTRAP_SERVERS=kafka:9092
   N8N_WEBHOOK_BASE_URL=http://n8n:5678/webhook
   ```

2. **Start the Entire Distributed Stack**:
   ```bash
   # Using Makefile:
   make up

   # Or using PowerShell script:
   .\scripts\dev-up.ps1

   # Or directly with Docker Compose:
   docker compose up -d --build
   ```

3. **Verify Service Endpoints**:
   | Service | URL | Default Credentials / Purpose |
   |---|---|---|
   | **Frontend Web App** | `http://localhost:3000` | User Web Interface |
   | **Backend REST API** | `http://localhost:8000` | Django API Root |
   | **System Health API** | `http://localhost:8000/api/system/status/` | Cluster Diagnostics |
   | **RabbitMQ Management** | `http://localhost:15672` | `guest` / `guest` |
   | **n8n Automation** | `http://localhost:5678` | Low-code Automation Canvas |
   | **Kafka UI Dashboard** | `http://localhost:8080` | Topic & Stream Inspector |

---

## ⚡ 2. Event-Driven Messaging Verification

### RabbitMQ Worker
The `rabbitmq-worker` container automatically listens on the `hrms_tasks` queue.
- **Trigger**: Adding a new employee dispatches `send_welcome_email`.
- **Logs**:
  ```bash
  docker compose logs -f rabbitmq-worker
  ```

### Apache Kafka Real-Time Stream
Real-time topics:
- `hrms.employee.events`
- `hrms.attendance.events`
- `hrms.audit.logs`
- **Inspect Events**: Open `http://localhost:8080` (Kafka UI) and click on **Topics** -> `hrms.employee.events` -> **Messages**.

---

## 🤖 3. n8n Workflow Automation Setup

1. Open `http://localhost:5678` in your browser.
2. Navigate to **Workflows** -> **Import from File...**.
3. Select one of the ready-to-run templates in `n8n/workflows/`:
   - `employee_onboarding.json`
   - `daily_attendance_digest.json`
   - `anomaly_alert.json`
4. Set the workflow to **Active**.

---

## 🔄 4. CI/CD Pipelines (GitHub Actions)

When you push this repository to GitHub, the configured workflows run automatically:

- **`.github/workflows/ci.yml`**:
  - Validates Python syntax, runs `flake8` and `bandit` security scans.
  - Builds and tests React production bundles.
  - Builds Docker images to ensure build reproducibility.
- **`.github/workflows/cd.yml`**:
  - Automatically compiles and pushes multi-arch images to GitHub Container Registry (`ghcr.io`).
- **`.github/workflows/k8s-validate.yml`**:
  - Lints Helm charts and validates Kubernetes YAML manifests against official schemas.

---

## ☸️ 5. Production Kubernetes (K8s) Deployment

### Option A: Standard `kubectl` Deployment (Kustomize)
```bash
# 1. Create namespace, configs, secrets, brokers, and app workloads:
kubectl apply -k k8s/

# 2. Monitor rollout status:
kubectl get pods -n hrms -w

# 3. Check ingress and services:
kubectl get svc,ingress,hpa -n hrms
```

### Option B: Helm Chart Deployment
```bash
# 1. Install or upgrade the release
helm upgrade --install hrms-platform ./helm/hrms-lite --namespace hrms --create-namespace

# 2. Inspect status
helm status hrms-platform -n hrms
```

---

## 🛡️ Production Hardening Checklist

- [x] Non-root container execution (`appuser` with UID/GID isolation).
- [x] Liveness & readiness probes configured on all services.
- [x] Horizontal Pod Autoscaler (HPA) scaling between 2 and 10 pods on CPU/Memory thresholds.
- [x] Decoupled resilient messaging: Django API handles failures gracefully if message brokers temporarily restart.
- [x] Gzip compression, browser caching, and SPA routing configured in Nginx.
