import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ArbolBinarioComponent } from './components/arbol-binario/arbol-binario.component';
import { ArbolNarioComponent } from './components/arbol-nario/arbol-nario.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'arbol-binario',
    component: ArbolBinarioComponent,
    canActivate: [authGuard]
  },
  {
    path: 'arbol-nario',
    component: ArbolNarioComponent,
    canActivate: [authGuard]
  },
  { path: '**', component: NoEncontradoComponent }
];
