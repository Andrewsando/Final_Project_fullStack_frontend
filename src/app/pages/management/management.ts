import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { Router, RouterModule } from '@angular/router';
import { ManagementList } from '../../interfaces/ManagementList';
import { FormsModule } from '@angular/forms';
import { ManagmentServices } from '../../services/managment-services';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './management.html',
  styleUrls: ['./management.css'],
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

  deleteProject(event:any, projectId:number){
    if(confirm("Are you sure you want to delete this project?")) {
      event.target.innerText = "Deleting...";
      
      this.projectServices.destroyProject(projectId).subscribe((res:any)=>{
        console.log("Project deleted successfully", res);
        this.projectServices.getManagements();
        alert("Project deleted successfully");
         window.location.reload();
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
