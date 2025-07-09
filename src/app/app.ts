import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksComponent} from "./pages/tasks/tasks.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TasksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Final_Project_fullStack_frontend';
}
