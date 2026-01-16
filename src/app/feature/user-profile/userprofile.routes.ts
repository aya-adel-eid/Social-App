import { Routes } from '@angular/router';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';

export const USERPROFIlE_ROUTES: Routes = [
  {
    path: '',

    loadComponent: () =>
      import('./pages/user-profile-page/user-profile-page.component').then(
        (c) => c.UserProfilePageComponent
      ),
  },
];
