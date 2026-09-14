import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Building2, Users, CheckSquare, Eye,
    Shield, Code2, Heart,
    Zap, RefreshCw, LayoutDashboard, Cloud, Database,
    Activity, Radio, Cpu, Layers, Server, GitBranch
} from 'lucide-react';
import './About.css';

const features = [
    {
        icon: LayoutDashboard,
        title: 'Live Operational Dashboard',
        desc: 'Real-time database metrics, presence rates, heatmap attendance calendar, and department distributions live from MongoDB Atlas.',
        color: '#667eea',
    },
    {
        icon: Users,
        title: 'Employee Lifecycle Management',
        desc: 'Full CRUD with Pydantic validation, instant search & pagination, and Cloudinary smart face-crop photo uploads.',
        color: '#48bb78',
    },
    {
        icon: CheckSquare,
        title: 'Attendance & Telemetry Streaming',
        desc: '1-click check-in/out with automated duration calculation (`Xh Ym`) and real-time telemetry streaming to Apache Kafka.',
        color: '#ed8936',
    },
    {
        icon: Activity,
        title: 'RabbitMQ Async Task Queues',
        desc: 'Decoupled asynchronous background processing for welcome onboarding emails, audit trails, and Slack notifications.',
        color: '#f97316',
    },
    {
        icon: Radio,
        title: 'Kafka Real-Time Event Streaming',
        desc: 'Distributed event bus (`hrms.employee.events`, `hrms.attendance.events`) with standalone stream consumers and Kafka UI.',
        color: '#3b82f6',
    },
    {
        icon: Cpu,
        title: 'n8n Workflow Automation',
        desc: 'Low-code automation engine triggering multi-step workflows on employee registration, daily attendance digests, and anomaly alerts.',
        color: '#ea4b71',
    },
    {
        icon: Layers,
        title: 'Kubernetes & HPA Auto-Scaling',
        desc: 'Production-ready K8s manifests and Helm Chart with Horizontal Pod Autoscaler scaling from 2 to 10 pods under peak traffic.',
        color: '#8b5cf6',
    },
    {
        icon: GitBranch,
        title: 'GitHub Actions CI/CD',
        desc: 'Automated test suites, Flake8 linting, Bandit security scanning, and multi-arch Docker image container publishing to GHCR.',
        color: '#10b981',
    },
    {
        icon: Eye,
        title: 'Curated Guest Exploration Mode',
        desc: 'Safe, read-only demo mode allowing recruiters and stakeholders to explore all features with zero risk of data mutation.',
        color: '#9f7aea',
    },
    {
        icon: Shield,
        title: 'Clerk Identity & RBAC',
        desc: 'Enterprise OAuth2 authentication, multi-factor security, and JWT authorization headers protecting sensitive endpoints.',
        color: '#4299e1',
    },
    {
        icon: RefreshCw,
        title: 'Zero-Flicker Dark / Light Themes',
        desc: 'Full CSS variable design system synchronized with native browser color-scheme and persistent user session settings.',
        color: '#fc8181',
    },
    {
        icon: Zap,
        title: 'Redis In-Memory Caching',
        desc: 'High-performance query caching and rate limiting reducing database read latency by ~70% and preventing N+1 bottlenecks.',
        color: '#ef4444',
    },
];

const techStack = [
    { label: 'React 18', category: 'Frontend' },
    { label: 'Nginx Alpine', category: 'Web Server' },
    { label: 'Django 5 REST', category: 'Backend' },
    { label: 'Gunicorn WSGI', category: 'Backend' },
    { label: 'MongoDB Atlas', category: 'Database' },
    { label: 'Redis 7 Alpine', category: 'Cache' },
    { label: 'Apache Kafka 3.5', category: 'Streaming' },
    { label: 'RabbitMQ 3.12', category: 'Task Queue' },
    { label: 'n8n Engine', category: 'Automation' },
    { label: 'Docker & Compose', category: 'Containers' },
    { label: 'Kubernetes (K8s)', category: 'Orchestration' },
    { label: 'Helm 3', category: 'DevOps' },
    { label: 'GitHub Actions', category: 'CI/CD' },
    { label: 'Clerk Identity', category: 'Auth' },
    { label: 'Cloudinary CDN', category: 'Media' },
    { label: 'Pydantic & Zod', category: 'Validation' },
];

