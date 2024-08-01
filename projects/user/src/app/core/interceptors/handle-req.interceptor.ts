import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const handleReqInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      console.log(error);
      toaster.error("Something wrong with fetching please try again later!")
      return throwError( () => new Error('Something wrong with fetching try again later!'))
    })
  );
};
