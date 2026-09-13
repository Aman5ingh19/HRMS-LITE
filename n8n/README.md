# 🤖 HRMS-Lite n8n Workflow Automation

This directory contains pre-configured low-code workflow templates for the **n8n Automation Engine** bundled with HRMS-Lite.

---

## 🚀 Getting Started with n8n

When you run `docker compose up -d`, n8n starts automatically at:
👉 **[http://localhost:5678](http://localhost:5678)**

---

## 📥 How to Import Pre-built Workflows

1. Open your browser and navigate to `http://localhost:5678`.
2. Click on **Workflows** in the left sidebar.
3. Click the **+ Add Workflow** button (or the `...` menu on the top right) and select **Import from File...**.
4. Select any of the JSON templates in this directory:
   - `employee_onboarding.json`: Welcomes new hires, dispatches welcome email, and posts announcement to Slack.
   - `daily_attendance_digest.json`: Automated daily cron at 18:00 compiling workforce attendance statistics.
   - `anomaly_alert.json`: Instant alerts for attendance irregularities.
5. Click **Save** and toggle the workflow **Active** (switch in top right).

---

## ⚙️ Environment Configuration

In your `backend/hrms/.env`:
```env
N8N_WEBHOOK_ENABLED=True
N8N_WEBHOOK_BASE_URL=http://n8n:5678/webhook
N8N_WEBHOOK_SECRET=hrms-n8n-secure-token
```
