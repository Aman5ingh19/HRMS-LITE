"""
Management command to run the Apache Kafka event stream consumer.
"""

from django.core.management.base import BaseCommand
from hrms.workers.kafka_consumer import start_consumer


class Command(BaseCommand):
    help = 'Starts the Apache Kafka consumer for real-time telemetry and event processing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting HRMS Kafka Stream Consumer..."))
        start_consumer()
