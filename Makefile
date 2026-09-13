# ==============================================================================
# HRMS-Lite DevOps & Orchestration Makefile
# ==============================================================================

.PHONY: help up down restart logs ps clean k8s-apply k8s-delete worker kafka-consumer test lint

help:
	@echo "Available commands:"
	@echo "  make up               - Start full distributed stack via Docker Compose"
	@echo "  make down             - Stop all running containers"
	@echo "  make restart          - Restart all containers"
	@echo "  make logs             - Stream live logs from all services"
	@echo "  make ps               - View status of all running containers"
	@echo "  make worker           - Run RabbitMQ background worker locally"
	@echo "  make kafka-consumer   - Run Kafka stream consumer locally"
	@echo "  make test             - Run backend & frontend test suites"
	@echo "  make lint             - Run linters on backend and frontend"
	@echo "  make k8s-apply        - Deploy all manifests to Kubernetes cluster"
	@echo "  make k8s-delete       - Tear down HRMS namespace from Kubernetes"
	@echo "  make clean            - Remove unused docker volumes and caches"

up:
	docker compose up -d --build

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ps:
	docker compose ps

worker:
	cd backend/hrms && python manage.py run_rabbitmq_worker

kafka-consumer:
	cd backend/hrms && python manage.py run_kafka_consumer

test:
	cd backend/hrms && python manage.py test
	cd frontend && npm test -- --watchAll=false

lint:
	flake8 backend/hrms
	cd frontend && npm run build

k8s-apply:
	kubectl apply -k k8s/

k8s-delete:
	kubectl delete -k k8s/

clean:
	docker compose down -v --remove-orphans
