import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.includes('/i18n/')) 
    return next(req);

  let finalReq = req.clone({
    url: `http://localhost:3000/${req.url}`,
  })
  return next(finalReq);
};
