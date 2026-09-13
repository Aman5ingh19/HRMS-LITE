"""
HRMS Apache Kafka Real-Time Stream Consumer.
Listens to distributed event streams for live telemetry, real-time analytics, and audit logging.

Usage:
    python -m hrms.workers.kafka_consumer
    or
    python manage.py run_kafka_consumer
"""

import os
import sys
import json
import time
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] [Kafka-Consumer] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('hrms.kafka_consumer')

KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092').split(',')
KAFKA_CONSUMER_GROUP = os.getenv('KAFKA_CONSUMER_GROUP', 'hrms-analytics-group')
TOPICS = [
    'hrms.employee.events',
    'hrms.attendance.events',
    'hrms.audit.logs'
]


def handle_employee_event(event_type: str, data: dict, timestamp: str):
    emp_id = data.get('employee_id', 'N/A')
    name = data.get('full_name', 'N/A')
    dept = data.get('department', 'N/A')
    logger.info(f"📊 [Stream-Analytics] Employee Event '{event_type}' -> ID: {emp_id}, Name: {name}, Dept: {dept}")


def handle_attendance_event(event_type: str, data: dict, timestamp: str):
    emp_id = data.get('employee_id', 'N/A')
    check_in = data.get('check_in', 'N/A')
    duration = data.get('duration_minutes', 0)
    logger.info(f"⏱️ [Stream-Analytics] Attendance Telemetry '{event_type}' -> ID: {emp_id}, Duration: {duration} mins")


def handle_audit_event(event_type: str, data: dict, timestamp: str):
    user = data.get('user', 'system')
    action = data.get('action', 'N/A')
    ip = data.get('ip_address', 'local')
    logger.info(f"🛡️ [Stream-Audit] Audit Stream '{event_type}' -> User: {user}, Action: {action}, IP: {ip}")


def start_consumer():
    from kafka import KafkaConsumer
    from kafka.errors import NoBrokersAvailable

    while True:
        try:
            logger.info(f"Connecting to Kafka cluster at {KAFKA_BOOTSTRAP_SERVERS} for topics {TOPICS}...")
            consumer = KafkaConsumer(
                *TOPICS,
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                group_id=KAFKA_CONSUMER_GROUP,
                auto_offset_reset='earliest',
                enable_auto_commit=True,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                consumer_timeout_ms=1000
            )

            logger.info(f"🚀 Kafka Consumer started successfully. Consuming topics: {TOPICS} (Group: {KAFKA_CONSUMER_GROUP})...")

            while True:
                for message in consumer:
                    try:
                        payload = message.value
                        topic = message.topic
                        event_type = payload.get('event_type', 'UNKNOWN')
                        data = payload.get('data', {})
                        timestamp = payload.get('timestamp', '')

                        logger.info(f"⚡ [Event Received] Topic: '{topic}' | Event: '{event_type}' | Partition: {message.partition}")

                        if topic == 'hrms.employee.events':
                            handle_employee_event(event_type, data, timestamp)
                        elif topic == 'hrms.attendance.events':
                            handle_attendance_event(event_type, data, timestamp)
                        elif topic == 'hrms.audit.logs':
                            handle_audit_event(event_type, data, timestamp)
                        else:
                            logger.info(f"Generic stream event: {payload}")

                    except Exception as err:
                        logger.error(f"Error handling stream record: {err}")

                time.sleep(0.5)

        except NoBrokersAvailable:
            logger.warning("Kafka cluster not reachable yet. Retrying connection in 5 seconds...")
            time.sleep(5)
        except KeyboardInterrupt:
            logger.info("Kafka Consumer stopped by user.")
            break
        except Exception as e:
            logger.error(f"Kafka consumer error: {e}. Re-initializing in 5 seconds...")
            time.sleep(5)


if __name__ == '__main__':
    start_consumer()
