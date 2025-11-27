const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resolveFromRoot = (value, fallback) => {
  const target = value || fallback;
  return path.isAbsolute(target) ? target : path.resolve(__dirname, '..', target);
};

const appConfig = {
  port: Number(process.env.PORT) || 4000,
  databasePath: resolveFromRoot(process.env.DATABASE_PATH, '../database/task_tracker.sqlite'),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
};

module.exports = { appConfig };

