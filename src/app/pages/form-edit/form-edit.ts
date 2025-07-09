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
  project!: any;

  loading: boolean = false;
  loadingTitle: string = "Loading project data...";
  errors: any = [];
  
  constructor(private route: ActivatedRoute, private editProject: ManagmentServices) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    
    this.loading = true;
    this.editProject.editProject(this.projectId).subscribe(
      res => {
        this.project = res;
        this.loading = false;
      }
    )
  }
  updateProjectData(){
    var inputNewData  = {
      id : this.project.id,
      name: this.project.name,
      description: this.project.description,
      state: this.project.state,
      user: this.project.user,
    }
     this.loading = true;


    this.editProject.saveEditProject(this.projectId, inputNewData).subscribe({
      next:(res)=>{
        console.log("editado correctamente", res);
        alert(res);
        this.loading = false;
      },
      error:(err)=>{
        console.log(err);
        this.errors = err.error;
        this.loading = false;
      }
    });
  }
}
