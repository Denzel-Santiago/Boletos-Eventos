import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environments';
import { Evento } from '../Interfaces/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventService {
// Nueva función para enviar mensaje con todo el JSON
sendToQueue(event: Evento): Observable<any> {
  const queueUrl = `${environment.apiUrl}/events/queue`;

  return this.http.post(queueUrl, event).pipe(
    catchError(error => {
      console.error('Error enviando a la cola:', error);
      return throwError(() => new Error('No se pudo enviar a la cola'));
    })
  );
}

buyTickets(event: Evento): Observable<any> {
  const url = `${environment.apiUrl}/events/purchase`;
  return this.http.post(url, event).pipe(
    catchError(error => {
      console.error('Error al realizar la compra:', error);
      return throwError(() => new Error('No se pudo completar la compra'));
    })
  );
}



  
  private apiUrl = `${environment.apiUrl}/events/`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error obteniendo eventos:', error);
        return throwError(() => new Error('No se pudo obtener la lista de eventos'));
      })
    );
  }

  getEventById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error('Error obteniendo evento:', error);
        return throwError(() => new Error('No se pudo obtener el evento'));
      })
    );
  }

  createEvent(event: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, event).pipe(
      catchError(error => {
        console.error('Error creando evento:', error);
        return throwError(() => new Error('No se pudo crear el evento'));
      })
    );
  }

  updateEvent(id: number, event: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}${id}`, event).pipe(
      catchError(error => {
        console.error('Error actualizando evento:', error);
        return throwError(() => new Error('No se pudo actualizar el evento'));
      })
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error('Error eliminando evento:', error);
        return throwError(() => new Error('No se pudo eliminar el evento'));
      })
    );
  }
}
