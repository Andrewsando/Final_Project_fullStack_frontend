import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListcardsComponent } from '../../components/listcards/listcards';
import { HistoriasUsuarioService, HistoriaUsuario } from '../../services/historiasusuario';

@Component({
  selector: 'app-hulist',
  standalone: true,
  templateUrl: './hulist.html',
  styleUrls: ['./hulist.css'],
  imports: [CommonModule, FormsModule, ListcardsComponent],
})
export class HulistComponent implements OnInit {
  historias: HistoriaUsuario[] = [];
  nuevaHistoria: HistoriaUsuario = { title: '', description: '', state: 'to_do' };
  mostrarFormulario: boolean = false;

  constructor(private historiaService: HistoriasUsuarioService) {}

  ngOnInit(): void {
    this.cargarHistorias();
  }

  cargarHistorias(): void {
    this.historiaService.getHistorias().subscribe((data) => {
      this.historias = data;
    });
  }

  crearHistoria(): void {
    this.nuevaHistoria = { title: '', description: '', state: 'to_do' };
    this.mostrarFormulario = true;
  }

  guardarHistoria(): void {
    const accion = this.nuevaHistoria.id
      ? this.historiaService.actualizarHistoria(this.nuevaHistoria.id, this.nuevaHistoria)
      : this.historiaService.crearHistoria(this.nuevaHistoria);

    accion.subscribe(() => {
      this.cargarHistorias();
      this.nuevaHistoria = { title: '', description: '', state: 'to_do' };
      this.mostrarFormulario = false;
    });
  }

  editarHistoria(historia: HistoriaUsuario): void {
    this.nuevaHistoria = { ...historia };
    this.mostrarFormulario = true;
  }
}






