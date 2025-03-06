import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/Login/login.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'Login', component: LoginComponent }


];
