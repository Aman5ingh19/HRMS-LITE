"""
RabbitMQ Producer / Task Publisher for HRMS Lite.
Handles asynchronous task queueing (emails, audit logs, background exports).
"""

import os
import json
import logging
import threading
from datetime import datetime

logger = logging.getLogger('hrms')

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', '5672'))
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'guest')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD', 'guest')
RABBITMQ_VHOST = os.getenv('RABBITMQ_VHOST', '/')
RABBITMQ_ENABLED = os.getenv('RABBITMQ_ENABLED', 'True').lower() in ('true', '1', 'yes')

DEFAULT_QUEUE = 'hrms_tasks'


def _send_to_rabbitmq(queue_name: str, payload: dict):
    """Internal helper to publish a message over AMQP."""
    try:
        import pika
    except ImportError:
        logger.warning("[RabbitMQ] pika is not installed. Task skipping.")
        return False

    try:
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
        parameters = pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            virtual_host=RABBITMQ_VHOST,
            credentials=credentials,
            connection_attempts=2,
            retry_delay=1,
            socket_timeout=3
        )
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        # Declare durable queue
        channel.queue_declare(queue=queue_name, durable=True)

        message_body = json.dumps(payload, default=str)
        channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=message_body.encode('utf-8'),
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
                content_type='application/json',
                timestamp=int(datetime.utcnow().timestamp())
            )
        )
        connection.close()
        logger.info(f"[RabbitMQ] Successfully published task to '{queue_name}': {payload.get('task_type')}")
        return True
    except Exception as e:
        logger.warning(f"[RabbitMQ] Could not dispatch task to '{queue_name}': {e}")
        return False


def publish_task(task_type: str, data: dict, queue_name: str = DEFAULT_QUEUE, async_dispatch: bool = True) -> bool:
    """
    Publish an asynchronous task to RabbitMQ.
    
    :param task_type: Identifier of the background job (e.g., 'send_welcome_email', 'generate_report')
    :param data: Dictionary containing parameters for the task
    :param queue_name: RabbitMQ destination queue
    :param async_dispatch: If True, dispatches the network call in a background thread to prevent API blocking
    """
    if not RABBITMQ_ENABLED:
        logger.debug(f"[RabbitMQ] Disabled by configuration. Skipping task {task_type}")
        return False

    payload = {
        'task_type': task_type,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'data': data
    }

    if async_dispatch:
        t = threading.Thread(target=_send_to_rabbitmq, args=(queue_name, payload), daemon=True)
        t.start()
        return True
    else:
        return _send_to_rabbitmq(queue_name, payload)
