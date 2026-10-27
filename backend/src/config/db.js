const mysql = require('mysql2/promise');

// Pool de conexiones a MySQL: mantiene varias conexiones abiertas y las reutiliza,
// en vez de abrir y cerrar una conexión nueva en cada petición.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soporte_tickets',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  dateStrings: true, // devuelve las fechas como texto 'YYYY-MM-DD HH:MM:SS'
});

module.exports = pool;