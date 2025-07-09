import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  showDropdown = false;
  showCreateProjectModal = false;
  modalVisible = false;
  createProjectForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private projectsService: ProjectsService
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.createProjectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      state: ['', [Validators.required]]
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  openCreateProjectModal() {
    this.showCreateProjectModal = true;
    this.showDropdown = false;
    this.resetForm();
    
    setTimeout(() => this.modalVisible = true, 10);
  }

  closeCreateProjectModal() {
    this.modalVisible = false;
    this.resetForm();
    
    setTimeout(() => this.showCreateProjectModal = false, 300);
  }

  private resetForm() {
    this.errorMessage = '';
    this.createProjectForm.reset();
  }

  onSubmitProject() {
    if (!this.createProjectForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    const user = this.getCurrentUser();
    if (!user?.id) {
      this.errorMessage = 'User session expired. Please log in again.';
      return;
    }

    this.createProject(user.id);
  }

  private getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return null;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.createProjectForm.controls).forEach(key => {
      this.createProjectForm.get(key)?.markAsTouched();
    });
  }

  private createProject(userId: number) {
    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.createProjectForm.value;
    const projectData = {
      name: formValue.name,
      description: formValue.description,
      state: formValue.state,
      user: userId
    };

    this.projectsService.createProject(projectData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.closeCreateProjectModal();
        this.notifyProjectCreated(response);
        window.location.reload();
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  }

  private notifyProjectCreated(project: any) {
    window.dispatchEvent(new CustomEvent('projectCreated', { 
      detail: project 
    }));
  }

  private handleError(error: any) {
    this.errorMessage = error.error?.message || 'Something went wrong. Please try again.';
  }

  logout() {
    const items = ['access_token', 'refresh_token', 'user'];
    items.forEach(item => localStorage.removeItem(item));
    this.router.navigate(['/login']);
  }
}