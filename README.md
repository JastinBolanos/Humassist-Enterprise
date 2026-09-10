# HUMASSIST Enterprise v2.0.0-ENT

![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square&logo=github-actions)
![Deployment](https://img.shields.io/badge/Deployment-Production%20Ready-blue?style=flat-square&logo=google-cloud)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture%20%2F%20RBAC-indigo?style=flat-square)
![Security & Compliance](https://img.shields.io/badge/Security-Strict%20Zero--Trust%20Proxy-slate?style=flat-square)

> **HUMASSIST Enterprise** is a comprehensive, high-availability Enterprise Resource Planning (ERP) and strategic human capital orchestration platform. Designed for corporations and multinational organizations, it centralizes payroll automation with regulatory tax calculation, attendance tracking and telemetry with biometric/geolocation validation, contractual incident management, and strict security governance under role-based access control (RBAC) matrices.
>
> 🟢 **[View Live Platform (Production)](https://humassist-enterprise.prod.corp.internal)**

![HUMASSIST Enterprise Preview](https://github.com/user-attachments/assets/9fce6e1d-cb0e-4938-9790-3eac43f18d26)

---

## 🎥 ERP Platform Demo

**🎬 HUMASSIST Operational Walkthrough**  
Exploration of the enterprise interface: automated payroll management, real-time attendance control, comprehensive talent file administration, and simulation of the role-based access control (RBAC) privilege matrix.

https://github.com/user-attachments/assets/6cfa38cc-3d95-4c21-a186-4bdf65c2f987

---

## 🏛️ System Architecture & Tech Stack

The platform operates under the **Clean Architecture** paradigm on the client, isolating pure domain entities, transactional use cases, and reactive interface adapters, coupled with a secure perimeter proxy layer.

> *Compliance Notice*: This repository exclusively exposes the presentation layer (Frontend/Edge) and API Gateway for technical demonstration purposes. To emulate the regulatory compliance standards of an actual corporate environment (ISO 27001 / SOC 2), data persistence engines and settlement microservices have been decoupled and simulated via local persistence, assuming they would operate within isolated networks (VPC) in production.

### Core & Runtime
- **TypeScript (`~5.8.2`)**: Strict type system that enforces domain invariants and prevents compile-time errors.
- **React 19 (`^19.0.1`) & React DOM (`^19.0.1`)**: Declarative concurrent rendering engine with high state efficiency.
- **Vite (`^6.2.3`) & @vitejs/plugin-react (`^5.0.4`)**: Optimized bundling pipeline with dynamic code splitting.

### UI, Rendering & Motion
- **Tailwind CSS v4 (`^4.1.14`) & @tailwindcss/vite (`^4.1.14`)**: High-performance utility-first CSS engine with compile-time layout optimization.
- **Motion (`^12.23.24`)**: Declarative animation orchestration, fluid layout transitions, and interface microinteractions.
- **Lucide React (`^0.546.0`)**: Vector icon catalog optimized for enterprise accessibility.
- **Autoprefixer (`^10.4.21`)**: Automated cross-browser style compatibility.

### Inference Engine & Smart Telemetry
- **@google/genai (`^2.4.0`)**: Integration SDK for multimodal language models and contextual inference supporting human capital management.

### Backend, Secure Proxy & Edge Server
- **Express (`^4.21.2`)**: Perimeter server for request intermediation, header controls, and secure proxy routing.
- **tsx (`^4.21.0`) & esbuild (`^0.25.0`)**: Ultra-fast transpiler and bundler for Node.js runtime deployment.
- **dotenv (`^17.2.3`)**: Secure and isolated server environment variable injection.
- **@types/node (`^22.14.0`) & @types/express (`^4.17.21`)**: Strict typing for system and network interfaces.

---

## 💼 Operational Modules (Deployed)

1. **Executive Dashboard & Metrics**
   - Real-time consolidation of key performance indicators (KPIs), accrued payroll, weighted punctuality index, absenteeism rates, and corporate division budget breakdowns.

2. **Compensation & Tax Disbursement Engine (`Payroll Engine`)**
   - Automated earnings and deductions calculation module compliant with current regulations (income tax, social security, pension funds, overtime, and bonuses).
   - Generation, pre-authorization, simulated tax stamping, and issuance of auditable digital pay slips with export to standard formats.

3. **Shift Telemetry & Attendance Tracking (`Time & Attendance Tracking`)**
   - Logging of clock-ins, breaks, and clock-outs with biometric verification and geolocation coordinate validation.
   - Request, review, and resolution workflows for leaves of absence, disability leaves, and vacation periods with supervisory auditing.

4. **Employee Directory & Personnel Records (`Employee Registry & Directory`)**
   - 360° employee lifecycle administration: contractual onboarding, disbursement bank details, emergency contacts, department assignments, and performance traceability.

5. **RBAC Privilege Matrix & Governance (`Role-Based Access Control`)**
   - Granular access control segregated across 5 strategic roles: *Super Admin*, *HR Director*, *Payroll Specialist*, *Operations Supervisor*, and *Employee*.
   - Dynamic simulator for real-time privilege auditing and contextual view previewing.

6. **Business Intelligence & Audit (`Enterprise Reports & Data Export`)**
   - Structured export of payroll, attendance, and employee rosters in CSV format compatible with core ERP systems and analytical data warehouses.

---

## 🚀 Deployment & Audit Guide

### Environment Prerequisites
- **Node.js**: Runtime environment `v20.0.0 LTS` or higher.
- **Package Manager**: `npm` v10+, `pnpm`, or `yarn`.

### 1. Clone the Repository
```bash
git clone https://github.com/empresa-org/humassist-enterprise-erp.git
cd humassist-enterprise-erp
```

### 2. Environment Configuration
Copy the environment variables template and set corporate credentials:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run in Development Mode
Start the local development server with hot reload and integrated proxy on port 3000:
```bash
npm run dev
```
Local access: `http://localhost:3000`

---

## ⚙️ CI/CD & Integration Tooling

| Command | Context / Pipeline | Technical Description |
| :--- | :--- | :--- |
| `npm run dev` | Local Development | Starts the Vite / Express dev server on `0.0.0.0:3000` with Just-in-Time compilation. |
| `npm run lint` | Static Analysis & CI | Runs `tsc --noEmit` to verify type system integrity without outputting artifacts. |
| `npm run build` | Production Packaging | Generates the optimized client bundle in `dist/` and compiles the perimeter server. |
| `npm run preview` | Staging Preview | Spins up a local server to verify compiled build artifacts in `dist/`. |

---

## 🏛️ Domain Architecture (Tree)

```text
src/
├── domain/                  # Pure Domain Layer
│   └── entities/            # Business models and invariants (Employee, Payroll, Attendance, RBAC)
├── services/                # Application Layer & Use Cases
│   ├── payroll/             # Tax calculation, deduction, and compensation logic
│   ├── attendance/          # Shift rules, biometrics, and punctuality
│   ├── leaves/              # Approval workflows and leave balances
│   ├── rbac/                # Security policies, roles, and permissions
│   ├── storage/             # Persistence adapters and repositories
│   └── export/              # Data transformation and export (CSV)
├── hooks/                   # Reactive state orchestrators (useERPData, useRBACSession)
├── components/              # Decoupled views and presentation components
│   ├── DashboardView.tsx    # Executive metrics and dashboard visualization
│   ├── PayrollView.tsx      # Payroll distribution and payslip management
│   ├── AttendanceView.tsx   # Shift control and vacation tracking
│   ├── EmployeesView.tsx    # Staff directory and personnel records
│   ├── RBACView.tsx         # Privilege matrix and role simulator
│   └── ReportsView.tsx      # Report generation and analytics
├── i18n/                    # Bilingual internationalization module (ES / EN)
├── data/                    # Corporate seed data and initial profiles
├── utils/                   # Math helpers, currency, and date formatters
├── types.ts                 # Global TypeScript declarations
└── main.tsx                 # Application startup and entry point
```

---

Software Architecture Ownership - Jastin Bolaños © 2026. Enterprise Technical Demonstration Project.
