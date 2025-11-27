<div align="center">

<p align="center">
  <img src="frontend/logo.svg" width="100" alt="Project Logo" />
</p>
<h1 align="center">Employee Task Tracker</h1>

Full-stack web application for internal task management.  
The app keeps track of employees, their assigned work, and high-level delivery metrics through a **React dashboard** and an **Express REST API** backed by **SQLite**.

</div>

<br>

## 📸 Screenshots

<div align="center">

<p>
  <img src="frontend/assets/d (0).png" width="300" alt="Employee Task Tracker - Dashboard View" />
</p>

<table>
  <tr>
    <td><img src="frontend/assets/d (1).png" width="300" alt="Dark Mode - Employee List" /></td>
    <td><img src="frontend/assets/l (1).png" width="300" alt="Light Mode - Employee List" /></td>
  </tr>
  <tr>
    <td><img src="frontend/assets/d (2).png" width="300" alt="Dark Mode - Task Details" /></td>
    <td><img src="frontend/assets/l (2).png" width="300" alt="Light Mode - Task Details" /></td>
  </tr>
</table>

</div>

<br>

### Tech Stack
- **Frontend:** React 18 (Vite 5), Tailwind CSS, Axios, Boxicons (`frontend_me/`)
- **Backend:** Node.js 20, Express 5, Better-SQLite3, dotenv, cors, morgan (`backend/`)
- **Database:** SQLite with schema + seed script (`database/schema.sql`)

### Architecture Overview
- **Frontend (`frontend_me/`)**: Vite-powered SPA that consumes the REST API via `src/services/api.js`, offering dashboards, filtering, CRUD, dark mode, and responsive layout.
- **Backend (`backend/`)**: Express server exposing `/employees`, `/tasks`, `/dashboard`, `/health`; controllers delegate to models backed by Better-SQLite3; config/env loaded via `.env`.
- **Database (`database/`)**: `schema.sql` creates `employees` and `tasks` tables with FK `tasks.employee_id` plus starter rows; migrations applied automatically by `app/db.js`.
- **Flow**: UI actions -> Axios -> Express routes -> SQLite CRUD; summarized metrics returned from SQL aggregations. This mirrors the provided architecture diagram.

```shell
.
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend_me/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
└── checklist.md              # Requirement-by-requirement status
```

### Features
- List employees and their workloads
- View, filter, and update tasks by employee or status
- Create new tasks with priority, due date, and assignment
- Dashboard cards for total tasks, completion rate, and per-employee progress
- JWT authentication with role-based access (Admin vs. Employee)
- Admin-only employee management UI (create/update/delete) and task CRUD; employees get read-only views of their assignments

### Getting Started
Requirements: Node.js 20+, npm.

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env        # adjust ports/origins as needed
   npm install
   npm run dev                 # or npm start for production
   ```
   The first boot runs `database/schema.sql`, creating `database/task_tracker.sqlite` with sample data.

2. **Frontend (modern UI)**
   ```bash
   cd frontend_me
   cp .env.example .env        # set VITE_API_BASE_URL if backend differs
   npm install
   npm run dev
   ```
   Visit the printed Vite URL (default `http://localhost:5173`).

3. **Database**
   - Schema + seeds live in `database/schema.sql`. First backend boot applies it automatically and creates `database/task_tracker.sqlite`.
   - To reset data, delete the `.sqlite`, `.sqlite-shm`, and `.sqlite-wal` files, then restart the backend.

### API Reference (base URL defaults to `http://localhost:4000`)
| Endpoint | Description |
| --- | --- |
| `POST /auth/login` | Exchange email/password for a JWT (8h expiry). |
| `GET /employees` | List employees (admins see all, employees only see themselves). |
| `POST /employees` | Create employee profile (admin only). |
| `PUT /employees/:id` | Update employee profile (admin only). |
| `DELETE /employees/:id` | Delete employee (admin only, tasks become unassigned). |
| `GET /tasks?status=&employeeId=` | List tasks with optional filters (employees auto-filtered to their ID). |
| `POST /tasks` | Create a task (`title`, `description?`, `status?`, `priority?`, `dueDate?`, `employeeId?`). |
| `PUT /tasks/:id` | Update any subset of task fields (admin only). |
| `DELETE /tasks/:id` | Remove a task (admin only). |
| `GET /dashboard` | Aggregated stats and per-employee completion counts (scoped for employees). |
| `GET /health` | Service status probe. |

Responses follow `{ data: ... }` shape, with validation errors returned as `{ errors: [] }`.

### Screenshots
![Dark UI](frontend/assets/d (0).png) 

| Light | Dark |
| --- | --- |
| ![Light UI](frontend/assets/l (1).png) | ![Dark UI](frontend/assets/d (1).png) |


### Authentication & Roles
- Seeded credentials:
  - Admin: `admin@example.com` / `admin123`
  - Employee: `brian.patel@example.com` / `password123`
- Admins can access every view plus task/employee CRUD.
- Employees can only see their assigned tasks and personal dashboards; attempting restricted actions returns `403`.
- Tokens are stored client-side and cleared automatically on logout or HTTP 401 responses.

### Assumptions & Limitations
1. Single-tenant/internal tool; JWT auth covers basic role separation but not multi-tenant orgs.
2. SQLite is sufficient for this assignment; swap the DB layer if multi-user scale is required.
3. Attachments/comments and pagination are not implemented.
4. Accessibility covers semantics, focus styles, and keyboard operability for critical flows; full WCAG AA not audited.

### Testing & Notes
- `frontend_me`: `npm run build` (Vite) succeeds; dev server uses `VITE_API_BASE_URL`.
- `backend`: start with `npm run dev`; endpoints exercised via UI + Postman.
- Environment variables control ports, DB path, and allowed origins (`backend/.env`).
- Requirement-by-requirement verification lives in `checklist.md`.
- Tokens expire after 8 hours; on expiration the frontend automatically logs out and prompts for credentials again.

### Future Improvements
- SSO / multi-tenant auth with organization scoping.
- Task commenting/history.
- Pagination and advanced search for large datasets.
- Automated tests for controllers and React components.

### Bonus Challenge Status
- ✅ Implemented JWT login plus role-based access controls (admin vs. employee).
- ✅ Admins can add/update/delete tasks and employees.
- ✅ Employees are restricted to read-only views of their assigned tasks and dashboards.

