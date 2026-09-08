# HUMASSIST Enterprise v2.0.0-ENT

![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square&logo=github-actions)
![Deployment](https://img.shields.io/badge/Deployment-Production%20Ready-blue?style=flat-square&logo=google-cloud)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture%20%2F%20RBAC-indigo?style=flat-square)
![Security & Compliance](https://img.shields.io/badge/Security-Strict%20Zero--Trust%20Proxy-slate?style=flat-square)

> **HUMASSIST Enterprise** es una plataforma integral de planificación de recursos empresariales (ERP) y orquestación estratégica de talento humano de alta disponibilidad. Diseñada para corporativos y organizaciones multinacionales, centraliza la automatización de nóminas con cálculo fiscal normativo, telemetría y registro de asistencias con validación biométrica/geolocalizada, gestión de incidencias contractuales y gobernanza estricta de seguridad bajo matrices de control de acceso basadas en roles (RBAC).
>
> 🟢 **[Ver Plataforma en Vivo (Producción)](https://humassist-enterprise.prod.corp.internal)**

![Vista Previa de HUMASSIST Enterprise](https://github.com/user-attachments/assets/9fce6e1d-cb0e-4938-9790-3eac43f18d26)

---

## 🎥 Demostración de la Plataforma ERP

**🎬 Recorrido Operativo de HUMASSIST**  
Exploración de la interfaz empresarial: gestión de nóminas automatizadas, control de asistencia en tiempo real, administración integral de expedientes de talento y simulación de la matriz de privilegios basada en roles (RBAC).

https://github.com/user-attachments/assets/6cfa38cc-3d95-4c21-a186-4bdf65c2f987

---

## 🏛️ Arquitectura de Sistema y Stack Tecnológico

La plataforma opera bajo el paradigma de **Clean Architecture** en el cliente, aislando entidades de dominio puro, casos de uso transaccionales y adaptadores de interfaz reactivos, acoplados a una capa perimetral de proxy seguro.

> *Nota de Cumplimiento*: Este repositorio expone exclusivamente la capa de presentación (Frontend/Edge) y el API Gateway para fines de demostración técnica. Para emular los estándares de cumplimiento normativo de un entorno corporativo real (ISO 27001 / SOC 2), los motores de persistencia de datos y microservicios de liquidación se han desacoplado y simulado mediante persistencia local, asumiendo que en producción operarían desde redes aisladas (VPC).

### Core & Runtime
- **TypeScript (`~5.8.2`)**: Sistema de tipado estricto que garantiza invariantes de dominio y previene fallos en tiempo de compilación.
- **React 19 (`^19.0.1`) & React DOM (`^19.0.1`)**: Motor declarativo de renderizado concurrente y alta eficiencia de estado.
- **Vite (`^6.2.3`) & @vitejs/plugin-react (`^5.0.4`)**: Pipeline de empaquetado optimizado con división de código dinámica.

### UI, Renderizado & Motion
- **Tailwind CSS v4 (`^4.1.14`) & @tailwindcss/vite (`^4.1.14`)**: Motor de utilidades CSS de alto rendimiento con optimización de layout en tiempo de compilación.
- **Motion (`^12.23.24`)**: Orquestación declarativa de animaciones, transiciones de layout fluidas y microinteracciones de interfaz.
- **Lucide React (`^0.546.0`)**: Catálogo iconográfico vectorial optimizado para accesibilidad empresarial.
- **Autoprefixer (`^10.4.21`)**: Compatibilidad cross-browser automatizada en capa de estilos.

### Motor de Inferencia & Telemetría Inteligente
- **@google/genai (`^2.4.0`)**: SDK de integración para modelos de lenguaje multimodal e inferencia contextual de apoyo a la gestión de talento humano.

### Backend, Proxy Seguro & Servidor Edge
- **Express (`^4.21.2`)**: Servidor perimetral para intermediación de solicitudes, control de encabezados y enrutamiento proxy seguro.
- **tsx (`^4.21.0`) & esbuild (`^0.25.0`)**: Transpilador y empaquetador ultrarrápido para el despliegue del runtime de Node.js.
- **dotenv (`^17.2.3`)**: Inyección segura y aislada de variables de entorno del servidor.
- **@types/node (`^22.14.0`) & @types/express (`^4.17.21`)**: Tipado estricto para las interfaces de sistema y red.

---

## 💼 Módulos Operativos (Desplegados)

1. **Centro de Control Ejecutivo (Executive Dashboard & Metrics)**
   - Consolidación en tiempo real de indicadores clave de rendimiento (KPIs), masa salarial devengada, índice ponderado de puntualidad, ausentismo laboral y desglose presupuestario por división corporativa.

2. **Motor de Compensaciones y Dispersión Fiscal (`Payroll Engine`)**
   - Módulo automatizado de cálculo de percepciones y deducciones conforme a regulaciones vigentes (ISR, IMSS, AFORE, horas extra extraordinarias y bonificaciones).
   - Generación, pre-autorización, timbrado simulado y emisión de recibos digitales de nómina auditables con exportación a formatos estándar.

3. **Telemetría de Jornadas y Control de Asistencia (`Time & Attendance Tracking`)**
   - Registro de accesos, pausas y salidas con autenticación biométrica y validación de coordenadas de geolocalización.
   - Flujo de solicitud, revisión y dictaminación de licencias, incapacidades y periodos vacacionales con auditoría de supervisión.

4. **Expediente Único y Directorio de Plantilla (`Employee Registry & Directory`)**
   - Administración 360° del ciclo de vida del colaborador: alta contractual, datos bancarios de dispersión, contactos de contingencia, asignación departamental y trazabilidad de desempeño.

5. **Gobernanza y Matriz de Privilegios RBAC (`Role-Based Access Control`)**
   - Control de acceso granular segregado en 5 perfiles estratégicos: *Super Administrador*, *Director de Talento Humano*, *Especialista de Nóminas*, *Supervisor Operativo* y *Colaborador*.
   - Simulador dinámico para auditoría inmediata de permisos y vistas contextuales.

6. **Auditoría e Inteligencia de Negocio (`Enterprise Reports & Data Export`)**
   - Extracción estructurada de nóminas, asistencias y plantilla en CSV compatible con sistemas ERP centrales y almacenes de datos analíticos.

---

## 🚀 Guía de Despliegue y Auditoría

### Requisitos de Entorno
- **Node.js**: Entorno de ejecución `v20.0.0 LTS` o superior.
- **Gestor de Paquetes**: `npm` v10+, `pnpm` o `yarn`.

### 1. Clonación del Repositorio
```bash
git clone https://github.com/empresa-org/humassist-enterprise-erp.git
cd humassist-enterprise-erp
```

### 2. Configuración de Entorno
Copia la plantilla de variables de entorno y define las credenciales corporativas:
```bash
cp .env.example .env
```

### 3. Instalación de Dependencias
```bash
npm install
```

### 4. Ejecución en Modo Desarrollo
Inicia el entorno local de desarrollo con recarga en caliente y proxy integrado en el puerto 3000:
```bash
npm run dev
```
Acceso local: `http://localhost:3000`

---

## ⚙️ Herramientas de Integración y Despliegue (CI/CD)

| Comando | Contexto / Pipeline | Descripción Técnica |
| :--- | :--- | :--- |
| `npm run dev` | Desarrollo Local | Inicia el servidor de desarrollo Vite / Express en `0.0.0.0:3000` con compilación Just-in-Time. |
| `npm run lint` | Validación Estática & CI | Ejecuta `tsc --noEmit` para auditar la integridad del sistema de tipos sin emitir artefactos. |
| `npm run build` | Empaquetado de Producción | Genera el bundle optimizado del cliente en `dist/` y compila el servidor perimetral. |
| `npm run preview` | Previsualización Staging | Monta un servidor local para verificar el comportamiento de los artefactos compilados en `dist/`. |

---

## 🏛️ Arquitectura de Dominio (Tree)

```text
src/
├── domain/                  # Capa de Dominio Puro
│   └── entities/            # Modelos e invariantes de negocio (Employee, Payroll, Attendance, RBAC)
├── services/                # Capa de Aplicación y Casos de Uso
│   ├── payroll/             # Lógica de cálculo fiscal, deducciones e impuestos
│   ├── attendance/          # Reglas de jornada, biométricos y puntualidad
│   ├── leaves/              # Flujos de aprobación y balance de ausencias
│   ├── rbac/                # Políticas de seguridad, roles y permisos
│   ├── storage/             # Adaptadores de persistencia y repositorios
│   └── export/              # Transformación y exportación de datos (CSV)
├── hooks/                   # Orquestadores reactivos de estado (useERPData, useRBACSession)
├── components/              # Vistas y componentes de presentación desacoplados
│   ├── DashboardView.tsx    # Métricas y visualización ejecutiva
│   ├── PayrollView.tsx      # Gestión de dispersión salarial y nómina
│   ├── AttendanceView.tsx   # Control de jornadas y vacaciones
│   ├── EmployeesView.tsx    # Directorio de plantilla y expedientes
│   ├── RBACView.tsx         # Matriz de privilegios y simulador de roles
│   └── ReportsView.tsx      # Generación de reportes y analítica
├── i18n/                    # Módulo de internacionalización bilingüe (ES / EN)
├── data/                    # Datos semilla corporativos y perfiles iniciales
├── utils/                   # Utilidades matemáticas, formateadores de moneda y fechas
├── types.ts                 # Definiciones globales de TypeScript
└── main.tsx                 # Punto de entrada y arranque de la aplicación
```

---

Propiedad de Arquitectura de Software - Jastin Bolaños © 2026. Proyecto de Demostración Técnica Empresarial.
