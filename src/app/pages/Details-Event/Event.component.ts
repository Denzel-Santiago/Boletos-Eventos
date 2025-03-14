import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../Service/event.service';
import { Evento } from '../../../Interfaces/Evento';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EventComponent implements OnInit {
  events: Evento[] = [];
  newEvent: Evento = this.initializeNewEvent();
  editingEvent: Evento | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  initializeNewEvent(): Evento {
    return {
      id: 0,
      name: '',
      location: '',
      date: '',
      price: 0,
      available_tickets: 0
    };
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => this.events = events,
      error: (error) => console.error('Error cargando eventos:', error)
    });
  }

  addEvent(): void {
    if (!this.validateEvent(this.newEvent)) return;

    this.eventService.createEvent(this.newEvent).subscribe(
      (event) => {
        this.events.push(event);
        this.resetForm();
      },
      (error) => console.error('Error al agregar evento:', error)
    );
  }

  editEvent(event: Evento): void {
    this.editingEvent = { ...event };
  }

  updateEvent(): void {
    if (!this.editingEvent) return;
  
    this.eventService.updateEvent(this.editingEvent.id, this.editingEvent).subscribe(
      (updatedEvent) => {
        const index = this.events.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }
        this.resetForm();
      },
      (error) => console.error('Error al actualizar el evento:', error)
    );
  }
  

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe(
        () => this.events = this.events.filter(e => e.id !== id),
        (error) => console.error('Error eliminando evento:', error)
      );
    }
  }

  resetForm(): void {
    this.newEvent = this.initializeNewEvent();
    this.editingEvent = null;
  }

  validateEvent(event: Evento): boolean {
    if (!event.name.trim() || !event.location.trim() || !event.date.trim() || event.available_tickets <= 0 || event.price < 0) {
      alert('Todos los campos son obligatorios y deben tener valores válidos.');
      return false;
    }
    return true;
  }
}
