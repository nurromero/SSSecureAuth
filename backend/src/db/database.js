import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../../sssecureauth.db.json');

const SQL = await initSqlJs();

let db;

// Load existing database from disk, or create a new one
if (existsSync(DB_PATH)) {
  const savedData = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  const buffer = Buffer.from(savedData);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Save database to disk 
export function saveDb() {
  const data = db.export();
  writeFileSync(DB_PATH, JSON.stringify(Array.from(data)));
}

// Run schema on startup
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.run(schema);
saveDb();

console.log('Database connected and schema applied');

export default db;