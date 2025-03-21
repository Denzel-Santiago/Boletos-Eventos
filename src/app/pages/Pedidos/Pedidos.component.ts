import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Evento } from '../../../Interfaces/Evento';
import { EventService } from '../../../Service/event.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './Pedidos.component.html',
  styleUrls: ['./Pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  events: Evento[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents()
      .pipe(catchError(error => {
        console.error('Error al cargar eventos:', error);
        return of([]);
      }))
      .subscribe((data: Evento[]) => {
        this.events = data;
        console.log('Eventos cargados:', this.events);
      });
  }

  buyTickets(event: Evento): void {
    this.eventService.buyTickets(event).subscribe({
      next: response => {
        alert(`Compra exitosa para ${event.name}`);
        console.log('Compra enviada:', response);
  
        // Enviar mensaje a RabbitMQ con toda la información del evento
        this.eventService.sendToQueue(event).subscribe({
          next: res => console.log('Mensaje enviado a la cola:', res),
          error: err => console.error('Error enviando a la cola:', err),
        });
      },
      error: err => {
        alert('Error al realizar la compra');
        console.error(err);
      }
    });
  }
  
  
  
}
