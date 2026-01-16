import { Routes } from '@angular/router';
import { TimlinePageComponent } from './pages/timline-page/timline-page.component';

export const TIMeLINE_ROUTEs: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/timline-page/timline-page.component').then((c) => c.TimlinePageComponent),
  },
];
