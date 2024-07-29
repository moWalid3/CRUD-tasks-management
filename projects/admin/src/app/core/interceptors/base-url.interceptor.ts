import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let finalReq = req.clone({
    url: `http://localhost:3000/${req.url}`,
  })
  return next(finalReq);
};
