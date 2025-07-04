import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ProjectsService } from '../../services/projects';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/login';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  firstName: string = '';
  projects: Project[] = [];
  isLoadingProjects: boolean = true;
  projectsError: string = '';

  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.firstName = this.authService.getUserFullName();
    this.loadUserProjects();
    this.setupStorageListener();
  }

  setupStorageListener(): void {
    window.addEventListener('storage', (e) => {
      if (e.key === 'user') {
        this.firstName = this.authService.getUserFullName();
      }
    });
    
    window.addEventListener('userUpdated', (e: any) => {
      this.refreshUserName();
    });
  }

  loadUserProjects(): void {
    this.isLoadingProjects = true;
    this.projectsError = '';
    
    this.projectsService.getUserProjects().subscribe({
      next: (response) => {
        this.projects = response.projects || [];
        this.isLoadingProjects = false;
      },
      error: (err) => {
        this.isLoadingProjects = false;
        this.projectsError = 'Error loading projects';
        this.projects = [];
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'media':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(state: string): string {
    switch (state?.toLowerCase()) {
      case 'en curso':
      case 'in progress':
      case 'activo':
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'completado':
      case 'completed':
      case 'finalizado':
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  refreshUserName(): void {
    this.firstName = this.authService.getUserFullName();
  }
}