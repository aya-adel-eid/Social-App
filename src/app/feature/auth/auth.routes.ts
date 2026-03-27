import { Routes } from '@angular/router';

export const AUTH_ROUtES: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth-page/auth-page.component').then((c) => c.AuthPageComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
        title: 'Login',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login-form/login-form.component').then((c) => c.LoginFormComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register-form/register-form.component').then(
            (c) => c.RegisterFormComponent,
          ),
        title: 'Register',
      },
    ],
  },
];
