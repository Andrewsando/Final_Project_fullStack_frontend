import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaUsuario } from '../../services/historiasusuario';

@Component({
  selector: 'app-listcards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listcards.html',
  styleUrls: ['./listcards.css'],
})
export class ListcardsComponent {
  @Input() historia!: HistoriaUsuario;
}






//Código 7-7-945//
/*import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaUsuario } from '../../services/historiasusuario';

@Component({
  selector: 'app-listcards',
  standalone: true,
  templateUrl: './listcards.html',
  styleUrls: ['./listcards.css'],
  imports: [CommonModule],
})
export class ListcardsComponent {
  @Input() historia!: HistoriaUsuario;
  @Output() editar = new EventEmitter<HistoriaUsuario>();
nuevaHistoria: any;

  editarHistoria() {
    this.editar.emit(this.historia);
  }
  crearHistoria() {
    this.historia = {
      title: '',
      description: '',
      state: 'to_do',
    };
    this.editar.emit(this.historia);
  }
   mostrarFormulario: boolean = false;
}*/

