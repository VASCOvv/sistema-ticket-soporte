
let tickets = [];
let siguienteId = 1;

async function obtenerTodos() {
  return [...tickets].sort((a, b) => b.id - a.id);
}

async function obtenerPorId(id) {
  return tickets.find((t) => t.id === id) ?? null;
}

async function crear(datos) {
  const nuevo = { id: siguienteId++, ...datos, fechaRegistro: new Date().toISOString() };
  tickets.push(nuevo);
  return nuevo;
}

async function actualizar(id, datos) {
  const indice = tickets.findIndex((t) => t.id === id);
  if (indice === -1) return null;
  tickets[indice] = { ...tickets[indice], ...datos };
  return tickets[indice];
}

async function eliminar(id) {
  const indice = tickets.findIndex((t) => t.id === id);
  if (indice === -1) return false;
  tickets.splice(indice, 1);
  return true;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };