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
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Middleware de errores: tiene 4 parámetros. Recibe lo que se envía con next(error).
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

module.exports = app;