const pool = require('../config/db');

const COLUMNAS = `id, asunto, solicitante, descripcion, categoria, prioridad, estado,
  DATE_FORMAT(fecha_registro, '%Y-%m-%dT%H:%i:%s') AS fechaRegistro`;

async function obtenerTodos() {
  const [filas] = await pool.execute(`SELECT ${COLUMNAS} FROM tickets ORDER BY id DESC`);
  return filas;
}

async function obtenerPorId(id) {
  const [filas] = await pool.execute(`SELECT ${COLUMNAS} FROM tickets WHERE id = ?`, [id]);
  return filas[0] ?? null;
}

async function crear(datos) {
  const [resultado] = await pool.execute(
    `INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [datos.asunto, datos.solicitante, datos.descripcion, datos.categoria, datos.prioridad, datos.estado]
  );
  return obtenerPorId(resultado.insertId);
}

async function actualizar(id, datos) {
  const [resultado] = await pool.execute(
    `UPDATE tickets
     SET asunto = ?, solicitante = ?, descripcion = ?, categoria = ?, prioridad = ?, estado = ?
     WHERE id = ?`,
    [datos.asunto, datos.solicitante, datos.descripcion, datos.categoria, datos.prioridad, datos.estado, id]
  );
  if (resultado.affectedRows === 0) return null;
  return obtenerPorId(id);
}

async function eliminar(id) {
  const [resultado] = await pool.execute('DELETE FROM tickets WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };