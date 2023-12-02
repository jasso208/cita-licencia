import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
    private gservice:GeneralService,
    private toastr:ToastrService
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
        
    let data = {
      email:this.form.get("email")?.value,
      whatsapp:this.form.get("whatsapp")?.value
    }

    this.gservice.post("cliente/tokenCliente",data)
    .subscribe(
      data=>{
        console.log(data);
        this.sppiner_div = false;
        this.segundos = 10;
        this.enviacodigo();
      },
      error => {
        this.toastr.error("Error al enviar el codigo","Error");        
        this.sppiner_div = false;
        this.enviacodigo();
      }
    );
  }

  validaToken():any{
    let url = "cliente/validaTokenCliente?";
    url = url + "id_cliente=" + 12 + "&";
    url = url + "token=" + 12 + "&";
    url = url + "forma_autenticacion=" + 12 ;

    this.gservice.get(url)
    .subscribe(
      data=>{
        console.log(data);
        this.toastr.success("Error al validar el codigo.","Error");    
      },
      error =>{
        this.toastr.error("Error al validar el codigo.","Error");    
        console.log(error);
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
