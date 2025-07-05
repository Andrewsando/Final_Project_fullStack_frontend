import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';
import { CommonModule,  } from '@angular/common';
import { CreateUserRequest, RegisterResponse } from '../../interfaces/login';
import { RegisterService } from '../../services/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showTermsModal: boolean = false;
  modalVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordComplexityValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordComplexityValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.value;
    if (!password) return null;

    const errors: any = {};
    
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = true;
    }
    
    if (!/[a-z]/.test(password)) {
      errors.lowercase = true;
    }
    
    if (!/[0-9]/.test(password)) {
      errors.number = true;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.special = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const fullName = this.registerForm.get('fullName')?.value;
      const email = this.registerForm.get('email')?.value;
      
      const registerData: CreateUserRequest = {
        username: fullName,
        password: this.registerForm.get('password')?.value,
        email: email
      };
      
      console.log('Register data being sent:', registerData);
      console.log('Register data keys:', Object.keys(registerData));
      
      this.registerService.createUser(registerData).subscribe({
        next: (response: RegisterResponse) => {
          this.isLoading = false;
          this.router.navigate(['/login'], { 
            queryParams: { message: 'Account created successfully! Please log in.' }
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Registration error:', err);
          console.error('Error details:', {
            status: err.status,
            message: err.message,
            error: err.error
          });
          
          let backendMessage = '';
          
          // Si el error menciona 'username', es porque el backend espera ese campo
          if (err.error && typeof err.error === 'string' && err.error.includes('username')) {
            this.errorMessage = 'Backend configuration error: unexpected username field. Please contact support.';
            return;
          }
          
          if (err.error) {
            // Si hay errores específicos de validación
            if (err.error.errors) {
              const errors = err.error.errors;
              let errorMessages = [];
              
              // Extraer todos los mensajes de error específicos
              if (errors.email && Array.isArray(errors.email)) {
                errorMessages.push(`Email: ${errors.email[0]}`);
              }
              
              if (errors.username && Array.isArray(errors.username)) {
                errorMessages.push(`Username: ${errors.username[0]}`);
              }
              
              if (errors.password && Array.isArray(errors.password)) {
                errorMessages.push(`Password: ${errors.password[0]}`);
              }
              
              // Si hay otros campos de error, agregarlos también
              Object.keys(errors).forEach(field => {
                if (!['email', 'username', 'password'].includes(field) && Array.isArray(errors[field])) {
                  errorMessages.push(`${field}: ${errors[field][0]}`);
                }
              });
              
              // Unir todos los mensajes
              if (errorMessages.length > 0) {
                backendMessage = errorMessages.join('\n');
              }
            }
            
            // Si no hay errores específicos, usar el mensaje general
            if (!backendMessage && err.error.message) {
              backendMessage = err.error.message;
            }
            
            // Otros formatos de mensaje
            if (!backendMessage) {
              if (typeof err.error === 'string') {
                backendMessage = err.error;
              } else if (err.error.detail) {
                backendMessage = err.error.detail;
              }
            }
          }
          

          if (backendMessage) {
            this.errorMessage = backendMessage;
          } else {

            switch (err.status) {
              case 400:
                this.errorMessage = 'Invalid data provided';
                break;
              case 409:
                this.errorMessage = 'User already exists';
                break;
              case 422:
                this.errorMessage = 'Invalid data format';
                break;
              default:
                this.errorMessage = `Server error (${err.status}). Please try again later.`;
            }
          }
        }
      });
    }
  }

  openTermsModal(): void {
    this.showTermsModal = true;
    // Pequeño delay para permitir que el DOM se actualice antes de la animación
    setTimeout(() => {
      this.modalVisible = true;
    }, 10);
  }

  closeTermsModal(): void {
    this.modalVisible = false;
    // Esperar a que termine la animación antes de ocultar el modal
    setTimeout(() => {
      this.showTermsModal = false;
    }, 300);
  }

  acceptTerms(): void {
    this.registerForm.patchValue({ agreeTerms: true });
    this.closeTermsModal();
  }
}