import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORED_KEYS } from '../constance/Stored_Keys';
import { AuthService } from '../../feature/auth/services/auth.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const platID = inject(PLATFORM_ID);
  const router = inject(Router);
  const authServices = inject(AuthService);
  if (isPlatformBrowser(platID)) {
    const token = localStorage.getItem(STORED_KEYS.token);
    if (token && authServices.decodeToken(token)) {
      return router.parseUrl('/timeline');
    }
  }
  return true;
};
