const { Router } = require('express');
const controller = require('../controllers/tickets.controller');

// Asocia cada método HTTP + URL con la función del controlador.
// Estas rutas quedan montadas bajo /api/tickets (ver app.js).
const router = Router();

router.get('/', controller.listar);          // GET    /api/tickets
router.get('/:id', controller.obtener);      // GET    /api/tickets/5
router.post('/', controller.crear);          // POST   /api/tickets
router.put('/:id', controller.actualizar);   // PUT    /api/tickets/5
router.delete('/:id', controller.eliminar);  // DELETE /api/tickets/5

module.exports = router;