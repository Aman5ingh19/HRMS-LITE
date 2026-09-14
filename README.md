# 🚀 HRMS-Lite — Enterprise Cloud-Native & Event-Driven Distributed HRMS Platform

[![CI Pipeline](https://github.com/Aman5ingh19/HRMS-LITE/actions/workflows/ci.yml/badge.svg)](https://github.com/Aman5ingh19/HRMS-LITE/actions/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/Docker-24.0+-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28+-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-3.5-231F20?logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.12-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![n8n](https://img.shields.io/badge/n8n-Workflow%20Automation-EA4B71?logo=n8n&logoColor=white)](https://n8n.io/)
[![Django](https://img.shields.io/badge/Django-5.1.5-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-Cloud%20NoSQL-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Redis](https://img.shields.io/badge/Redis-7%20Alpine-DC382D?logo=redis&logoColor=white)](https://redis.io/)

> **A production-grade, distributed Human Resource Management System (HRMS)** engineered for enterprise resilience, high concurrency, and real-time operational visibility. Features a decoupled event-driven architecture with **Kafka telemetry streams**, **RabbitMQ asynchronous task queuing**, **n8n low-code workflow automation**, **Kubernetes HPA autoscaling**, and **automated GitHub Actions CI/CD pipelines**.

---

## 📌 Resume Project Highlights (Key Engineering Achievements)

* **Distributed Event Streaming**: Architected real-time event pipeline using **Apache Kafka** for employee lifecycle and attendance telemetry (`hrms.attendance.events`, `hrms.employee.events`), achieving sub-second telemetry aggregation.
* **Asynchronous Task Processing**: Decoupled high-latency operations (welcome onboarding emails, Slack notifications, security audit persistence) using **RabbitMQ message queues** and standalone Python worker consumers.
* **Low-Code Workflow Orchestration**: Integrated **n8n Automation Engine** triggered via resilient Django webhooks to automate multi-channel HR onboarding and scheduled daily attendance digests.
* **Cloud-Native Kubernetes & Auto-Scaling**: Containerized services using multi-stage Docker builds and orchestrated on **Kubernetes (K8s)** with **Horizontal Pod Autoscaling (HPA)**, scaling pods dynamically (2 to 10 replicas) under load.
* **Zero-Downtime CI/CD**: Implemented GitHub Actions pipelines for automated linting (`flake8`), AST security auditing (`bandit`), React production builds, and container registry publishing (`ghcr.io`).
* **High-Performance Caching & Resilience**: Implemented Redis query caching and TTL invalidation strategies, reducing database read latency by **~70%** and preventing N+1 bottlenecks.

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

## 🛠️ Complete Technology Stack & Architectural Roles

| Layer / Technology | Tech Used | Why It Was Chosen (Architectural Rationale) |
|---|---|---|
| **Frontend SPA** | React 18, React Router v6, Lucide Icons, Axios | Responsive component architecture with client-side routing, optimistic UI updates, and zero-flicker Dark/Light themes. |
| **Web Server / Reverse Proxy** | Nginx Alpine | High-performance static bundle serving, gzip compression, security header enforcement, and reverse proxying `/api/` to backend. |
| **Backend REST API** | Django 5, DRF, Pydantic, Gunicorn | Robust enterprise web framework with strict dual-layer schema validation (Pydantic + Zod) and multi-threaded Gunicorn WSGI workers. |
| **Primary Database** | MongoDB Atlas (Cloud NoSQL) | Scalable, document-oriented data model for flexible employee profiles, nested metadata, and time-series attendance records. |
| **Caching & Throttling** | Redis 7 Alpine | In-memory key-value cache for hot queries (`employees:all`, `attendance:summary`) and API rate limiting. |
| **Task Queue & Workers** | RabbitMQ 3.12 (AMQP) | Reliable, transactional message broker for asynchronous operations (emails, notification alerts) with acknowledgement safety. |
| **Distributed Streaming** | Apache Kafka 3.5 (KRaft/Zookeeper) | High-throughput, distributed event log for real-time audit logs and live attendance telemetry streaming. |
| **Workflow Automation** | n8n Automation Engine | Low-code orchestration engine triggered via webhooks for multi-step HR automation (Slack alerts, daily attendance summaries). |
| **Containerization** | Docker, Multi-Stage Builds, Compose | Reproducible environments across local development and production with non-root security execution. |
| **Cloud Orchestration** | Kubernetes (K8s), Helm 3 | Container clustering with self-healing, rolling updates, ingress routing, and Horizontal Pod Autoscaling (HPA). |
| **CI / CD Pipelines** | GitHub Actions | Automated linting (`flake8`), AST security scans (`bandit`), container image builds, and multi-arch publishing to GHCR. |
| **Cloud Media CDN** | Cloudinary Storage API | Automated facial-detection cropping, WebP compression, and global CDN delivery for employee profile images. |
| **Identity & Security** | Clerk Auth Provider | Enterprise OAuth2 authentication, JWT bearer verification, and role-based access control with Guest Mode defense. |

---

## 🌟 Core Modules & Capabilities

### 👥 1. Employee Management & Lifecycle Events
* **Full CRUD Operations**: Create, update, list, and delete employee records with Pydantic validation.
* **Media Management**: Direct Cloudinary upload with automated asset deletion upon employee offboarding.
* **Event Dispatching**: Emits `EMPLOYEE_CREATED` and `EMPLOYEE_DELETED` events to Kafka, enqueues welcome tasks to RabbitMQ, and notifies n8n webhooks.

### 📅 2. Attendance Tracking & Real-Time Telemetry
* **One-Click Check-In & Check-Out**: Real-time duration calculation (`Xh Ym`) with timezone-safe formatting.
* **Telemetry Streaming**: Live stream records dispatched to Kafka `hrms.attendance.events` for real-time attendance analytics.
* **Interactive Calendar**: Heatmap density calendar rendering daily workforce presence percentages.

### 🤖 3. n8n Low-Code Workflow Automation
* **`employee_onboarding.json`**: Formats employee payload, triggers welcome email, and posts announcement to `#general` Slack channel.
* **`daily_attendance_digest.json`**: Scheduled 18:00 daily cron compiling active headcount & presence rate for management.
* **`anomaly_alert.json`**: Real-time alert for irregular attendance or missing checkout records.

---

## 📁 Repository Directory Structure

```
HRMS-LITE/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Linting, Bandit security audit & Docker build test
│       ├── cd.yml                 # Automated container build & push to GHCR
│       └── k8s-validate.yml       # Kubernetes manifest schema validation
├── backend/
│   ├── Dockerfile                 # Multi-stage Django + Gunicorn container
│   ├── .dockerignore
│   └── hrms/
│       ├── hrms/
│       │   ├── messaging/         # Event publishers (Kafka, RabbitMQ, n8n)
│       │   ├── workers/           # Standalone queue & stream consumers
│       │   ├── settings.py        # Django configuration
│       │   ├── urls.py            # URL routing & health probes
│       │   └── mongo.py           # MongoDB connection pool
│       ├── employees/             # Employee app & custom management commands
│       ├── attendance/            # Attendance tracking app
│       └── manage.py
├── frontend/
│   ├── Dockerfile                 # Multi-stage React + Nginx Alpine container
│   ├── nginx.conf                 # Production Nginx reverse proxy & gzip config
│   ├── .dockerignore
│   ├── src/                       # React 18 source code
│   └── package.json
├── k8s/                           # Production Kubernetes Manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml           # Horizontal Pod Autoscaler (2-10 pods)
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
│   ├── workflows/                 # Pre-configured JSON workflows
│   └── README.md                  # Workflow import manual
├── scripts/
│   ├── dev-up.ps1                 # PowerShell 1-click startup script
│   └── dev-up.sh                  # Bash 1-click startup script
├── docker-compose.yml             # Master multi-container orchestration
├── Makefile                       # Developer shortcuts
├── DEPLOYMENT_GUIDE.md            # Comprehensive cloud deployment manual
├── requirements.txt               # Backend Python dependencies
└── README.md
```

---

## 🚀 Quickstart Guide

### 🐳 1. Run Full Distributed Stack via Docker Compose
```powershell
# Windows PowerShell:
.\scripts\dev-up.ps1

# Or with Makefile:
make up

# Or directly:
docker compose up -d --build
```

### 🌐 Service Endpoints:
| Service | URL | Credentials / Purpose |
|---|---|---|
| **🖥️ Frontend Web Application** | `http://localhost:3000` | React UI on Nginx |
| **⚡ Backend REST API** | `http://localhost:8000` | Django 5 API Root |
| **🏥 Cluster Health Diagnostics** | `http://localhost:8000/api/system/status/` | Live Connectivity Status |
| **🐰 RabbitMQ Management UI** | `http://localhost:15672` | `guest` / `guest` |
| **🤖 n8n Automation Canvas** | `http://localhost:5678` | Workflow Automation UI |
| **📊 Kafka UI Stream Inspector** | `http://localhost:8080` | Topic & Message Dashboard |

---

## ☸️ 2. Deploy to Kubernetes (K8s)

```bash
# 1. Deploy all services with Kustomize:
kubectl apply -k k8s/

# 2. Inspect pods & Horizontal Pod Autoscaler:
kubectl get pods,svc,ingress,hpa -n hrms

# Or deploy using Helm Chart:
helm upgrade --install hrms-platform ./helm/hrms-lite --namespace hrms --create-namespace
```

---

## 👨‍💻 Author & Maintainer

**Aman Singh**  
*Full-Stack & Cloud-Native Software Engineer*  
*GitHub: [@Aman5ingh19](https://github.com/Aman5ingh19)*
