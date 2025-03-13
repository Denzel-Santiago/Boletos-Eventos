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
  private apiUrl = `${environment.apiUrl}/events`; // Asegúrate de que `environment.apiUrl` sea "http://localhost:8000"

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
    const url = `${this.apiUrl}/${id}`;
    console.log(`Obteniendo evento con ID: ${id} desde ${url}`);
    
    return this.http.get<Evento>(url).pipe(
      catchError(error => {
        console.error('Error obteniendo evento:', error);
        return throwError(() => new Error('No se pudo obtener el evento'));
      })
    );
  }
}
