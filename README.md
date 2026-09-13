# 🚀 HRMS Lite — Enterprise Cloud-Native & Distributed HR Management Platform

A production-grade, distributed Human Resource Management System (HRMS) built for enterprise scale and high resilience. Featuring real-time employee management, live attendance logging with telemetry streaming, interactive attendance calendar, cloud media storage via Cloudinary CDN, role-based access control with Clerk & Guest Mode, zero-flicker Dark/Light themes, and an event-driven distributed microservices architecture powered by **Docker**, **Kubernetes (K8s)**, **Apache Kafka**, **RabbitMQ**, **n8n Workflow Automation**, and **GitHub Actions CI/CD**.

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
                                        │ (Reverse Proxy /api/)
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

## 🌟 Advanced Cloud-Native Features

### 👥 1. Employee Lifecycle & Event Streaming
- **Full CRUD Operations**: Add, update, view, and delete employee records.
- **Cloudinary Photo Uploads**: Upload profile photos directly to Cloudinary with smart face-centering crop and global CDN distribution.
- **Distributed Event Streams**: Adding or deleting employees automatically emits Kafka stream records (`hrms.employee.events`), enqueues RabbitMQ background tasks, and fires n8n webhooks.
- **Dynamic Search & Filtering**: Instant search across employee names, IDs, emails, and departments with pagination.
- **Safe Validation**: End-to-end type safety using Zod resolvers on the frontend and Pydantic schemas on the backend.

### 📅 2. Attendance & Real-Time Telemetry
- **One-Click Check-In & Check-Out**: Real-time timestamps with automatic duration calculations (`Xh Ym`).
- **Kafka Telemetry Stream**: Check-in / check-out records stream directly into `hrms.attendance.events` for live operational intelligence.
- **Live Attendance Calendar**: Monthly interactive visual calendar showing daily attendance rates with color-coded density indicators.
- **Historical Logs & Date Filtering**: Filter and inspect historical logs by specific dates or individual employee IDs.
- **Timezone-Aware Calculations**: Robust local date formatting ensuring accurate day-boundary calculations across all timezones.

### ⚡ 3. Enterprise Asynchronous Task Queuing (RabbitMQ)
- **Decoupled Asynchronous Workers**: Dedicated standalone RabbitMQ worker consumer executing background jobs (Welcome emails, notifications, audit trails).
- **Resilient Fallback**: Non-blocking asynchronous publisher ensuring REST APIs remain 100% responsive even during broker maintenance.
- **Built-in Management UI**: Web console on port `15672` for real-time queue depth and throughput inspection.

### 📊 4. Real-Time Distributed Streaming (Apache Kafka)
- **High-Throughput Telemetry**: Topics for `hrms.employee.events`, `hrms.attendance.events`, and `hrms.audit.logs`.
- **Standalone Stream Consumers**: Live metrics aggregator listening to topics with consumer group load balancing.
- **Kafka UI Console**: Visual web interface on port `8080` for inspecting topics, partitions, and streaming event payloads.

### 🤖 5. Low-Code Workflow Automation (n8n Engine)
- **Automated Onboarding**: Webhook triggers welcome emails, invites, and Slack announcements when new employees join.
- **Daily Attendance Digest**: Automated 18:00 cron summarizing active headcount and attendance rates to HR managers.
- **Anomaly Alerts**: Real-time Slack notifications on missed checkouts or irregularities.
- **Pre-configured JSON Workflows**: Ready-to-import templates in `n8n/workflows/`.

### 🔄 6. Automated CI/CD Pipelines (GitHub Actions)
- **`ci.yml`**: Linting (`flake8`), AST security scanning (`bandit`), frontend test & build, and multi-container Docker image build verification.
- **`cd.yml`**: Automated container compilation & publishing to **GitHub Container Registry (`ghcr.io`)**.
- **`k8s-validate.yml`**: Validates Helm chart syntax and Kubernetes manifests with YAML schema validation.

### ☸️ 7. Kubernetes (K8s) & Helm Orchestration
- **Production Manifests**: Deployments with Liveness/Readiness probes, ConfigMaps, Secrets, Ingress, and Services.
- **Horizontal Pod Autoscaling (HPA)**: Auto-scales backend pods from 2 to 10 based on real-time CPU/Memory thresholds.
- **Modular Helm Chart**: One-command parameter-driven cluster deployment with `helm/hrms-lite/`.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend SPA** | React 18, React Router v6, Lucide Icons, React Hot Toast, Axios | Client-side reactive interface |
| **Web Server / Proxy** | Nginx Alpine, Reverse Proxy, Gzip Compression | Production asset serving & API routing |
| **Backend API** | Django 5, Django REST Framework, Pydantic, Gunicorn | Production RESTful API with schema validation |
| **Database** | MongoDB Atlas (Cloud NoSQL Cluster), PyMongo | High-availability cloud document store |
| **Media & CDN** | Cloudinary Storage API | Cloud image hosting, face-detection crop & WebP delivery |
| **Authentication** | Clerk Auth Provider | JWT authentication and identity management |
| **Caching & Broker** | Redis 7 Alpine | Query response acceleration and session caching |
| **Task Queue** | RabbitMQ (AMQP + Management UI) | Decoupled asynchronous task execution |
| **Event Streaming** | Apache Kafka & Zookeeper / KRaft | High-throughput distributed telemetry stream |
| **Workflow Engine** | n8n Automation Engine | Low-code workflow automation & webhooks |
| **Orchestration** | Docker Compose, Kubernetes (K8s), Helm | Container orchestration & autoscaling |
| **CI / CD** | GitHub Actions (CI / CD / K8s Validate) | Automated testing, linting, security & deployment |

