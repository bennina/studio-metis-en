// lib/db.ts
// MySQL pool helper (Node runtime)
import mysql from "mysql2/promise";

let _pool: mysql.Pool | null = null;

export function getDbPool() {
  if (_pool) return _pool;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  // Netsons panel often uses DB_PASS; keep DB_PASSWORD for local/dev.
  const password = process.env.DB_PASSWORD ?? process.env.DB_PASS;
  const database = process.env.DB_NAME;
  const port = Number(process.env.DB_PORT ?? 3306);

  if (!host || !user || !password || !database) {
    throw new Error(
      "Missing DB env vars. Set DB_HOST, DB_USER, DB_PASSWORD (or DB_PASS), DB_NAME (and optionally DB_PORT)."
    );
  }

  _pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // good defaults
    charset: "utf8mb4",
    timezone: "Z",
  });

  return _pool;
}
