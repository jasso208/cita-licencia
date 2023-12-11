import { Component } from '@angular/core';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent {


  constructor(
    private emmiterService:EmmiterService
  ){

  }
  showMisCitas():any{
    this.emmiterService.showMisCitas();
  }
  cerrarSesion():any{
    localStorage.clear();
    window.location.reload();
  }


}
