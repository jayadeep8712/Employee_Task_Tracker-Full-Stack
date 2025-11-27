PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','employee')),
  employee_id INTEGER,
  FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TEXT,
  employee_id INTEGER,
  FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

INSERT OR IGNORE INTO employees (id, name, role, department, email) VALUES
  (1, 'Alice Johnson', 'Engineering Manager', 'Engineering', 'alice.johnson@example.com'),
  (2, 'Brian Patel', 'Frontend Engineer', 'Engineering', 'brian.patel@example.com'),
  (3, 'Carmen Smith', 'Backend Engineer', 'Engineering', 'carmen.smith@example.com'),
  (4, 'Diego Ramirez', 'Product Manager', 'Product', 'diego.ramirez@example.com'),
  (5, 'Ella Chen', 'QA Analyst', 'Quality', 'ella.chen@example.com');

INSERT OR IGNORE INTO tasks (id, title, description, status, priority, due_date, employee_id) VALUES
  (1, 'Build auth screen', 'Implement login UI for MVP', 'in_progress', 'high', '2025-12-01', 2),
  (2, 'API pagination', 'Add pagination to /tasks endpoint', 'pending', 'medium', '2025-12-05', 3),
  (3, 'QA regression suite', 'Automate priority smoke tests', 'completed', 'high', '2025-11-20', 5),
  (4, 'Sprint planning', 'Prepare backlog for next sprint', 'completed', 'low', '2025-11-15', 4);

INSERT OR IGNORE INTO users (id, email, password_hash, role, employee_id) VALUES
  (1, 'admin@example.com', '$2b$10$x3lkMRhw4LM.89svKq0vHORccwdCokWLyr/44hS.W2o6hE4ox/spq', 'admin', 1),
  (2, 'brian.patel@example.com', '$2b$10$IiQB9NRTvpiiHxAc.OZe2e0/H3QcchXY.MgzoKe..HXlSMKlc73i.', 'employee', 2);

