import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Ticket, TicketInput } from '../models/ticket';

// Servicio que CENTRALIZA toda la comunicación HTTP con la API REST.
// Los componentes nunca usan HttpClient directamente: siempre pasan por aquí.
@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/tickets';

  // GET /api/tickets -> lista de tickets
  listar(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl).pipe(catchError(this.manejarError));
  }

  // GET /api/tickets/:id -> un ticket
  obtenerPorId(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`).pipe(catchError(this.manejarError));
  }

  // POST /api/tickets -> crea un ticket
  crear(ticket: TicketInput): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket).pipe(catchError(this.manejarError));
  }

  // PUT /api/tickets/:id -> actualiza un ticket
  actualizar(id: number, ticket: TicketInput): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket).pipe(catchError(this.manejarError));
  }

  // DELETE /api/tickets/:id -> elimina un ticket
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.manejarError));
  }

  // Traduce el error HTTP a un mensaje entendible para el usuario.
  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensaje: string;
    if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.';
    } else if (error.error?.mensaje) {
      mensaje = error.error.mensaje; // mensaje enviado por nuestra API
    } else if (error.status === 404) {
      mensaje = 'El ticket solicitado no existe.';
    } else {
      mensaje = `Error inesperado del servidor (código ${error.status}).`;
    }
    return throwError(() => new Error(mensaje));
  }
}
