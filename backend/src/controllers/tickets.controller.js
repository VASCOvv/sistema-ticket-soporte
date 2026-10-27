const Ticket = require('../models/ticket.model');
const { validarTicket } = require('../validators/ticket.validator');

// Convierte el :id de la URL a número y verifica que sea válido.
function leerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/tickets
async function listar(req, res, next) {
  try {
    const tickets = await Ticket.obtenerTodos();
    res.json(tickets); // 200 OK
  } catch (error) {
    next(error); // lo maneja el middleware de errores (app.js)
  }
}

// GET /api/tickets/:id
async function obtener(req, res, next) {
  try {
    const id = leerId(req);
    if (!id) return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo.' });

    const ticket = await Ticket.obtenerPorId(id);
    if (!ticket) return res.status(404).json({ mensaje: `No existe un ticket con id ${id}.` });

    res.json(ticket);
  } catch (error) {
    next(error);
  }
}

// POST /api/tickets
async function crear(req, res, next) {
  try {
    const { errores, datos } = validarTicket(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: errores.join(' '), errores });
    }

    const nuevo = await Ticket.crear(datos);
    res.status(201).json(nuevo); // 201 Created
  } catch (error) {
    next(error);
  }
}

// PUT /api/tickets/:id
async function actualizar(req, res, next) {
  try {
    const id = leerId(req);
    if (!id) return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo.' });

    const { errores, datos } = validarTicket(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: errores.join(' '), errores });
    }

    const actualizado = await Ticket.actualizar(id, datos);
    if (!actualizado) return res.status(404).json({ mensaje: `No existe un ticket con id ${id}.` });

    res.json(actualizado);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tickets/:id
async function eliminar(req, res, next) {
  try {
    const id = leerId(req);
    if (!id) return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo.' });

    const eliminado = await Ticket.eliminar(id);
    if (!eliminado) return res.status(404).json({ mensaje: `No existe un ticket con id ${id}.` });

    res.status(204).send(); // 204 No Content: se eliminó, no hay nada que devolver
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };