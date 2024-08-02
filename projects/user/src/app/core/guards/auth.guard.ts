import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.userId() !== null)
    return true;
  else {
    router.navigate(['/auth/login']);
    return false;
  }
};