---

## 📁 Repository Structure

```
HRMS-LITE/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, test, security & Docker build CI
│       ├── cd.yml                 # Build & publish containers to GHCR
│       └── k8s-validate.yml       # Kubernetes manifest validator
├── backend/
│   ├── Dockerfile                 # Multi-stage Django + Gunicorn container
│   ├── .dockerignore
│   └── hrms/
│       ├── hrms/
│       │   ├── messaging/         # Event-driven publishers (Kafka, RabbitMQ, n8n)
│       │   ├── workers/           # Background stream & queue consumers
│       │   ├── settings.py        # Django configuration
│       │   ├── urls.py            # Main URL routing & health probes
│       │   └── mongo.py           # MongoDB Atlas connection pool
│       ├── employees/             # Employee management app & management commands
│       ├── attendance/            # Attendance tracking app
│       └── manage.py
├── frontend/
│   ├── Dockerfile                 # Multi-stage React + Nginx Alpine container
│   ├── nginx.conf                 # Production Nginx reverse proxy & gzip config
│   ├── .dockerignore
│   ├── src/                       # React 18 source code
│   └── package.json
├── k8s/                           # Complete Kubernetes Manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml           # Horizontal Pod Autoscaler
│   ├── frontend-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── rabbitmq-statefulset.yaml
│   ├── kafka-deployment.yaml
│   ├── n8n-deployment.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml         # 1-command deployment
├── helm/
│   └── hrms-lite/                 # Production Helm Chart
├── n8n/
│   ├── workflows/                 # Pre-built JSON workflow templates
│   └── README.md                  # Workflow import guide
├── scripts/
│   ├── dev-up.ps1                 # PowerShell 1-click startup script
│   └── dev-up.sh                  # Bash 1-click startup script
├── docker-compose.yml             # Master multi-container orchestration stack
├── Makefile                       # Developer shortcuts
├── DEPLOYMENT_GUIDE.md            # Comprehensive cloud deployment manual
├── requirements.txt               # Backend Python dependencies
└── README.md
```

---

## 🚀 Quickstart & Running the Platform

### 🐳 1. Run Everything via Docker Compose (Recommended)

Start the entire distributed multi-service stack with a single command:

```powershell
# On Windows (PowerShell):
.\scripts\dev-up.ps1

# Or with Makefile:
make up

# Or directly:
docker compose up -d --build
```

### 🌐 Access Service Endpoints:
| Service | URL | Default Credentials / Note |
|---|---|---|
| **🖥️ Frontend Web Application** | `http://localhost:3000` | React UI on Nginx |
| **⚡ Backend REST API** | `http://localhost:8000` | Django 5 API Root |
| **🏥 Cluster Health Diagnostics** | `http://localhost:8000/api/system/status/` | Live Service Connectivity |
| **🐰 RabbitMQ Management UI** | `http://localhost:15672` | Username: `guest` \| Password: `guest` |
| **🤖 n8n Automation Engine** | `http://localhost:5678` | Visual Low-Code Workflow Canvas |
| **📊 Kafka UI Stream Dashboard** | `http://localhost:8080` | Live Topics & Message Inspector |

---

## ☸️ 2. Deploy to Kubernetes (K8s)

Deploy the entire platform to your Kubernetes cluster (Minikube, Kind, AWS EKS, GCP GKE, Azure AKS):

```bash
# 1. Deploy with Kustomize:
kubectl apply -k k8s/

# 2. Check pod and service status:
kubectl get pods,svc,ingress,hpa -n hrms

# Or deploy with Helm:
helm upgrade --install hrms-platform ./helm/hrms-lite --namespace hrms --create-namespace
```

---

## 📡 REST API Reference

### 👤 Employee Endpoints
| Method | Endpoint | Description | Event Triggered |
|---|---|---|---|
| `GET` | `/api/employees/` | List paginated employees with query filter (`?page=1&limit=10&search=`) | Redis Cache Hit/Miss |
| `POST` | `/api/employees/add/` | Create a new employee record (Pydantic validated) | Kafka + RabbitMQ + n8n |
| `DELETE` | `/api/employees/delete/<emp_id>/` | Delete employee & clean up remote Cloudinary photo | Kafka Event Stream |
| `POST` | `/api/employees/upload-photo/` | Upload employee photo to Cloudinary CDN | CDN Delivery |

### ⏱️ Attendance Endpoints
| Method | Endpoint | Description | Event Triggered |
|---|---|---|---|
| `POST` | `/api/attendance/checkin/` | Record employee check-in timestamp (`status: Present`) | Kafka Telemetry + RabbitMQ |
| `POST` | `/api/attendance/checkout/` | Record check-out & compute duration (`Xh Ym`) | Kafka Telemetry + RabbitMQ |
| `GET` | `/api/attendance/` | Fetch historical attendance records with date filters | Redis Cache |
| `GET` | `/api/attendance/<emp_id>/` | Retrieve attendance log history for an employee | Redis Cache |

### 🏥 System Diagnostics Endpoint
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health/` | Liveness probe for Kubernetes and Docker |
| `GET` | `/api/system/status/` | Readiness probe checking MongoDB, Redis, RabbitMQ, Kafka, n8n |

---

## 👨‍💻 Author & Maintainer

**Aman Singh**  

*Built with ❤️ — Engineered for modern, high-performance distributed HR management.*
