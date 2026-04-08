import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { Dashboard } from './components/dashboard/dashboard';
import { Usuarios } from './components/usuarios/usuarios';
import { UsuariosForm } from './components/usuarios-form/usuarios-form';
import { Equipos } from './components/equipos/equipos';
import { EquiposForm } from './components/equipos-form/equipos-form';
import { Software } from './components/software/software';
import { SoftwareForm } from './components/software-form/software-form';
import { Asignaciones } from './components/asignaciones/asignaciones';
import { AsignacionesForm } from './components/asignaciones-form/asignaciones-form';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN', 'IT_TECHNICIAN'] } },

  // Módulo de Usuarios
  { path: 'usuarios', component: Usuarios, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'usuarios/nuevo', component: UsuariosForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'usuarios/editar', component: UsuariosForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },

  // Módulo de Equipos
  { path: 'equipos', component: Equipos, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN', 'IT_TECHNICIAN'] } },
  { path: 'equipos/nuevo', component: EquiposForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'equipos/editar', component: EquiposForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },

  // Módulo de Software
  { path: 'software', component: Software, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'software/nuevo', component: SoftwareForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'software/editar', component: SoftwareForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },

  // Módulo de Asignaciones
  { path: 'asignaciones', component: Asignaciones, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'asignaciones/nuevo', component: AsignacionesForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },
  { path: 'asignaciones/editar', component: AsignacionesForm, canActivate: [AuthGuard], data: { roles: ['IT_ADMIN'] } },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
