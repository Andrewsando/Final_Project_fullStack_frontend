import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ProfileService } from '../../services/profile';
import { User, UpdateProfileRequest } from '../../interfaces/login';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.setupFormChangeListeners();
  }

  setupFormChangeListeners(): void {
    // Limpiar errores al escribir
    this.profileForm.get('name')?.valueChanges.subscribe(() => {
      if (this.fieldErrors['name']) {
        delete this.fieldErrors['name'];
      }
    });

    this.profileForm.get('email')?.valueChanges.subscribe(() => {
      if (this.fieldErrors['email']) {
        delete this.fieldErrors['email'];
      }
    });

    this.profileForm.get('password')?.valueChanges.subscribe(() => {
      if (this.fieldErrors['password']) {
        delete this.fieldErrors['password'];
      }
    });
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Formulario vacío para permitir actualizaciones selectivas
    this.profileForm.patchValue({
      name: '',
      email: '',
      password: ''
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  hasFieldError(fieldName: string): boolean {
    const formField = this.profileForm.get(fieldName);
    const hasFormError = formField?.invalid && formField?.touched;
    const hasBackendError = !!this.fieldErrors[fieldName];
    return hasFormError || hasBackendError;
  }

  getFieldErrorMessage(fieldName: string): string {
    if (this.fieldErrors[fieldName]) {
      return this.fieldErrors[fieldName];
    }
    
    const formField = this.profileForm.get(fieldName);
    if (formField?.invalid && formField?.touched) {
      const errors = formField.errors;
      if (errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (errors?.['email']) {
        return 'Enter a valid email address';
      }
      if (errors?.['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters`;
      }
    }
    
    return '';
  }

  clearForm(): void {
    this.profileForm.patchValue({
      name: '',
      email: '',
      password: ''
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};
  }

  refreshUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    setTimeout(() => {
      this.currentUser = this.authService.getCurrentUser();
    }, 100);
  }

  onSubmit(): void {
    // Obtener valores sin espacios
    const name = this.profileForm.get('name')?.value?.trim() || '';
    const email = this.profileForm.get('email')?.value?.trim() || '';
    const password = this.profileForm.get('password')?.value?.trim() || '';
    
    // Validación: al menos un campo debe estar completado
    if (!name && !email && !password) {
      this.errorMessage = 'Please fill at least one field to update your profile.';
      return;
    }
    
    // Validar campos individuales si se proporcionan
    if (email && this.profileForm.get('email')?.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    
    if (password && this.profileForm.get('password')?.invalid) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};

    const updateData: UpdateProfileRequest = {};

    // Solo incluir campos con contenido
    if (name && name.length > 0) {
      updateData.name = name;
    }
    
    if (email && email.length > 0) {
      updateData.email = email;
    }

    if (password && password.length > 0) {
      updateData.password = password;
    }

    const hasEmptyFields = Object.values(updateData).some(value => 
      value === '' || value === null || value === undefined
    );
    
    if (hasEmptyFields) {
      this.errorMessage = 'Error: Empty fields detected. Please try again.';
      this.isLoading = false;
      return;
    }

    this.profileService.updateProfile(updateData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully';
        
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser = response.user;
        } else if (response.id) {
          localStorage.setItem('user', JSON.stringify(response));
          this.currentUser = response;
        } else {
          this.authService.updateCurrentUser(updateData);
        }
        
        this.refreshUserData();
        
        window.dispatchEvent(new CustomEvent('userUpdated', { 
          detail: { updatedFields: Object.keys(updateData) }
        }));
        // Limpiar campo de contraseña
        this.profileForm.patchValue({ password: '' });
        
        setTimeout(() => {
          this.profileForm.patchValue({
            name: '',
            email: '',
            password: ''
          });
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        
        if (err.error && typeof err.error === 'string' && err.error.includes('<!DOCTYPE')) {
          this.errorMessage = `Server error: Received HTML instead of JSON response. Check if backend is running on the correct URL.`;
          return;
        }
        
        let errorMessages: string[] = [];
        this.fieldErrors = {};
        
        if (err.error) {
          const errorData = err.error;
          
          const fieldMappings: { [key: string]: string } = {
            'email': 'Email',
            'name': 'Name', 
            'password': 'Password',
            'username': 'Username'
          };
          
          Object.keys(fieldMappings).forEach(field => {
            if (errorData[field]) {
              let errorMsg = '';
              if (Array.isArray(errorData[field])) {
                errorMsg = errorData[field][0];
              } else if (typeof errorData[field] === 'string') {
                errorMsg = errorData[field];
              }
              
              if (errorMsg) {
                this.fieldErrors[field] = errorMsg;
                errorMessages.push(`${fieldMappings[field]}: ${errorMsg}`);
              }
            }
          });
          
          Object.keys(errorData).forEach(field => {
            if (!fieldMappings[field] && errorData[field] && field !== 'non_field_errors') {
              let errorMsg = '';
              if (Array.isArray(errorData[field])) {
                errorMsg = errorData[field][0];
              } else if (typeof errorData[field] === 'string') {
                errorMsg = errorData[field];
              }
              
              if (errorMsg) {
                this.fieldErrors[field] = errorMsg;
                errorMessages.push(`${field}: ${errorMsg}`);
              }
            }
          });
          
          if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessages.push(...errorData.non_field_errors);
          }
          
          if (errorMessages.length === 0) {
            if (errorData.message) {
              errorMessages.push(errorData.message);
            } else if (errorData.detail) {
              errorMessages.push(errorData.detail);
            } else if (typeof errorData === 'string') {
              errorMessages.push(errorData);
            }
          }
        }
        
        if (errorMessages.length > 0) {
          this.errorMessage = errorMessages.join('\n');
        } else {
          switch (err.status) {
            case 400:
              this.errorMessage = 'Invalid data provided. Please check your input and try again.';
              break;
            case 401:
              this.errorMessage = 'You are not authorized to perform this action. Please log in again.';
              break;
            case 409:
              this.errorMessage = 'The email or name is already in use by another user.';
              break;
            case 422:
              this.errorMessage = 'Validation error. Please check your input data.';
              break;
            case 500:
              this.errorMessage = 'Server error. Please try again later.';
              break;
            default:
              this.errorMessage = `Error updating profile (Code: ${err.status}). Please try again.`;
          }
        }
      }
    });
  }
}
