import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() login_ok  = new EventEmitter<boolean>();

  public basic:boolean;
  public show_form_envio_token:boolean;
  public sppiner_div:boolean;
  public segundos:number;
  public tipo_autenticacion_str:string;
  public form:FormGroup;
  public form_codigo:FormGroup;

  private interval:any;
  private id_cliente:string;
  private forma_autenticacion:string;

  constructor(
    private fb:FormBuilder,
    private gservice:GeneralService,
    private toastr:ToastrService
  ){
    console.log(localStorage.getItem("id_cliente"));
    if(localStorage.getItem("id_cliente") == null  || localStorage.getItem("id_cliente")== ""){
      this.basic = true;
    }
    else{
      this.basic = false;
    }
    
    this.show_form_envio_token = true;
    this.sppiner_div = false;
    this.segundos = 60;
    this.tipo_autenticacion_str = "";

    this.form = this.fb.group({
      email:[''],
      whatsapp:['']
    });

    this.form_codigo = this.fb.group({
      token:['']
    });

  }

  envioToken():any{
    this.sppiner_div = true;
        
    let data = {
      email:this.form.get("email")?.value,
      whatsapp:this.form.get("whatsapp")?.value
    }

    this.gservice.post("cliente/tokenCliente",data)
    .subscribe(
      data=>{

        if(data.estatus == 0){
          this.toastr.error(data.msj,"Error");
          this.sppiner_div = false;
          return ;
        }
        
        this.id_cliente = data.id_cliente;
        this.forma_autenticacion = data.forma_autenticacion

        this.show_form_envio_token = false;

        if(data.forma_autenticacion == "E"){
          this.tipo_autenticacion_str = "email " + this.form.get("email")?.value
        }
        
        if(data.forma_autenticacion == "W"){
          this.tipo_autenticacion_str = "whatsapp " + this.form.get("whatsapp")?.value
        }
        this.sppiner_div = false;
        this.segundos = 60;
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
    url = url + "id_cliente=" + this.id_cliente + "&";
    url = url + "token=" + this.form_codigo.get("token")?.value + "&";
    url = url + "forma_autenticacion=" + this.forma_autenticacion ;

    this.gservice.get(url)
    .subscribe(
      data=>{        
        this.form_codigo.get("token")?.setValue("");
        if(data.estatus == "0"){
          this.toastr.error(data.msj,"Error");
          return;
        }
        
        console.log(data);
        localStorage.setItem("id_cliente",this.id_cliente);
        localStorage.setItem("nombre",data.data.nombre);
        localStorage.setItem("apellido_p",data.data.apellido_p);
        localStorage.setItem("apellido_m",data.data.apellido_m);                
        localStorage.setItem("email",data.data.email);
        localStorage.setItem("whatsapp",data.data.whatsapp);
        localStorage.setItem("pais_destino",data.data.pais_destino);
        let fecv = data.data.fecha_viaje;
        if(fecv =='null'){
          fecv = '';
        }
        localStorage.setItem("fecha_viaje",fecv);
        localStorage.setItem("forma_autenticacion",this.forma_autenticacion);
      
        this.login_ok.emit(true);
        //this.toastr.success("Error al validar el codigo.","Error");    
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
    
    this.segundos = this.segundos - 1;
    
    if(this.segundos <= 0){  
      clearInterval(this.interval);  
      
    }
  }

  cambiarWhatsappEmail():any{
    this.show_form_envio_token = true;
  }

  limpiaEmail():any{
    if(this.form.get("whatsapp")?.value != ""){
      this.form.get("email")?.setValue("");
    }
  }
  limpiaWhatsapp():any{
    if(this.form.get("email")?.value != ""){
      this.form.get("whatsapp")?.setValue("");
    }
    
  }
}
