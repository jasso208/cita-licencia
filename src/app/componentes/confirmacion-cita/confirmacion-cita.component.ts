import { Component } from '@angular/core';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-confirmacion-cita',
  templateUrl: './confirmacion-cita.component.html',
  styleUrls: ['./confirmacion-cita.component.css']
})
export class ConfirmacionCitaComponent {

  public show_confirmacion:boolean;

  constructor(
    private em:EmmiterService
  ){
    this.show_confirmacion = false;

    this.em.$confirmacion_citas.subscribe(
      () => {
        this.show_confirmacion = true;
      }
    );
  }

  continuar():void{
    this.show_confirmacion = false;
  }

}
