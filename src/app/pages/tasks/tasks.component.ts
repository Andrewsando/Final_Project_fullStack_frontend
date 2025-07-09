import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent {
  tasks = [
    { name: 'Design the user interface', status: 'In Progress', assignee: 'A. Ramirez', file: null },
    { name: 'Develop the backend API', status: 'To Do', assignee: 'J. Lopez', file: null },
    { name: 'Test the application', status: 'Done', assignee: 'N. Rojas', file: null }
  ];

  editingIndex: number | null = null;
  editedTask = { name: '', status: '', assignee: '', file: null };

  addTask() {
    this.tasks.push({
      name: 'New Task',
      status: 'To Do',
      assignee: 'Unassigned',
      file: null
    });
  }

  startEditTask(i: number) {
    this.editingIndex = i;
    this.editedTask = { ...this.tasks[i] };
  }

  saveEditTask(i: number) {
    this.tasks[i] = { ...this.editedTask };
    this.editingIndex = null;
  }

  cancelEditTask() {
    this.editingIndex = null;
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
    this.editingIndex = null;
  }

  changeStatus(i: number) {
    const statuses = ['To Do', 'In Progress', 'Done'];
    const current = statuses.indexOf(this.tasks[i].status);
    this.tasks[i].status = statuses[(current + 1) % statuses.length];
  }

  attachFile(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.tasks[i].file = file;
    }
  }
}
