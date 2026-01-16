import { Routes } from '@angular/router';
import { loggedGuard } from './core/guards/logged-guard';
import { authGuard } from './core/guards/auth-guard';
import { title } from 'process';

export const routes: Routes = [
  //auth
  {
    path: '',
    canActivate: [loggedGuard],
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout.component').then((c) => c.AuthLayoutComponent),
    // component: AuthLayoutComponent,
    loadChildren: () => import('./feature/auth/auth.routes').then((c) => c.AUTH_ROUtES),
    // children: AUTH_ROUtES,
  },
  //user
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'timeline',
        loadChildren: () =>
          import('./feature/timeline/timline.routes').then((c) => c.TIMeLINE_ROUTEs),
        title: 'TimeLine',
      },
      // children: TIMeLINE_ROUTEs },
      {
        path: 'userProfile',
        loadChildren: () =>
          import('./feature/user-profile/userprofile.routes').then((c) => c.USERPROFIlE_ROUTES),
        title: 'UserProfile',
      },
      // children: USERPROFIlE_ROUTES },
      {
        path: 'changePassword',
        loadComponent: () =>
          import('./feature/auth/pages/change-password/change-password.component').then(
            (c) => c.ChangePasswordComponent
          ),
        title: 'Change Password',
        // component: ChangePasswordComponent,
      },
    ],
  },
  //not-found
  {
    path: 'notFound',
    loadComponent: () =>
      import('./feature/static-pages/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
    title: 'Not Found',
  },
  {
    path: '**',
    redirectTo: 'notFound',
    pathMatch: 'full',
    title: 'Not Found',
  },
];
