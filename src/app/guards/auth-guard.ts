import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        // Aquí podrías agregar validación adicional del token
        // Por ejemplo, verificar si no está expirado
        return true; 
      }
    }
    
    // Si no hay token o es inválido, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}