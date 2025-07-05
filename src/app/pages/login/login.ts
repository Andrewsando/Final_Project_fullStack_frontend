import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    
    // Test backend connectivity on component load
    this.testBackendConnection();
  }

  testBackendConnection() {
    console.log('Testing backend connection...');
    this.loginService.testConnection().subscribe({
      next: (response) => {
        console.log('Backend connection successful:', response);
      },
      error: (error) => {
        console.error('Backend connection failed:', error);
        if (error.status === 0) {
          console.error('CORS or network issue - backend might not be running on localhost:8000');
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginData: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
       this.loginService.login(loginData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Raw login response:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'null');
          
          if (!response) {
            console.error('Empty response from login');
            this.errorMessage = 'Invalid response from server';
            return;
          }
          
          // Manejar diferentes estructuras de respuesta del backend
          let accessToken = null;
          let refreshToken = null;
          let userData = null;
          
          // Estructura estándar esperada
          if (response.tokens) {
            accessToken = response.tokens.access;
            refreshToken = response.tokens.refresh;
            userData = response.user;
          }
          // Estructura alternativa - tokens en el nivel superior
          else if (response.access_token || response.access) {
            accessToken = response.access_token || response.access;
            refreshToken = response.refresh_token || response.refresh;
            userData = response.user || response;
          }
          // Estructura alternativa - user y tokens separados
          else if (response.token || response.access) {
            accessToken = response.token || response.access;
            refreshToken = response.refresh;
            userData = response.user || response;
          }
          
          console.log('Extracted access token:', accessToken);
          console.log('Extracted refresh token:', refreshToken);
          console.log('Extracted user data:', userData);
          
          if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken);
            }
          } else {
            console.error('No access token found in response');
            this.errorMessage = 'Invalid login response - no access token';
            return;
          }
          
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.error('No user data found in response');
            this.errorMessage = 'Invalid login response - no user data';
            return;
          }
          
          console.log('Login successful, navigating to dashboard...');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Login error:', err);
          
          if (err.status === 401) {
            this.errorMessage = 'Invalid credentials. Please check your email and password.';
          } else if (err.status === 404) {
            this.errorMessage = 'User not found. Please check your email.';
          } else if (err.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = 'Something went wrong. Please try again later.';
          }
        },
      });
    }
  }
}