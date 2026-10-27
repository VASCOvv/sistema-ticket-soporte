import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { CLASE_ESTADO, CLASE_PRIORIDAD, ESTADOS, Estado, Ticket } from '../../models/ticket';

// Componente de LISTADO: muestra todos los tickets obtenidos desde la API.
@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList implements OnInit {
  private readonly ticketService = inject(TicketService);

  // Estado del componente con signals: al cambiar, Angular actualiza la vista.
  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly filtroEstado = signal<Estado | ''>('');

  protected readonly estados = ESTADOS;
  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly clasePrioridad = CLASE_PRIORIDAD;

  // Lista filtrada: se recalcula sola cuando cambian `tickets` o `filtroEstado`.
  protected readonly ticketsFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    return filtro ? this.tickets().filter((t) => t.estado === filtro) : this.tickets();
  });

  ngOnInit(): void {
    // Mensaje enviado desde el formulario al volver (ej: "Ticket creado correctamente").
    this.mensaje.set(history.state?.mensaje ?? null);
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.ticketService.listar().subscribe({
      next: (datos) => {
        this.tickets.set(datos);
        this.cargando.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.cargando.set(false);
      },
    });
  }

  cambiarFiltro(valor: string): void {
    this.filtroEstado.set(valor as Estado | '');
  }

  eliminar(ticket: Ticket): void {
    // Confirmación previa obligatoria antes de eliminar.
    const confirmado = confirm(
      `¿Seguro que deseas eliminar el ticket #${ticket.id} "${ticket.asunto}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    this.error.set(null);
    this.ticketService.eliminar(ticket.id).subscribe({
      next: () => {
        this.tickets.update((lista) => lista.filter((t) => t.id !== ticket.id));
        this.mensaje.set(`Ticket #${ticket.id} eliminado correctamente.`);
      },
      error: (err: Error) => this.error.set(err.message),
    });
  }
}
