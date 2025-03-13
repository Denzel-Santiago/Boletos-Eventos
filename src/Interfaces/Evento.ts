export interface Evento {
    id: number;  // Agregar el id porque la API lo envía
    name: string;
    location: string;
    date: string;
    available_tickets: number;
    price: number;
  }
  