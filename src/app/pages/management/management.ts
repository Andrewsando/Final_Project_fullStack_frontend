import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { ManagmentServices } from '../../services/managment-services';
import { Router, RouterModule } from '@angular/router';
import { ManagementList } from '../../interfaces/ManagementList';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './management.html',
  styleUrl: './management.css'
})
export class Management {

  listProjects: ManagementList[] | null = null

  constructor(private projectServices:ManagmentServices, private router:Router){ }

  ngOnInit(){
    this.projectServices.getManagements().subscribe({
      next: (response) =>{
        this.listProjects = response;
        console.log(this.listProjects);
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }
  
  formatStatus(state: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'in_progress': 'In Progress',
      'closed': 'Closed'
    };
    
    return statusMap[state] || state;
  }
}
