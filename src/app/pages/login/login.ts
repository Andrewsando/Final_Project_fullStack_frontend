import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest, LoginResponse } from '../../interfaces/login';

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
        next: (response: LoginResponse) => {
          this.isLoading = false;
          // Guardar tokens JWT
          if (response.tokens) {
          localStorage.setItem('access_token', response.tokens.access);
          localStorage.setItem('refresh_token', response.tokens.refresh);
          }
          // Guardar información del usuario
          localStorage.setItem('user', JSON.stringify(response.user));
          // Redirigir al home
          this.router.navigate(['']); 
        },
        error: (err) => {
          this.isLoading = false;
          // Mostrar mensaje de error específico
          if (err.status === 401) {
            this.errorMessage = 'Credenciales incorrectas';
          } else if (err.status === 404) {
            this.errorMessage = 'Usuario no encontrado';
          } else {
            this.errorMessage = 'Error del servidor. Intenta más tarde.';
          }
        },
      });
    }
  }
}