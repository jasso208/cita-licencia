import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  public show_help:boolean;
  public title = 'cita-licencia';

  constructor(){
    this.show_help=false;
  }



}
