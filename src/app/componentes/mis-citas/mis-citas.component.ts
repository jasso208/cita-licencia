import { Component } from '@angular/core';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent {

  public show:boolean;
  public spinner:boolean;

  constructor(
    private ms:EmmiterService
  ){
      this.show = false;
      this.spinner = false;

      this.ms.$mis_citas.subscribe(
        () =>{
          this.showMisCitas();
        }
      );
  }

  showMisCitas(){
    this.show = true;
  }

}
