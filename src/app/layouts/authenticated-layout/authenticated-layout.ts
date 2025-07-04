import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './authenticated-layout.html',
  styleUrl: './authenticated-layout.css'
})
export class AuthenticatedLayout {

}