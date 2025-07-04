import { Injectable } from '@angular/core';
import { User } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getCurrentUser(): User | null {
    if (typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString);
      }
    }
    return null;
  }
  getUserFullName(): string {
    const user = this.getCurrentUser();
    if (user) {
      // Usar el campo name si está disponible, sino usar first_name y last_name
      return user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return 'Usuario';
  }

  updateCurrentUser(updatedUserData: Partial<any>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser && typeof localStorage !== 'undefined') {
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }
}