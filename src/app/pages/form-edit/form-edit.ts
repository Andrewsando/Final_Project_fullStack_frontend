import { Component, NgModule } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ManagmentServices } from '../../services/managment-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-edit',
  standalone: true,
  imports: [FormsModule, HeaderComponent, RouterModule, CommonModule, ],
  templateUrl: './form-edit.html',
  styleUrl: './form-edit.css'
})
export class FormEdit { 
  projectId!: any;
  project: any;
  loading: boolean = true;
  
  constructor(private route: ActivatedRoute, private editProject: ManagmentServices) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');

    this.editProject.editProject(this.projectId).subscribe(
      res => {
        this.project = res;
        this.loading = false;
      }
    )
  }
  updateProjectData(){
    var data:any = {
      name: this.project.name,
      description: this.project.description,
      status: this.project.state,
      user: this.project.user
    };
    this.editProject.saveEditProject(data, this.projectId).subscribe({
      next:(res:any)=>{
        console.log('Project updated successfully:', res);
      },
      error:(err:any)=>{
        console.error('Error updating project:', err);
      }
    })
  }
}
