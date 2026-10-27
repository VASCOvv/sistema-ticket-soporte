import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { CATEGORIAS, ESTADOS, PRIORIDADES, TicketInput } from '../../models/ticket';

// Validador personalizado: rechaza textos que solo contienen espacios ("   ").
function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  return typeof valor === 'string' && valor.length > 0 && valor.trim().length === 0
    ? { soloEspacios: true }
    : null;
}

// Componente de FORMULARIO: se usa tanto para CREAR (/tickets/nuevo)
// como para EDITAR (/tickets/:id/editar). Si la URL trae :id, está en modo edición.
@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly categorias = CATEGORIAS;
  protected readonly prioridades = PRIORIDADES;
  protected readonly estados = ESTADOS;

  protected readonly idTicket = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  // Formulario reactivo con sus validaciones.
  protected readonly form = this.fb.nonNullable.group({
    asunto: ['', [Validators.required, sinSoloEspacios, Validators.minLength(5), Validators.maxLength(100)]],
    solicitante: ['', [Validators.required, sinSoloEspacios, Validators.minLength(3), Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, sinSoloEspacios, Validators.minLength(10), Validators.maxLength(1000)]],
    categoria: ['', Validators.required],
    prioridad: ['', Validators.required],
    estado: ['Abierto', Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idTicket.set(Number(idParam));
      this.cargarTicket(Number(idParam));
    }
  }

  // En modo edición, trae el ticket desde la API y rellena el formulario.
  private cargarTicket(id: number): void {
    this.cargando.set(true);
    this.ticketService.obtenerPorId(id).subscribe({
      next: (ticket) => {
        this.form.patchValue(ticket);
        this.cargando.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.cargando.set(false);
      },
    });
  }

  // Devuelve true si el campo es inválido y el usuario ya lo tocó (para mostrar el error).
  campoInvalido(nombre: string): boolean {
    const control = this.form.get(nombre);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  tieneError(nombre: string, error: string): boolean {
    return !!this.form.get(nombre)?.hasError(error);
  }

  guardar(): void {
    // Si hay errores, NO se envía nada al backend: se marcan los campos para mostrar los mensajes.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Revisa los campos marcados en rojo antes de guardar.');
      return;
    }

    const valores = this.form.getRawValue();
    const datos = {
      ...valores,
      asunto: valores.asunto.trim(),
      solicitante: valores.solicitante.trim(),
      descripcion: valores.descripcion.trim(),
    } as TicketInput;

    this.guardando.set(true);
    this.error.set(null);

    const id = this.idTicket();
    const peticion = id ? this.ticketService.actualizar(id, datos) : this.ticketService.crear(datos);

    peticion.subscribe({
      next: (ticket) => {
        const mensaje = id
          ? `Ticket #${ticket.id} actualizado correctamente.`
          : `Ticket #${ticket.id} creado correctamente.`;
        this.router.navigate(['/tickets'], { state: { mensaje } });
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.guardando.set(false);
      },
    });
  }
}
