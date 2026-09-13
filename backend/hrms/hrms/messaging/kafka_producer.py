"""
Apache Kafka Event Producer for HRMS Lite.
Streams real-time events for telemetry, audit logging, and external microservices.
"""

import os
import json
import logging
import threading
from datetime import datetime

logger = logging.getLogger('hrms')

KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092').split(',')
KAFKA_ENABLED = os.getenv('KAFKA_ENABLED', 'True').lower() in ('true', '1', 'yes')
KAFKA_CLIENT_ID = os.getenv('KAFKA_CLIENT_ID', 'hrms-backend-producer')

_producer_instance = None
_lock = threading.Lock()


def _get_kafka_producer():
    """Singleton lazy initializer for Kafka Producer."""
    global _producer_instance
    if not KAFKA_ENABLED:
        return None

    if _producer_instance is not None:
        return _producer_instance

    with _lock:
        if _producer_instance is not None:
            return _producer_instance

        try:
            from kafka import KafkaProducer
            _producer_instance = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                client_id=KAFKA_CLIENT_ID,
                value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8'),
                key_serializer=lambda k: str(k).encode('utf-8') if k else None,
                retries=2,
                request_timeout_ms=3000,
                max_block_ms=3000
            )
            logger.info(f"[Kafka] Producer initialized with servers: {KAFKA_BOOTSTRAP_SERVERS}")
        except Exception as e:
            logger.warning(f"[Kafka] Could not initialize Kafka producer ({e}). Falling back to disabled mode.")
            _producer_instance = None

    return _producer_instance


def publish_event(topic: str, event_type: str, data: dict, key: str = None, async_dispatch: bool = True) -> bool:
    """
    Publish an event to an Apache Kafka topic.

    :param topic: Kafka topic name (e.g. 'hrms.employee.events', 'hrms.attendance.events')
    :param event_type: Event classification (e.g. 'EMPLOYEE_CREATED', 'ATTENDANCE_CHECKIN')
    :param data: Event payload dictionary
    :param key: Optional partition key (e.g. employee_id)
    :param async_dispatch: Whether to execute network call in background thread
    """
    if not KAFKA_ENABLED:
        return False

    payload = {
        'event_id': f"{event_type}_{datetime.utcnow().timestamp()}",
        'event_type': event_type,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'data': data
    }

    def _send():
        try:
            producer = _get_kafka_producer()
            if not producer:
                return False
            future = producer.send(topic, key=key, value=payload)
            producer.flush(timeout=2)
            logger.info(f"[Kafka] Emitted '{event_type}' -> '{topic}' (Key: {key})")
            return True
        except Exception as e:
            logger.warning(f"[Kafka] Failed to publish event '{event_type}' to '{topic}': {e}")
            return False

    if async_dispatch:
        t = threading.Thread(target=_send, daemon=True)
        t.start()
        return True
    else:
        return _send()
