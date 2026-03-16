import { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../../feature/auth/services/auth.service';
import { UserProfile } from '../../feature/auth/interfaces/UserProfile';

export const postsResolver: ResolveFn<UserProfile | any> = (route, state) => {
  const authServices = inject(AuthService);
  return authServices.getUserData();
};
