import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class Dashboard implements OnInit, OnDestroy {
  firstName = '';
  projects: Project[] = [];
  isLoadingProjects = true;
  projectsError = '';

  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  private initializeComponent() {
    this.firstName = this.authService.getUserFullName();
    this.loadUserProjects();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    window.addEventListener('userUpdated', this.handleUserUpdate.bind(this));
    window.addEventListener('projectCreated', this.handleProjectCreated.bind(this));
  }

  private removeEventListeners() {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    window.removeEventListener('userUpdated', this.handleUserUpdate.bind(this));
    window.removeEventListener('projectCreated', this.handleProjectCreated.bind(this));
  }

  private handleStorageChange(e: StorageEvent) {
    if (e.key === 'user') {
      this.firstName = this.authService.getUserFullName();
    }
  }

  private handleUserUpdate() {
    this.firstName = this.authService.getUserFullName();
  }

  private handleProjectCreated() {
    this.loadUserProjects();
  }

  loadUserProjects() {
    this.isLoadingProjects = true;
    this.projectsError = '';
    
    this.projectsService.getUserProjects().subscribe({
      next: (projects) => {
        this.projects = projects || [];
        this.isLoadingProjects = false;
      },
      error: (err) => {
        console.error('Failed to load projects:', err);
        this.isLoadingProjects = false;
        this.projects = [];
      }
    });
  }

  getStatusClass(state: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'in progress': 'bg-blue-100 text-blue-800',
      'closed': 'bg-gray-100 text-gray-800',
      'pending': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return statusMap[state?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };

    return priorityMap[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }
}