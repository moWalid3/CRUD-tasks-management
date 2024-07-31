import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, throwError } from 'rxjs';

export const handleReqInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      console.log(error);
      toaster.error("Something with fetching wrong please try again later!");
      return throwError( () => new Error("Something Wrong try again later!"))
    }),
    // finalize({
    //   spinner.hide();
    // })
  );
};
