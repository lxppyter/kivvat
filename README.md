# Kivvat (Regu-Track) 🛡️

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Next.js%20%7C%20Prisma-blue)
![License](https://img.shields.io/badge/license-Private-red)
![Compliance](https://img.shields.io/badge/compliance-ISO27001%20%7C%20SOC2-orange)

> **Enterprise Compliance Automation & Security Observation Platform**

Kivvat is a next-generation security and compliance platform designed to automate the painful process of audit readiness (SOC2, ISO 27001, KVKK) and infrastructure security monitoring.

Unlike traditional tools that require heavy agent installation, Kivvat uses an **Agentless** architecture to scan your cloud infrastructure (AWS, Azure, GCP) in real-time, providing an instant visual map of your security posture.

---

## 🚀 Key Features

### 🔌 Agentless Multi-Cloud Scanning
Connect your cloud accounts via API and start scanning in minutes without installing agents on your servers.
- **AWS**: IAM, S3, EC2, CloudTrail
- **Azure**: Storage, SQL, VM Security
- **GCP**: IAM, Cloud SQL, Compute Engine

### 📊 Unified Compliance Dashboard
Automatically map technical findings to compliance Frameworks.
- **Standards**: ISO 27001, SOC 2 Type II, KVKK.
- **Visuals**: Real-time compliance scorecards and progress tracking.
- **Reporting**: One-click PDF generation with Executive Summaries.

### 📜 Policy Management & Digital Signatures
Manage the human side of compliance.
- **Policy Hub**: Distribute and track employee acceptance of security policies.
- **Templates**: Built-in library of ISO-compliant policy templates.
- **Digital Signatures**: Time-stamped approval tracking.

### 📸 Interface Preview

<div align="center">
  <img src="./assets/1.png" width="100%" />
  <img src="./assets/2.png" width="100%" />
  <img src="./assets/3.png" width="100%" />
  <img src="./assets/4.png" width="100%" />
  <img src="./assets/5.png" width="100%" />
  <img src="./assets/6.png" width="100%" />
  <img src="./assets/7.png" width="100%" />
  <img src="./assets/8.png" width="100%" />
</div>

### 🔐 Auditor Portal
Streamline the external audit process.
- **Safe-Link Sharing**: Provide read-only access to auditors via secure, time-bound links.
- **Evidence Archive**: Immutable logs of all compliance checks and artifacts.

---

## 🛠️ Tech Stack

Built with a high-performance, type-safe monorepo architecture:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | [NestJS](https://nestjs.com/) | Scaleable Node.js framework with modular architecture. |
| **Frontend** | [Next.js 16](https://nextjs.org/) | React Server Components, App Router. |
| **Database** | PostgreSQL & [Prisma](https://www.prisma.io/) | Type-safe database access and schema management. |
| **UI System** | [Shadcn/UI](https://ui.shadcn.com/) | Accessible, customizable component primitives. |
| **Scanning** | AWS/Azure/GCP SDKs | Native cloud integrations. |

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Cloud Credentials (AWS/Azure/GCP) _(Optional for local dev)_

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lxppyter/kivvat.git
   cd kivvat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create `.env` file in `apps/api` (see `.env.example`).
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   JWT_SECRET="generate-secret-key"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma migrate dev
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:3001`
   - Backend: `http://localhost:3000`

---

## 📂 Project Structure

```
kivvat/
├── apps/
│   ├── api/          # NestJS Backend (Scanner Engine, REST API)
│   └── web/          # Next.js Frontend (Dashboard, Auditor Portal)
├── packages/         # Shared libraries and configs
└── turbo.json        # TurboRepo build configuration
```

---

## 📝 Roadmap

- [x] Multi-Cloud Support (AWS, Azure, GCP)
- [x] Compliance Reporting Engine
- [x] Policy Management
- [ ] **Incident Response Log** (Upcoming)
- [ ] **SSL/TLS Certificate Monitor** (Upcoming)
- [ ] **Remediation Guidance** (Upcoming)

---

&copy; 2026 Kivvat Inc. All Rights Reserved.
