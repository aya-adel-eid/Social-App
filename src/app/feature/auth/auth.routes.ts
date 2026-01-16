import { Routes } from '@angular/router';

export const AUTH_ROUtES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    title: 'Login',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
    // component: LoginComponent,
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((c) => c.RegisterComponent),
    title: 'Register',
    // component: RegisterComponent,
  },
];
