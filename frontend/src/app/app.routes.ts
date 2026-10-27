import { Routes } from '@angular/router';
import { TicketList } from './components/ticket-list/ticket-list';
import { TicketForm } from './components/ticket-form/ticket-form';
import { TicketDetail } from './components/ticket-detail/ticket-detail';

// Rutas de la aplicación. El orden importa: 'tickets/nuevo' va ANTES que 'tickets/:id',
// si no, Angular interpretaría "nuevo" como si fuera un id.
export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', component: TicketList, title: 'Tickets' },
  { path: 'tickets/nuevo', component: TicketForm, title: 'Nuevo ticket' },
  { path: 'tickets/:id', component: TicketDetail, title: 'Detalle del ticket' },
  { path: 'tickets/:id/editar', component: TicketForm, title: 'Editar ticket' },
  { path: '**', redirectTo: 'tickets' },
];
