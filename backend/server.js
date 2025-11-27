const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { appConfig } = require('./app/config');
const { requireAuth } = require('./app/middleware/auth');

const authRoutes = require('./app/routes/auth');
const employeeRoutes = require('./app/routes/employees');
const taskRoutes = require('./app/routes/tasks');
const dashboardRoutes = require('./app/routes/dashboard');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || appConfig.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);

app.use(requireAuth);
app.use('/employees', employeeRoutes);
app.use('/tasks', taskRoutes);
app.use('/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Unexpected error',
  });
});

app.listen(appConfig.port, () => {
  console.log(`API listening on http://localhost:${appConfig.port}`);
});

