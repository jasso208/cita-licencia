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
  public sppiner_div:boolean;
  public segundos:number;
  
  private interval:any;
  public form:FormGroup;
  constructor(
    private fb:FormBuilder,
    private gservice:GeneralService
  ){
    this.basic = true;
    this.show_form_envio_token = true;
    this.sppiner_div = false;
    this.segundos = 60;

    this.form = this.fb.group({
      email:[''],
      whatsapp:['']
    });

  }

  envioToken():any{
    this.sppiner_div = true;
    this.show_form_envio_token = false;
    this.gservice.generaToken("cliente/tokenCliente",this.form.get("email")?.value,this.form.get("whatsapp")?.value)
    .subscribe(
      data=>{
        console.log(data);
        this.sppiner_div = false;
        this.segundos = 10;
        this.enviacodigo();
       
      },
      error => {
        this.sppiner_div = false;
        this.enviacodigo();
      }
    );
  }

  enviacodigo(){
    this.interval =  setInterval(
      ()=>{
        this.timmer();
      },
      1000
    );
  }
  timmer():any{
    
    console.log(this.segundos);
    this.segundos = this.segundos - 1;
    
    if(this.segundos == 0){
      console.log("muestra boton");    
      clearInterval(this.interval);  
      
    }
   

  }

  cambiarWhatsappEmail():any{
    this.show_form_envio_token = true;
  }



}
