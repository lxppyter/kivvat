# Kivvat (Regu-Track) 🛡️

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Next.js%2016%20%7C%20Prisma-blue)
![License](https://img.shields.io/badge/license-Private-red)
![Compliance](https://img.shields.io/badge/compliance-ISO27001%20%7C%20SOC2-orange)

> **Kivvat OS: The Autonomous Digital Security Engineer**

Kivvat is an AI-powered autonomous security engineer designed to handle audit readiness (SOC2, ISO 27001, KVKK) and specialized security operations without human intervention.

Unlike traditional tools, Kivvat uses a **Zero-Data Access** and **Agentless** architecture to scan your cloud infrastructure (AWS, Azure, GCP), guaranteeing privacy while providing deep security insights.

---

## 🚀 Key Features

### 🔌 Agentless Multi-Cloud Scanning
Connect your cloud accounts via API and start scanning in minutes.
- **AWS**: IAM, S3, EC2, CloudTrail
- **Azure**: Storage, SQL, VM Security
- **GCP**: IAM, Cloud SQL, Compute Engine

### ⚡ Certification Fast-Track
Accelerate your audit process with our project-based solution.
- **90-Day Guarantee**: Get audit-ready for SOC2/ISO27001 in 3 months.
- **One-Time Payment**: No long-term subscriptions for urgent needs.
- **Auto-Evidence**: Automated evidence collection and packaging.

### 📊 Unified Compliance Dashboard
Automatically map technical findings to compliance Frameworks.
- **Standards**: ISO 27001, SOC 2 Type II, KVKK.
- **Visuals**: Real-time compliance scorecards and progress tracking.
- **Reporting**: One-click PDF generation with Executive Summaries.

### 📜 Policy Management & Digital Signatures
Manage the human side of compliance.
- **Policy Hub**: Distribute and track employee acceptance.
- **Templates**: Built-in library of ISO-compliant policy templates.
- **Digital Signatures**: Time-stamped approval tracking.

### 📸 Interface Preview

<div align="center">
  <img src="./assets/1.png" width="100%" />
  <img src="./assets/2.png" width="100%" />
  <img src="./assets/3.png" width="100%" />
  <img src="./assets/4.png" width="100%" />
  <img src="./assets/5.png" width="100%" />
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
| **Styling** | [TailwindCSS v4](https://tailwindcss.com/) | High-performance utility-first CSS engine. |
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
   
   **Backend (`apps/api`):**
   Rename `apps/api/.env.example` to `.env` and update credentials.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   JWT_SECRET="secure-key"
   ```

   **Frontend (`apps/web`):**
   Rename `apps/web/.env.example` to `.env`.
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
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
- [x] **Incident Response Log**
- [x] **SSL/TLS Certificate Monitor**
- [ ] **Remediation Guidance** (Upcoming)

---

&copy; 2026 Kivvat Inc. All Rights Reserved.
