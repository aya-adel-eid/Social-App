import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { STORED_KEYS } from '../constance/Stored_Keys';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const platID = inject(PLATFORM_ID);
  if (req.urlWithParams.includes('signup') || req.urlWithParams.includes('signin'))
    return next(req);

  if (isPlatformBrowser(platID)) {
    const userToken = localStorage.getItem(STORED_KEYS.token);
    if (userToken) {
      req = req.clone({
        setHeaders: {
          token: userToken,
        },
      });
    }
  }
  return next(req);
};
