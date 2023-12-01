import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public basic:boolean;
  public show_form_envio_token:boolean;

  public form:FormGroup;
  constructor(
    private fb:FormBuilder,
    private gservice:GeneralService
  ){
    this.basic = true;
    this.show_form_envio_token = true;

    this.form = this.fb.group({
      email:[''],
      whatsapp:['']
    });

  }

  envioToken():any{
    this.show_form_envio_token = false;
    this.gservice.generaToken("cliente/validaCliente",this.form.get("email")?.value,this.form.get("whatsapp")?.value)
    .subscribe(
      data=>{
        console.log(data);
      }
    );
  }
}
