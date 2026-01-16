import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toaster.error('You must be logged in to access this page!', '', {
          progressBar: true,
        });
      }
      if (error.status == 0) {
        toaster.error('No Internet Connection!', '', {
          progressBar: true,
        });
      }
      return throwError(() => error);
    })
  );
};
