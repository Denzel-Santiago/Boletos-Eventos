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
  editingEvent: Evento | null = null;
  currentEvent: Evento = this.initializeNewEvent();
  api2Event: any = null;
  showModal = false;

  // Propiedad para manejar la fecha en el formato correcto para el input
  get currentEventFormattedDate(): string {
    if (!this.currentEvent.date) return '';
    // Convertir la fecha ISO a formato compatible con datetime-local
    return this.currentEvent.date.slice(0, 16);
  }

  set currentEventFormattedDate(value: string) {
    // Convertir el valor del input a formato ISO
    this.currentEvent.date = value ? `${value}:00Z` : '';
  }

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.cancelEdit();
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
      next: (events) => {
        this.events = events;
        // Si necesitas mostrar la fecha en un formato legible:
        this.events.forEach(event => {
          event.date = this.formatDateForDisplay(event.date);
        });
      },
      error: (error) => console.error('Error cargando eventos:', error)
    });
  }

  addEvent(): void {
    if (!this.validateEvent(this.currentEvent)) return;

    // Asegurarnos de que la fecha tenga el formato correcto
    const eventToSend = {
      ...this.currentEvent,
      date: this.ensureUTCDateFormat(this.currentEvent.date)
    };

    this.eventService.createEvent(eventToSend).subscribe(
      (event) => {
        event.date = this.formatDateForDisplay(event.date);
        this.events.push(event);
        this.resetForm();
        this.closeModal();
      },
      (error) => console.error('Error al agregar evento:', error)
    );
  }

  editEvent(event: Evento): void {
    this.editingEvent = { ...event };
    this.currentEvent = { 
      ...event,
      // Convertir la fecha almacenada al formato editable
      date: event.date.includes('T') ? event.date : `${event.date}T00:00:00Z`
    };
  }

  updateEvent(): void {
    if (!this.editingEvent) return;

    const eventToSend = {
      ...this.currentEvent,
      date: this.ensureUTCDateFormat(this.currentEvent.date)
    };

    this.eventService.updateEvent(this.editingEvent.id, eventToSend).subscribe(
      (updatedEvent) => {
        updatedEvent.date = this.formatDateForDisplay(updatedEvent.date);
        const index = this.events.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }
        this.resetForm();
        this.closeModal();
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

  cancelEdit(): void {
    this.editingEvent = null;
    this.currentEvent = this.initializeNewEvent();
  }

  resetForm(): void {
    this.currentEvent = this.initializeNewEvent();
    this.editingEvent = null;
  }

  validateEvent(event: Evento): boolean {
    if (!event.name.trim() || !event.location.trim() || !event.date.trim() || event.available_tickets <= 0 || event.price < 0) {
      alert('Todos los campos son obligatorios y deben tener valores válidos.');
      return false;
    }
    return true;
  }

  // Función para formatear la fecha para mostrarla
  private formatDateForDisplay(isoDate: string): string {
    if (!isoDate) return '';
    
    try {
      const date = new Date(isoDate);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return isoDate;
    }
  }

  // Función para asegurar el formato UTC
  private ensureUTCDateFormat(dateString: string): string {
    if (!dateString) return '';
    
    // Si ya termina con Z, es UTC
    if (dateString.endsWith('Z')) return dateString;
    
    // Si no, añadir la Z
    return dateString.endsWith('00:00') ? `${dateString}Z` : dateString;
  }
}