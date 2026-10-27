// Modelo de datos del ticket: define la "forma" que tiene un ticket en el frontend.
// Coincide con las columnas de la tabla `tickets` en la base de datos.

export type Categoria = 'Hardware' | 'Software' | 'Red' | 'Cuentas y accesos' | 'Otro';
export type Prioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type Estado = 'Abierto' | 'En progreso' | 'Resuelto' | 'Cerrado';

export interface Ticket {
  id: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: Categoria;
  prioridad: Prioridad;
  estado: Estado;
  fechaRegistro: string;
}

// Datos que se envían al crear o editar: el id y la fecha los asigna la base de datos.
export type TicketInput = Omit<Ticket, 'id' | 'fechaRegistro'>;

// Opciones que se muestran en los <select> del formulario.
export const CATEGORIAS: Categoria[] = ['Hardware', 'Software', 'Red', 'Cuentas y accesos', 'Otro'];
export const PRIORIDADES: Prioridad[] = ['Baja', 'Media', 'Alta', 'Crítica'];
export const ESTADOS: Estado[] = ['Abierto', 'En progreso', 'Resuelto', 'Cerrado'];

// Clases CSS para distinguir visualmente prioridad y estado (badges de colores).
export const CLASE_PRIORIDAD: Record<Prioridad, string> = {
  Baja: 'prioridad-baja',
  Media: 'prioridad-media',
  Alta: 'prioridad-alta',
  'Crítica': 'prioridad-critica',
};

export const CLASE_ESTADO: Record<Estado, string> = {
  Abierto: 'estado-abierto',
  'En progreso': 'estado-en-progreso',
  Resuelto: 'estado-resuelto',
  Cerrado: 'estado-cerrado',
};
