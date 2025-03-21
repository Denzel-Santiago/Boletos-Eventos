import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/Login/login.component';
import { PedidosComponent } from './pages/Pedidos/Pedidos.component';
import { EventComponent } from './pages/Details-Event/Event.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'Login', component: LoginComponent },
    { path: 'pedidos', component: PedidosComponent },
    { path: 'event', component: EventComponent } // Ruta para la vista de eventos
];