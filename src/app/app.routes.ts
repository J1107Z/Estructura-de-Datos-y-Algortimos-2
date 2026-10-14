import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'explorador',
    component: FileExplorerComponent,
    canActivate: [authGuard]
  },
  { path: '**', component: NoEncontradoComponent }
];
