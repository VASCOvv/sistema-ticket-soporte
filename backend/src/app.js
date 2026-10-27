const express = require('express');
const cors = require('cors');
const ticketsRoutes = require('./routes/tickets.routes');

const app = express();

// Middlewares: se ejecutan en orden para cada petición.
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' })); // permite llamadas desde Angular
app.use(express.json()); // convierte el cuerpo JSON de la petición en req.body

// Ruta simple para comprobar que la API está viva.
app.get('/api/salud', (req, res) => res.json({ estado: 'ok' }));

// Rutas de tickets.
app.use('/api/tickets', ticketsRoutes);

// 404: ninguna ruta coincidió.
// Middleware de errores: tiene 4 parámetros. Recibe lo que se envía con next(error).
app.use((err, req, res, next) => {
  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido.' });
  }

  // La base de datos no está disponible (MySQL apagado, credenciales o BD incorrectas)
  const erroresConexionBD = ['ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'PROTOCOL_CONNECTION_LOST'];
  if (erroresConexionBD.includes(err.code)) {
    console.error('Error de base de datos:', err.code);
    return res.status(503).json({ mensaje: 'No se pudo conectar con la base de datos. Intenta nuevamente más tarde.' });
  }

  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});
module.exports = app;