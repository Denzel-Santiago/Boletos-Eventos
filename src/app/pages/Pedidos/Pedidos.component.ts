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
    console.log('Comprando boletos para:', event);
    alert(`¡Compra exitosa para ${event.name}!`);
  }
}
