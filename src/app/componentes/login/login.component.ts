import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public basic:boolean;
  public show_form_envio_token:boolean;

  constructor(){
    this.basic = true;
    this.show_form_envio_token = true;
  }
}
