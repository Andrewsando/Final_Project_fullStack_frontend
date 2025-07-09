import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  return next(req).pipe(
    tap(event => {
      if (event.type === 4) {
        const url = req.url;
        const method = req.method;
        
        if (url.includes('/login/') && method === 'POST' && event.status === 200) {
          const response = event.body as any;
          if (response.tokens?.access) {
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
          }
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }
        
        if (url.includes('/create/') && method === 'POST' && event.status === 201) {
          const response = event.body as any;
          if (response.id && response.username && response.email) {
            const userData = {
              id: response.id,
              username: response.username,
              email: response.email,
              name: response.username
            };
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
        
        if ((url.includes('/users/') && (method === 'PUT' || method === 'PATCH')) && event.status === 200) {
          const response = event.body as any;
          if (response.user) {
            authService.updateCurrentUser(response.user);
          } else if (response.id || response.email || response.name) {
            authService.updateCurrentUser(response);
          }
        }
      }
    })
  );
};
