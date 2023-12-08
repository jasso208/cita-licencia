import { Component } from '@angular/core';
import { EmmiterService } from './servicios/emmiter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  public show_help:boolean;
  public title = 'cita-licencia';

  constructor(
    private ms:EmmiterService
  ){
    this.show_help=false;
  }


  login_ok():any{
    window.location.reload();
  }

  showMisCitas():any{
    this.ms.showMisCitas();
  }

}
