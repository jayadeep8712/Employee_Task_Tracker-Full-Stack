const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { appConfig } = require('./config');

const dbDirectory = path.dirname(appConfig.databasePath);
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const db = new Database(appConfig.databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

function runMigrations() {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
}

runMigrations();

module.exports = { db };

