"""
HRMS Messaging & Event-Driven Subsystem.
Supports RabbitMQ task queues, Kafka event streaming, and n8n webhooks.
"""

from .rabbitmq import publish_task
from .kafka_producer import publish_event
from .n8n_webhooks import trigger_n8n_webhook

__all__ = ['publish_task', 'publish_event', 'trigger_n8n_webhook']
