
const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuentas y accesos', 'Otro'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];
const ESTADOS = ['Abierto', 'En progreso', 'Resuelto', 'Cerrado'];

function limpiarTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function validarTicket(body = {}) {
  const errores = [];

  const datos = {
    asunto: limpiarTexto(body.asunto),
    solicitante: limpiarTexto(body.solicitante),
    descripcion: limpiarTexto(body.descripcion),
    categoria: body.categoria,
    prioridad: body.prioridad,
    estado: body.estado ?? 'Abierto',
  };

  if (datos.asunto.length < 5 || datos.asunto.length > 100) {
    errores.push('El asunto debe tener entre 5 y 100 caracteres.');
  }
  if (datos.solicitante.length < 3 || datos.solicitante.length > 80) {
    errores.push('El solicitante debe tener entre 3 y 80 caracteres.');
  }
  if (datos.descripcion.length < 10 || datos.descripcion.length > 1000) {
    errores.push('La descripción debe tener entre 10 y 1000 caracteres.');
  }
  if (!CATEGORIAS.includes(datos.categoria)) {
    errores.push('La categoría no es válida.');
  }
  if (!PRIORIDADES.includes(datos.prioridad)) {
    errores.push('La prioridad no es válida.');
  }
  if (!ESTADOS.includes(datos.estado)) {
    errores.push('El estado no es válido.');
  }

  return { errores, datos };
}

module.exports = { validarTicket };