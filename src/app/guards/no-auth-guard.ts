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
        return true; 
      } else {
        this.router.navigate(['/dashboard']);
        return false;
      }
    }
    
    return true;
  }
}