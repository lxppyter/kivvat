# Kivvat (Regu-Track) 🛡️

**Enterprise Compliance Automation & Security Observation Platform**

Kivvat is a next-generation, AI-driven security and compliance platform designed to automate the painful process of audit readiness (SOC2, ISO 27001) and infrastructure security monitoring.

Unlike traditional tools that require heavy agent installation, Kivvat uses an **Agentless** architecture to scan your cloud infrastructure (AWS, Azure, GCP) in real-time, providing an instant visual map of your security posture.


## 🚀 Tech Stack

Built with a high-performance, type-safe monorepo architecture:

**Core:**
- **Monorepo Manager:** [TurboRepo](https://turbo.build/)
- **Package Manager:** `npm` / `pnpm`

**Backend (`apps/api`):**
- **Framework:** [NestJS](https://nestjs.com/) (Modular, Scalable Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma / TypeORM
- **Validation:** `class-validator`
- **Cloud SDKs:** AWS SDK v3

**Frontend (`apps/web`):**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [GSAP](https://gsap.com/) (ScrollTrigger, Flip)
- **Icons:** Lucide React
- **Design System:** Custom "Lambda" Aesthetic (JetBrains Mono, Sharp Edges, Warm Black)

---

## ✨ Key Features

- **📡 Agentless Scanning**: No installation required on target servers. Connect via cloud APIs and start scanning in minutes.
- **🗺️ Visual Infrastructure Map**: Real-time `ScanRadar` technology visualizes your entire network topology and highlights vulnerabilities instantly.
- **🤖 Gap Analysis**: Automatically maps your infrastructure configurations to compliance control frameworks (ISO 27001, SOC2, HIPAA).
- **⚡ "Warm Black" Aesthetic**: A premium, developer-centric dark mode UI designed for long operational sessions without eye strain.
- **📊 Dynamic Reporting**: Generate audit-ready PDF reports with a single click.

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Cloud Provider Credentials (AWS/GCP/Azure) for scanning (Optional for UI dev)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kivvat.git
   cd kivvat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create `.env` files in `apps/api` and `apps/web` based on the examples.
   
   **`apps/api/.env`**:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   JWT_SECRET="super-secret-key"
   AWS_ACCESS_KEY_ID="..."
   ```

4. **Run the Development Server:**
   This command starts both the Backend (NestJS) and Frontend (Next.js) in parallel.
   ```bash
   npm run dev
   ```

   - **Frontend:** http://localhost:3000
   - **Backend:** http://localhost:3001

---

## 📂 Project Structure

```
kivvat/
├── apps/
│   ├── api/          # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── modules/    # Compliance, Evidence, Auth Modules
│   │   │   └── common/     # Guards, Interceptors, Decorators
│   │   └── ...
│   └── web/          # Next.js Frontend Application
│       ├── src/
│       │   ├── app/        # App Router Pages
│       │   ├── components/ # Shared UI Components (Auth, Landing)
│       │   └── lib/        # Utils, Hooks
│       └── ...
├── packages/         # Shared Libraries (Optional)
├── turbo.json        # TurboRepo Configuration
└── package.json      # Root Dependencies
```

---

## 🎨 Design System

The UI follows the **"Lambda/Cyber"** design language:
- **Font:** `JetBrains Mono` for headers and data, `Inter` for body text.
- **Colors:** 
    - Background: `#0b0b0b` (Warm Black)
    - Primary: `#e7e6d9` (Off-White)
    - Accents: `#0D9488` (Teal), `#F59E0B` (Amber) for warnings.
- **Philosophy:** Information density, sharp edges (`rounded-none`), high contrast, and fluid motion.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

&copy; 2026 Kivvat Inc. All Rights Reserved.
