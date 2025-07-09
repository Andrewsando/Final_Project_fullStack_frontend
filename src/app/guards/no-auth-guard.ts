import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return true; // Permitir acceso a login/register si no hay token
      } else {
        // Si ya está autenticado, redirigir al dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
    }
    
    return true;
  }
}