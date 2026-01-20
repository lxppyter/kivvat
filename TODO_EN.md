# 📝 Project Roadmap & Todo

This file contains the current status, completed features, and remaining tasks of the Kivvat project. Updated based on the latest technical audit results.

### ✅ Completed Core Foundations
- [x] Monorepo Setup (NestJS + Next.js).
- [x] Cyber-Aesthetic Design Language.
- [x] Landing Page.

## 🔐 Authentication
- [x] **Register:** Secure registration flow with validation. [CORE]
- [x] **Login:** JWT-based, Argon2/Bcrypt protected login. [CORE]
- [x] **Session Management:** Access/Refresh Token mechanism (Silent Refresh). [CORE]

## 🛡️ Security Measures
- [x] **Rate Limiting:** API Throttling.
- [x] **Helmet & CORS:** Security headers.
- [x] **Input Validation:** Strict data control with `class-validator`.
- [ ] **2FA (Optional):** MFA infrastructure for critical operations.

## 📊 Dashboard & UI (Frontend)
- [x] **Dashboard UI:** Shadcn UI components, interactive widgets. [CORE]
- [x] **Live Data:** Dashboard connected to DB, removed from mock data. [CORE]
- [x] **Compliance Status:** Instant compliance score based on standards (ISO 27001). [CORE]

## ☁️ Cloud-Guardian (Infrastructure Audit)
- [x] **Scanner Engine:**
    - [x] **IAM:** Root MFA, Access Keys, Ghost Accounts (90 days). [CORE]
    - [x] **Storage:** S3 Encryption, Public Access Block. [CORE]
    - [x] **Network:** Security Groups (Port 22/3389 0.0.0.0/0 check). [CORE]
    - [x] **Risk Scoring:** Critical/High/Medium level risk analysis. [CORE]
- [x] **Multi-Cloud Support:**
    - [x] AWS Integration. [CORE]
    - [x] Azure Integration. [PRO]
        - **Dependencies**: `@azure/identity`, `@azure/arm-subscriptions`.
        - **Auth**: Service Principal (Client ID, Secret, Tenant).
        - **Verification**: List Subscriptions to verify access.
    - [x] GCP Integration. [PRO]
        - **Dependencies**: `@google-cloud/resource-manager`.
        - **Auth**: Service Account JSON Key.
        - **Verification**: `ProjectsClient.getProject`.

## 📸 Evidence-Auto (Automated Evidence)
- [x] **Timestamped Evidence:** Recording evidence to DB with timestamps. [CORE]
- [x] **Auto-Screenshooter:**
    - [x] Converting API evidence to visual screenshots (Puppeteer/Playwright). [CORE]
- [x] **Version History:**
    - [x] Audit history (Scan History). [CORE]
    - [x] **Policy Versioning:** Version tracking of company policies (v1.0 -> v1.2). [CORE]

## 📦 Asset-Intel (Asset Management)
- [x] **Cloud Inventory:** Automated discovery of AWS (EC2, S3, IAM) resources. [CORE]
- [x] **Detailed Asset Mgmt:**
    - [x] **Hardware Inventory:** Physical device addition/editing (Manual). [CORE]
    - [x] **Software Registry:** License tracking and expiration warnings. [CORE]
    - [x] **Endpoint Security:** Laptop/PC disk encryption check (Agent/Checklist). [CORE]

## 📜 Policy-Forge (Legislation Library)
- [x] **Ready Templates:** ISO/SOC2 templates with dynamic variables ({{companyName}}). [CORE]
- [x] **Employee Awareness:** Personnel policy assignment, signing, and tracking. [CORE]
- [x] **Gap Analysis:** Dashboard for gap analysis based on standards. [CORE]

## 💼 Auditor-X (Auditor Portal) [ENTERPRISE]
- [x] **Safe-Link Access:** Read-only, timed sharing link for auditors. [ENTERPRISE]
    - [x] **One-Click Export:**
    - [x] Export of entire compliance status as a single PDF/Excel package. [PRO]
    - [x] Output in auditor-friendly folder structure (Zip). [PRO]
    - [x] **Incident Response Log:** Detection, intervention, and closing records of security breaches. [PRO]

## 🚀 Future Plans (Upcoming)
- [x] **SSL/TLS Certificate Monitor:** Expiration check for Load Balancer and Endpoint certificates. [PRO]
- [x] **Remediation Guidance:** Step-by-step improvement guides for vulnerabilities. [PRO]
- [x] **Configuration Drift:** Analysis of configuration changes (Diff). [PRO]
- [x] **Vendor Risk Management:** Certificate/security tracking of 3rd party software. [PRO]
- [x] **Payment Infrastructure (Gumroad):** License Key Verification system.
- [x] **Landing Page UI & Content Improvements:** Polishing the design and strengthening marketing texts.
- [x] **System Security Improvements:** Hardening the system against OWASP Top 10 vulnerabilities (Injection, Broken Auth, etc.).

## 💰 Subscription and Packaging (SaaS Model)
- [x] **Feature Gating:** Frontend (RequirePro) and Backend (SubscriptionGuard) protections.
- [x] **Limit Enforcement:** Package-based resource (1/3/Unlimited) and standard (KVKK/ISO/SOC2) limits.
- [x] **Prepaid License Model:** "Free -> Pro" upgrade flow with prepaid license key.
- [x] **Total Lockdown:** Full access restriction for Free users (except Billing).