export default function About() {
    const { isGuest } = useAuth();

    return (
        <div className="about-page">

            {/* Hero Banner */}
            <div className="about-hero">
                <div className="about-hero-bg" />
                <div className="about-hero-content">
                    <div className="about-logo">
                        <Building2 size={42} />
                    </div>
                    <h1 className="about-hero-title">HRMS Lite</h1>
                    <p className="about-hero-tagline">Enterprise Cloud-Native & Distributed Event-Driven HR Management Platform</p>
                    {isGuest && (
                        <div className="about-guest-badge">
                            <Eye size={13} />
                            Guest Mode — Read-Only Exploration
                        </div>
                    )}
                </div>
            </div>

            {/* About Summary */}
            <div className="about-card about-summary">
                <h2 className="about-section-title">What is HRMS Lite?</h2>
                <p className="about-text">
                    <strong>HRMS Lite</strong> is an enterprise-grade, distributed Human Resource Management System built for modern, high-throughput organizations.
                    Engineered with a decoupled event-driven architecture, it combines a responsive <strong>React 18 Single Page App (Nginx)</strong>, 
                    a high-performance <strong>Django 5 REST Framework</strong> backend with Pydantic validation, <strong>MongoDB Atlas</strong> cloud persistence, 
                    <strong>Redis</strong> caching, <strong>Apache Kafka</strong> distributed event streaming, <strong>RabbitMQ</strong> asynchronous task queuing, 
                    <strong>n8n</strong> low-code workflow automation, and <strong>Kubernetes (K8s)</strong> auto-scaling.
                </p>
                <p className="about-text">
                    Designed with both <strong>administrators</strong> (full management control) and <strong>guests/evaluators</strong> (read-only live exploration)
                    in mind, HRMS Lite delivers an enterprise cloud experience with zero unnecessary complexity.
                </p>
            </div>

            {/* Features Grid */}
            <div className="about-section">
                <h2 className="about-section-title">Key Architectural Features</h2>
                <div className="about-features-grid">
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div key={f.title} className="about-feature-card">
                                <div className="about-feat-icon" style={{ background: f.color + '18', color: f.color }}>
                                    <Icon size={22} />
                                </div>
                                <h3 className="about-feat-title">{f.title}</h3>
                                <p className="about-feat-desc">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="about-section">
                <h2 className="about-section-title">Distributed Tech Stack</h2>
                <div className="about-tech-list">
                    {techStack.map((t) => (
                        <div key={t.label} className="about-tech-chip">
                            <span className="about-tech-category">{t.category}</span>
                            <span className="about-tech-label">{t.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Architecture Overview */}
            <div className="about-section">
                <h2 className="about-section-title">Distributed Architecture Overview</h2>
                <div className="about-arch-grid">
                    <div className="about-arch-block arch-frontend">
                        <Code2 size={20} />
                        <strong>React 18 + Nginx</strong>
                        <p>Production React SPA client served via Nginx Alpine with gzip compression, asset caching, and reverse proxy routing.</p>
                    </div>
                    <div className="about-arch-arrow">&#8594;</div>
                    <div className="about-arch-block arch-backend">
                        <Server size={20} />
                        <strong>Django 5 API</strong>
                        <p>REST API with Pydantic validation, Redis caching, Gunicorn WSGI workers, and non-blocking event dispatchers.</p>
                    </div>
                    <div className="about-arch-arrow">&#8594;</div>
                    <div className="about-arch-block arch-db">
                        <Database size={20} />
                        <strong>MongoDB Atlas</strong>
                        <p>Cloud NoSQL cluster storing scalable employee records and attendance history with automated high availability.</p>
                    </div>
                </div>
            </div>

            {/* Cloud & DevOps Infrastructure */}
            <div className="about-section">
                <h2 className="about-section-title">Cloud Infrastructure & Distributed Engines</h2>
                <div className="about-features-grid">
                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                            <Database size={22} />
                        </div>
                        <h3 className="about-feat-title">MongoDB Atlas</h3>
                        <p className="about-feat-desc">Fully-managed cloud NoSQL cluster for personnel records and attendance logs with automated cloud backups.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                            <Zap size={22} />
                        </div>
                        <h3 className="about-feat-title">Redis 7 In-Memory Cache</h3>
                        <p className="about-feat-desc">In-memory caching and session broker reducing database read latency by ~70% and managing API rate limits.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(249, 115, 22, 0.12)', color: '#f97316' }}>
                            <Activity size={22} />
                        </div>
                        <h3 className="about-feat-title">RabbitMQ Message Broker</h3>
                        <p className="about-feat-desc">Asynchronous task queues and standalone worker consumer processing welcome emails, alerts, and audit logs.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                            <Radio size={22} />
                        </div>
                        <h3 className="about-feat-title">Apache Kafka Streaming</h3>
                        <p className="about-feat-desc">Distributed event bus streaming live employee and attendance telemetry with real-time consumer aggregation.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(234, 75, 113, 0.12)', color: '#ea4b71' }}>
                            <Cpu size={22} />
                        </div>
                        <h3 className="about-feat-title">n8n Workflow Automation</h3>
                        <p className="about-feat-desc">Low-code automation canvas executing multi-channel onboarding workflows, daily digests, and Slack notifications.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                            <Layers size={22} />
                        </div>
                        <h3 className="about-feat-title">Kubernetes (K8s) & Helm</h3>
                        <p className="about-feat-desc">Container orchestration with Horizontal Pod Autoscaler (HPA), Ingress TLS routing, and 1-command Helm deployment.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(51, 65, 85, 0.12)', color: '#334155' }}>
                            <GitBranch size={22} />
                        </div>
                        <h3 className="about-feat-title">GitHub Actions CI/CD</h3>
                        <p className="about-feat-desc">Automated CI/CD pipelines for linting (`flake8`), Bandit security scanning, and multi-arch Docker image publishing to GHCR.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
                            <Cloud size={22} />
                        </div>
                        <h3 className="about-feat-title">Cloudinary Media CDN</h3>
                        <p className="about-feat-desc">Global image CDN delivering employee avatars and photos with smart face-centering crop and WebP compression.</p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                            <Shield size={22} />
                        </div>
                        <h3 className="about-feat-title">Clerk Identity & RBAC</h3>
                        <p className="about-feat-desc">Enterprise-grade authentication, multi-factor security, and JWT authorization headers protecting sensitive APIs.</p>
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <div className="about-footer-note">
                <Heart size={14} className="about-heart" />
                <span>Built with love · HRMS Lite · {new Date().getFullYear()}</span>
            </div>
        </div>
    );
}
