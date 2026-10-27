import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { CLASE_ESTADO, CLASE_PRIORIDAD, Ticket } from '../../models/ticket';

// Componente de DETALLE (consulta): muestra toda la información de un ticket.
@Component({
  selector: 'app-ticket-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly ticket = signal<Ticket | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly clasePrioridad = CLASE_PRIORIDAD;

  ngOnInit(): void {
    // Se lee el :id desde la URL, por ejemplo /tickets/5
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ticketService.obtenerPorId(id).subscribe({
      next: (datos) => {
        this.ticket.set(datos);
        this.cargando.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.cargando.set(false);
      },
    });
  }

  eliminar(ticket: Ticket): void {
    const confirmado = confirm(
      `¿Seguro que deseas eliminar el ticket #${ticket.id} "${ticket.asunto}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    this.ticketService.eliminar(ticket.id).subscribe({
      next: () =>
        this.router.navigate(['/tickets'], {
          state: { mensaje: `Ticket #${ticket.id} eliminado correctamente.` },
        }),
      error: (err: Error) => this.error.set(err.message),
    });
  }
}
