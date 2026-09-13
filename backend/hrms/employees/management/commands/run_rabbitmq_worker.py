"""
Management command to run the RabbitMQ background worker.
"""

from django.core.management.base import BaseCommand
from hrms.workers.rabbitmq_worker import start_worker


class Command(BaseCommand):
    help = 'Starts the RabbitMQ task worker for background jobs and notifications'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting HRMS RabbitMQ Worker..."))
        start_worker()
