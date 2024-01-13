import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent implements OnInit {
  public admin:string;
  public form:FormGroup;
  public muestra_continuar:boolean = false;
  public muestra_valida_doc:boolean;
  constructor(
    private emmiterService:EmmiterService,
    private cls:ClienteService,
    private toastr: ToastrService,
    private fb:FormBuilder
  ){
      let dv = localStorage.getItem("doc_validado");
      if(dv != "1"){
        
      this.muestra_valida_doc=true;
      }
  }

  ngOnInit(): void {
    //this.validaClienteAdmin();

    this.emmiterService.$valida_admin
    .subscribe(
      ()=>{
        
        this.validaClienteAdmin();
      }
    );

    this.form = this.fb.group(
      {
        ch1: new FormControl(false,[Validators.min(1)]),
        ch2: new FormControl(false,[Validators.min(1)]),
        ch3: new FormControl(false,[Validators.min(1)]),
        ch4: new FormControl(false,[Validators.min(1)])
      }
    );
    this.muestra_continuar = false;
      
  }

  validaForm():void{

    let ch1 = this.form.get("ch1")?.value;
    let ch2 = this.form.get("ch2")?.value;
    let ch3 = this.form.get("ch3")?.value;
    let ch4 = this.form.get("ch4")?.value;
    
    if(ch1 && ch2  && ch3  && ch4){
      this.muestra_continuar = true;
    }else{
      this.muestra_continuar = false;
    }
  }
  continuar():void{
    this.muestra_valida_doc = false;
    localStorage.setItem("doc_validado","1");
  }
  showMisCitas():any{
    this.emmiterService.showMisCitas();
  }

  showMenuAdmin():void{
    this.emmiterService.showMenuAdmin();
  }
  cerrarSesion():any{
    localStorage.clear();
    window.location.reload();
  }

  //Despues de iniciar sesion, recarga la pagina
  //para validar si el usuario es admin. 
  validaClienteAdmin():void{
    let id_cliente = localStorage.getItem("id_cliente");
    if(id_cliente == null){
      return ;
    }
    this.cls.validaClienteAdmin()
    .subscribe(
      data=>{
       
        if(data.estatus == "0"){
          this.toastr.error("Error al validar perfil del cliente","Error");
          return;
        }
        this.admin = data.admin;

      },
      error => {
        this.toastr.error("Error al validar el perfil del cliente","Error");
      }
    );
  }

}
