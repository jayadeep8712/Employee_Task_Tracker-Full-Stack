# Track 3 – Employee Task Tracker Checklist

Status legend: ✅ complete · ⚠️ partial / not applicable · ❌ missing

## 1. Scenario & Functional Requirements
- ✅ View all employees and their tasks (`GET /employees`, UI sections “Team Overview” + boards).
- ✅ Add and update tasks (Task form, edit modal, status cycling using POST/PUT).
- ✅ Filter tasks by status or employee (filter pills + employee dropdown).
- ✅ Dashboard summary with totals & completion rate (`/dashboard` surfaced in UI hero + dashboard cards).

## 2. Expected Outcome
- ✅ Fully working web app with integrated React frontend (`frontend_me/`) and Express API (`backend/`).
- ✅ Data persisted in real SQLite database (`database/task_tracker.sqlite` seeded via `schema.sql`).
- ✅ REST communication only; frontend fetches via `services/api.js` (no mock/localStorage data).
- ✅ Modern UI: Tailwind-styled responsive layout, dark mode, toasts, modals.

## 3. Deliverables
- ✅ Frontend source (`frontend_me/`).
- ✅ Backend source (`backend/`).
- ✅ Database schema & sample data (`database/schema.sql`).
- ✅ README includes tech stack overview, architecture, setup/run steps, API endpoints, screenshots, and assumptions.

## 4. Instructions Compliance
- ✅ Frontend ↔ backend integration using environment-based base URL.
- ✅ Persistent storage with SQLite (employees/tasks relationship + foreign keys).
- ✅ Best practices:
  - Frontend: modular components, state hooks, responsive Tailwind styles.
  - Backend: REST routes, validation, structured controllers/models, error handling.
  - Database: normalized schema with FK (`employee_id`) and seeds.
- ✅ Environment variables supported (`backend/.env.example`, `frontend_me/.env.example`).
- ✅ UI kept clean & functional with clear workflows.

## 5. Focus Area Evaluation
- ✅ Architecture: distinct `backend`, `frontend_me`, and `database` layers documented in README.
- ✅ API Integration: Axios client hits `/employees`, `/tasks`, `/dashboard`, `/health`.
- ✅ Code Quality: separated controllers/models/routes, reusable React components, comments where needed.
- ✅ UI/UX: responsive cards, filters, modals, dark mode, empty states.
- ✅ Data Persistence: create/update/delete reflected in SQLite and UI via re-fetching.
- ✅ Documentation: README updated with setup, endpoints, screenshots, assumptions, roadmap.

## 6. Bonus Challenge (Auth & Roles)
- ✅ Admin login (JWT) with ability to add/update/delete tasks **and** employees.
- ✅ Employee login limited to their assigned tasks + personal dashboard.
- ✅ Unauthorized actions return `403` and the frontend hides admin UI when role !== admin.

## 7. Architecture Diagram
- ✅ Architecture section in README aligns with provided diagram (frontend ↔ API ↔ DB).

## 8. Example API Flow Coverage
- ✅ All listed endpoints implemented and documented:
  - `POST /auth/login`
  - `GET /employees`
  - `POST /employees`
  - `PUT /employees/:id`
  - `DELETE /employees/:id`
  - `GET /tasks`
  - `POST /tasks`
  - `PUT /tasks/:id`
  - `DELETE /tasks/:id`
  - `GET /dashboard`

## 9. Overall Evaluation vs. Requirements
- Architecture — exceeded (configurable envs, documented separation, checklist).
- API Integration — exceeded (Axios abstraction, auth interceptors, auto-logout on 401).
- Code Quality — exceeded (modular controllers/models, reusable React components, TypeScript-like prop contracts).
- UI/UX — exceeded (dark mode, toasts, role-aware UI, responsive layout, admin tooling).
- Data Persistence — exceeded (SQLite FK enforcement, seeded data, deletion cascades).
- Documentation — exceeded (README, frontend README, screenshots, credentials, this checklist).
- Bonus Features — ✅ fully implemented (auth + roles).
