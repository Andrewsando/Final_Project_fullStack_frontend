import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
      
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Guardar token si el backend lo devuelve
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          // Redirigir al home
          this.router.navigate(['']); 
        },
        error: (err) => {
          this.isLoading = false;
          // Mostrar mensaje de error específico
          if (err.status === 401) {
            this.errorMessage = 'Incorrect credentials';
          } else if (err.status === 404) {
            this.errorMessage = 'User not found';
          } else {
            this.errorMessage = 'Server error. Please try again later.';
          }
        },
      });
    }
  }
}