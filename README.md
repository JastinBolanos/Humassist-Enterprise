<div align="center">
  <img alt="HUMASSIST Banner" src="https://github.com/user-attachments/assets/b399c207-24ff-44d3-8e66-0dca85f69e0a" width="40%" />

  <br>

  <h3>Enterprise ERP & Human Capital Platform (v2.0.0-ENT)</h3>

  <p>
    <img src="https://img.shields.io/badge/Build-Passing-emerald?style=flat-square&logo=github-actions" alt="Build Status" />
    <img src="https://img.shields.io/badge/Deployment-Production%20Ready-blue?style=flat-square&logo=google-cloud" alt="Deployment" />
    <img src="https://img.shields.io/badge/Architecture-Clean%20Architecture%20%2F%20RBAC-indigo?style=flat-square" alt="Architecture" />
    <img src="https://img.shields.io/badge/Security-Strict%20Zero--Trust%20Proxy-slate?style=flat-square" alt="Security & Compliance" />
  </p>
</div>

<br>

> **Human Resources & Workforce Management Interface Showcase.**  
> A client-side ERP dashboard interface exploring workforce administration, interactive payroll breakdowns, simulated attendance tracking with location tags, employee records, and a role-based access control (RBAC) view switcher.

<br>

<div align="center">
  <h3>🌍 <b><a href="https://humassist.vercel.app">View Live Platform (Production) 🟢</a></b></h3>
  <br>
  <img alt="HUMASSIST Preview" src="https://github.com/user-attachments/assets/9fce6e1d-cb0e-4938-9790-3eac43f18d26" width="80%" />
</div>

## 🎥 ERP Platform Demo

**🎬 HUMASSIST Operational Walkthrough**  
Interface walkthrough: payroll calculation views, attendance check-in controls, employee profile administration, and testing view states with the role-based access control (RBAC) simulator.

https://github.com/user-attachments/assets/6cfa38cc-3d95-4c21-a186-4bdf65c2f987

---

## 🏛️ System Architecture & Tech Stack

The application is built using clean frontend architecture patterns, separating domain entities, calculation use cases, and UI presentation components.

> *Notice*: This repository presents the client application (Frontend/Edge) and a local development proxy. Enterprise database engines and external payment settlement microservices are simulated locally to provide an accessible, self-contained demonstration experience.

### Core & Runtime
- **TypeScript (`~5.8.2`)**: Type safety across domain models, employee records, and calculation functions.
- **React 19 (`^19.0.1`) & React DOM (`^19.0.1`)**: Component-based UI library for responsive interface rendering.
- **Vite (`^6.2.3`) & @vitejs/plugin-react (`^5.0.4`)**: Development server and client production bundler.

### UI, Rendering & Motion
- **Tailwind CSS v4 (`^4.1.14`) & @tailwindcss/vite (`^4.1.14`)**: Utility-first CSS framework providing a clean, accessible corporate aesthetic.
- **Motion (`^12.23.24`)**: Transitions and micro-interactions across tab changes and modal dialogues.
- **Lucide React (`^0.546.0`)**: Vector iconography for navigation and data tables.
- **Autoprefixer (`^10.4.21`)**: Automated cross-browser stylesheet compatibility.

### Inference & Assistance
- **@google/genai (`^2.4.0`)**: Integration with Gemini language models for contextual assistant features and administrative summaries.

### Backend, Proxy & Development Tools
- **Express (`^4.21.2`)**: Lightweight local proxy server for routing and local middleware handling.
- **tsx (`^4.21.0`) & esbuild (`^0.25.0`)**: TypeScript execution and bundling for the local server.
- **dotenv (`^17.2.3`)**: Environment configuration loader.
- **@types/node (`^22.14.0`) & @types/express (`^4.17.21`)**: Type definitions for Node.js and Express.

---

## 💼 Operational Modules (Deployed)

1. **Dashboard & Key Metrics**
   - High-level overview of key HR metrics: total payroll estimates, average attendance rates, recorded absences, and departmental summaries.

2. **Payroll & Deductions Engine (`Payroll Engine`)**
   - Interactive calculation table for earnings and deductions (income taxes, social security, overtime rates, and bonuses).
   - Payslip preview modal with simulated approval actions and exportable summary statements.

3. **Attendance & Shift Records (`Time & Attendance Tracking`)**
   - Clock-in and clock-out simulation with location tag previews and status logging.
   - Leave request review panel for vacation, personal days, and medical leave.

4. **Employee Directory & Profile Records (`Employee Registry & Directory`)**
   - Employee records manager: contact details, department assignments, hire dates, and compensation profiles.

5. **RBAC Role Simulator (`Role-Based Access Control`)**
   - Role switcher supporting 5 operational roles: *Super Admin*, *HR Director*, *Payroll Specialist*, *Operations Supervisor*, and *Employee*.
   - Interactive preview showing how UI permissions and menu actions adapt based on active roles.

6. **Reports & Data Export (`Enterprise Reports & Data Export`)**
   - Data export tools generating structured CSV summaries for payroll, attendance, and directory information.

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
