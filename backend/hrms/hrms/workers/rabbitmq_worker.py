"""
HRMS RabbitMQ Asynchronous Task Worker.
Consumes background tasks from RabbitMQ (welcome emails, notifications, audit storage).

Usage:
    python -m hrms.workers.rabbitmq_worker
    or
    python manage.py run_rabbitmq_worker
"""

import os
import sys
import json
import time
import logging
from datetime import datetime

# Setup minimal logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] [RabbitMQ-Worker] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('hrms.rabbitmq_worker')

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', '5672'))
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'guest')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD', 'guest')
RABBITMQ_VHOST = os.getenv('RABBITMQ_VHOST', '/')
QUEUE_NAME = os.getenv('RABBITMQ_TASK_QUEUE', 'hrms_tasks')


def handle_send_welcome_email(data: dict):
    employee_name = data.get('full_name', 'Employee')
    employee_email = data.get('email', 'N/A')
    department = data.get('department', 'General')
    logger.info(f"📧 [Email Task] Dispatched Welcome Onboarding Email to {employee_name} <{employee_email}> (Dept: {department})")
    # In production, connect to SMTP or SendGrid / AWS SES here.
    return True


def handle_attendance_notification(data: dict):
    employee_id = data.get('employee_id', 'Unknown')
    action = data.get('action', 'Check-In')
    logger.info(f"🔔 [Notification Task] Attendance {action} confirmed for Employee ID: {employee_id}")
    return True


def handle_audit_log(data: dict):
    action = data.get('action', 'UNKNOWN')
    user = data.get('user', 'System')
    logger.info(f"📋 [Audit Task] Stored security audit trail: '{action}' initiated by {user}")
    return True


TASK_HANDLERS = {
    'send_welcome_email': handle_send_welcome_email,
    'attendance_notification': handle_attendance_notification,
    'audit_log': handle_audit_log,
}


def process_message(ch, method, properties, body):
    try:
        payload = json.loads(body.decode('utf-8'))
        task_type = payload.get('task_type', 'unknown')
        data = payload.get('data', {})
        timestamp = payload.get('timestamp', '')

        logger.info(f"📥 Processing task '{task_type}' (Created: {timestamp})")

        handler = TASK_HANDLERS.get(task_type)
        if handler:
            success = handler(data)
            if success:
                ch.basic_ack(delivery_tag=method.delivery_tag)
                logger.info(f"✅ Successfully completed task '{task_type}'")
            else:
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
                logger.warning(f"⚠️ Task '{task_type}' handler returned failure, requeued.")
        else:
            logger.info(f"ℹ️ Generic task '{task_type}' processed with payload: {data}")
            ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as err:
        logger.error(f"❌ Error processing message: {err}")
        # Ack to prevent poison pill loop in development, or requeue=False in production with DLQ
        ch.basic_ack(delivery_tag=method.delivery_tag)


def start_worker():
    import pika

    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        virtual_host=RABBITMQ_VHOST,
        credentials=credentials,
        heartbeat=600,
        blocked_connection_timeout=300
    )

    while True:
        try:
            logger.info(f"Connecting to RabbitMQ broker at {RABBITMQ_HOST}:{RABBITMQ_PORT}...")
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()

            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            channel.basic_qos(prefetch_count=10)
            channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_message)

            logger.info(f"🚀 RabbitMQ Worker started successfully. Listening for jobs on queue '{QUEUE_NAME}'...")
            channel.start_consuming()

        except (pika.exceptions.AMQPConnectionError, pika.exceptions.ConnectionClosedByBroker) as exc:
            logger.warning(f"Connection lost to RabbitMQ ({exc}). Retrying in 5 seconds...")
            time.sleep(5)
        except KeyboardInterrupt:
            logger.info("RabbitMQ Worker stopped by user.")
            break
        except Exception as e:
            logger.error(f"Unexpected worker error: {e}. Retrying in 5 seconds...")
            time.sleep(5)


if __name__ == '__main__':
    start_worker()
