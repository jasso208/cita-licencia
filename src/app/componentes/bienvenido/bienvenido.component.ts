import { Component, OnInit } from '@angular/core';
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

  constructor(
    private emmiterService:EmmiterService,
    private cls:ClienteService,
    private toastr: ToastrService
  ){

  }

  ngOnInit(): void {
    //this.validaClienteAdmin();

    this.emmiterService.$valida_admin
    .subscribe(
      ()=>{
        
        this.validaClienteAdmin();
      }
    );
  }
  showMisCitas():any{
    this.emmiterService.showMisCitas();
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
