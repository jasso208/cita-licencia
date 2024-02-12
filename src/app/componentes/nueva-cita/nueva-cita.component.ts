import { NONE_TYPE } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from 'src/app/servicios/calendario/calendario.service';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';
import { PaisService } from 'src/app/servicios/pais/pais.service';

@Component({
  selector: 'app-nueva-cita',
  templateUrl: './nueva-cita.component.html',
  styleUrls: ['./nueva-cita.component.css']
})
export class NuevaCitaComponent implements OnInit {

  @Input() muestra_form: boolean;

  @Output() reload = new EventEmitter<any>();

  public fecha_seleccionada: string;
  public form: FormGroup;
  public spinner: boolean;
  public horarios: Array<any>;
  public disable_email: boolean;
  public disable_whatsapp: boolean;
  public errores:any;
  public show_valida_whatsapp:boolean;
  public codigo_pais:string;
  public whatsapp:string;
  public paises:Array<any>;
  public email:string;
  public pais_derecho_admision:boolean;
  public codigos:Array<any>;
  public bloqueaaltacita:boolean;
  public administrador:number;

  constructor(
    private emmiterService: EmmiterService,
    private fb: FormBuilder,
    private cals: CalendarioService,
    private cita: CitaService,
    private toastr: ToastrService,
    private clis: ClienteService,
    private emmiter_service: EmmiterService,
    private pais_service:PaisService
  ) {
    this.spinner = false;
    this.muestra_form = false;
    this.fecha_seleccionada = "";
    this.disable_email = true;
    this.disable_whatsapp = true;
    this.show_valida_whatsapp = false;
    this.pais_derecho_admision = false;
    this.bloqueaaltacita = true;
    this.form = this.fb.group(
      {
        fecha_cita: new FormControl('',[Validators.required]),
        hora_cita: new FormControl('',[Validators.required]),
        nombre: new FormControl('',[Validators.required]),
        apellido_p: new FormControl('',[Validators.required]),
        apellido_m: new FormControl('',[Validators.required]),
        whatsapp: new FormControl('',[Validators.required]),
        email: new FormControl('',[Validators.required]),
        pais_viaje: new FormControl('',[Validators.required]),
        fecha_viaje: new FormControl('',[Validators.required]),
        codigo_pais:new FormControl('',[Validators.required])
      }
    );

    this.errores= {
      fecha_cita: false,
      hora_cita: false,
      nombre: false,
      apellido_p: false,
      apellido_m: false,
      whatsapp: false,
      email: false,
      pais_viaje: false,
      fecha_viaje: false,
      codigo_pais:false
    }

  }

  ngOnInit() {

    this.emmiterService.$muestra_form_nuevacita.subscribe(
      (fechaSeleccionada: string) => {
        this.fecha_seleccionada = fechaSeleccionada;
        this.form.get("fecha_cita")?.setValue(fechaSeleccionada);
        this.muestra_form = true;
        this.pais_derecho_admision = false;
        
        this.horariosDisponibles();        
        this.getAllPaises();
        this.setForm();
        this.validaClienteConCita();
        this.validaPerfilSession();
      }
    );

    
    this.getAllCodigoTelPais();

  }

  //al ser administrador. se cargara siempre el formulario en blanco.
  isAdministrador():void{

    //this.form.get("fecha_cita")?.setValue("");
    this.form.get("hora_cita")?.setValue("");
    this.form.get("nombre")?.setValue("");
    this.form.get("apellido_p")?.setValue("");
    this.form.get("apellido_m")?.setValue("");
    this.form.get("whatsapp")?.setValue("");
    this.form.get("email")?.setValue("");
    this.form.get("pais_viaje")?.setValue("");
    this.form.get("fecha_viaje")?.setValue("");
    this.form.get("codigo_pais")?.setValue("");

    this.form.get("codigo_pais")?.enable();   
    this.form.get("whatsapp")?.enable();
    this.form.get("email")?.enable();

  }

  getAllPaises():void{
    this.spinner=true;
    this.pais_service.getAllPaises()
    .subscribe(
      data => {
        this.paises = data.data;
        this.spinner=false;
      },
      error=>{
        this.toastr.error("Error al cargar el catalogo de paises.");
        this.spinner = false;
      }
    );
  }
  cambioFechaCita():void{
    
    this.fecha_seleccionada = this.form.get("fecha_cita")?.value;

    let num_dia = new Date(this.fecha_seleccionada).getDay(); 


    if(num_dia == 5 || num_dia == 6){
      this.horarios = [];
      //this.toastr.error("Fecha sin citas disponibles.","Error");
      let today = new Date();
      return ;
    }

    let fecha = new Date(this.fecha_seleccionada + "T00:00:00");
    let today = new Date()
    let td =  new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);
    if(fecha <= td){
      this.horarios = [];
      //this.toastr.error("Fecha sin citas disponibles.","Error");
      let today = new Date();
      return ;
   //   this.fecha_seleccionada = yourDate.getFullYear().toString() + "-" + yourDate.getDate().toString() + "-" + yourDate.getMonth().toString() ;
    }
    
    this.horariosDisponibles();  
  }

  horariosDisponibles(): any {
    this.horarios = null;
    this.spinner = true;
    this.cals.horariosDisponible(this.fecha_seleccionada)
      .subscribe(
        data => {

          this.setHorarios(data);

          this.spinner = false;
        },
        error => {
          this.spinner = false;
          this.toastr.error("Fecha sin citas disponibles.");
        }
      );

  }

  setHorarios(data: any): any {
    this.horarios = data.data;

 
  }

  setForm():void{
    this.form.get("nombre")?.setValue(localStorage.getItem("nombre"));
    this.form.get("apellido_p")?.setValue(localStorage.getItem("apellido_p"));
    this.form.get("apellido_m")?.setValue(localStorage.getItem("apellido_m"));
    //this.form.get("pais_viaje")?.setValue(localStorage.getItem("pais_destino"));
    //this.form.get("fecha_viaje")?.setValue(localStorage.getItem("fecha_viaje"));
    this.form.get("pais_viaje")?.setValue("");
    this.form.get("fecha_viaje")?.setValue("");

    
    this.form.get("email")?.setValue(localStorage.getItem("email"));
    this.form.get("email")?.disable();

    this.form.get("whatsapp")?.setValue(localStorage.getItem("whatsapp"));  
    
    this.form.get("codigo_pais")?.setValue(localStorage.getItem("codigo_pais"));    
    
    if(this.form.get("whatsapp")?.value != "" && this.form.get("codigo_pais")?.value != ""){
      this.form.get("whatsapp")?.disable();   
      this.form.get("codigo_pais")?.disable();      
    }else{
      this.form.get("whatsapp")?.enable();   
      this.form.get("codigo_pais")?.enable();   
    }
  }

  
  validaPerfilSession():void{

    this.clis.validaPerfilSession()
    .subscribe(
      data => {
        this.administrador = data.administrador;

        if(data.estatus == "0") {
          this.toastr.error(data.msj);
        }else{
          //Si es administrador, no solicita confirmación por whatsapp
          if(data.administrador == "1"){
            this.isAdministrador();
          }
          //else{
          //  this.validaWhatsapp();
          //}
        }

      },
      error => {
        this.toastr.error("Error al validar la session.");
      }
    );
  }

  altaCita():void{
    if(this.administrador == 1){
      this.generaCitaAdministrador();
    }else{
      this.validaWhatsapp();
    }
  }

  
  generaCitaAdministrador():any{
    this.spinner = true;

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.apellido_m = !this.form.get("apellido_m")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.hora_cita = !this.form.get("hora_cita")?.valid;
    this.errores.fecha_cita = !this.form.get("fecha_cita")?.valid;
    this.errores.codigo_pais = !this.form.get("codigo_pais")?.valid;

    if(this.form.valid){
      this.cita.generaCitaAdministrador(this.form)
      .subscribe(
        data=>{
            this.spinner = false;
            if(data.estatus == "0"){
              this.toastr.error(data.msj);
              return;
            }
            //this.toastr.success("Cita generada con exito.","Notificación");
            this.muestra_form = false;
            
            console.log("generaCitaAdministrador");
            console.log(data.data);
            console.log(data.data[0].id);
            this.actualizaClienteAdministrador(data.data[0].id);
            this.reload.emit(true);
            this.emmiterService.confirmacionCita();
        },
        error => {
          this.toastr.error("Error al generar la cita.","Error");
          this.spinner = false;
        }
      );
    }
    else{
      this.spinner = false;
    }
  }
/*
  validaClienteConCita():void{
    this.spinner = true;
    this.cita.validaClienteConCita()
    .subscribe(
      data => {
        if(data.estatus == "1"){
          this.bloqueaaltacita=false;
        }
        else{
          this.bloqueaaltacita=true;
        }
        this.spinner=false;
      },
      error => {
        this.bloqueaaltacita=false;
        this.spinner=false;
      }
    );
  }
*/
  generaCita():any{
    this.spinner = true;

    this.form.get("whatsapp")?.enable();
    this.form.get("codigo_pais")?.enable();
    this.form.get("email")?.enable();

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.apellido_m = !this.form.get("apellido_m")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.hora_cita = !this.form.get("hora_cita")?.valid;
    this.errores.fecha_cita = !this.form.get("fecha_cita")?.valid;
    this.errores.codigo_pais = !this.form.get("codigo_pais")?.valid;

    if(this.form.valid){
      this.cita.generaCita(this.form)
      .subscribe(
        data=>{
            this.spinner = false;
            if(data.estatus == "0"){
              this.toastr.error(data.msj);
              return;
            }
            //this.toastr.success("Cita generada con exito.","Notificación");
            this.muestra_form = false;
            this.actualizaCliente();
            this.reload.emit(true);
            this.emmiterService.confirmacionCita();
        },
        error => {
          this.toastr.error("Error al generar la cita.","Error");
          this.spinner = false;
        }
      );
    }
    else{
      this.spinner = false;
    }
  }

  validaClienteConCita():void{
    this.spinner = true;
    this.cita.validaClienteConCita()
    .subscribe(
      data => {
        if(data.estatus == "1"){
          this.bloqueaaltacita=false;
        }
        else{
          this.bloqueaaltacita=true;
        }
        this.spinner=false;
      },
      error => {
        this.bloqueaaltacita=false;
        this.spinner=false;
      }
    );
  }

    //Esta peticion correo de fondo. 
  //No bloquea al usuario
  actualizaClienteAdministrador(id_cita:number):any{
    //this.spinner = true;
    console.log("actualizaClienteAdministrador");
    console.log(id_cita);
    this.clis.actualizaCliente(this.form,id_cita)
    .subscribe(
      data => {

        if(data.estatus == "0"){
          this.toastr.error(data.msj,"Error");
          return ;
        }
        
        localStorage.setItem("nombre",this.form.value.nombre);
        localStorage.setItem("apellido_p",this.form.value.apellido_p);
        localStorage.setItem("apellido_m",this.form.value.apellido_m);                
        localStorage.setItem("email",this.form.value.email);
        localStorage.setItem("whatsapp",this.form.value.whatsapp);
        localStorage.setItem("pais_destino",this.form.value.pais_viaje);
        localStorage.setItem("fecha_viaje",this.form.value.fecha_viaje);
        localStorage.setItem("codigo_pais",this.form.value.codigo_pais);
        
      },
      error => {
        this.toastr.error("La cita se genero con exito. Error al actualizar la información del cliente.");
      }
    );

  }

  //Esta peticion correo de fondo. 
  //No bloquea al usuario
  actualizaCliente():any{
    //this.spinner = true;
    this.clis.actualizaCliente(this.form)
    .subscribe(
      data => {

        if(data.estatus == "0"){
          this.toastr.error(data.msj,"Error");
          return ;
        }
        
        localStorage.setItem("nombre",this.form.value.nombre);
        localStorage.setItem("apellido_p",this.form.value.apellido_p);
        localStorage.setItem("apellido_m",this.form.value.apellido_m);                
        localStorage.setItem("email",this.form.value.email);
        localStorage.setItem("whatsapp",this.form.value.whatsapp);
        localStorage.setItem("pais_destino",this.form.value.pais_viaje);
        localStorage.setItem("fecha_viaje",this.form.value.fecha_viaje);
        localStorage.setItem("codigo_pais",this.form.value.codigo_pais);
        
      },
      error => {
        this.toastr.error("La cita se genero con exito. Error al actualizar la información del cliente.");
      }
    );

  }

  validaWhatsapp():any{

    this.form.get("whatsapp")?.enable();
    this.form.get("codigo_pais")?.enable();
    this.form.get("email")?.enable();

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.apellido_m = !this.form.get("apellido_m")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.hora_cita = !this.form.get("hora_cita")?.valid;
    this.errores.fecha_cita = !this.form.get("fecha_cita")?.valid;
    this.errores.codigo_pais = !this.form.get("codigo_pais")?.valid;


  
   
    this.form.get("email")?.disable();

    if(this.form.valid){
      this.form.get("codigo_pais")?.enable();
      this.form.get("whatsapp")?.enable();
      this.form.get("email")?.enable();
      this.muestra_form = false;
      this.show_valida_whatsapp=true;
      this.whatsapp = this.form.get("whatsapp")?.value;
      this.codigo_pais = this.form.get("codigo_pais")?.value;
      this.email = this.form.get("email")?.value;
      this.emmiter_service.enviaTokenWhatsapp(this.form.get("codigo_pais")?.value,this.form.get("whatsapp")?.value,this.form.get("email")?.value);
    }
    else{

    }
  }

  //Si entra aqui es porque confirmo a travez de whatsapp
  //el movimiento
  hideValidaWhatsapp():any{
      this.muestra_form = true;
      this.show_valida_whatsapp=false;
      
      this.generaCita();
  }
  cancelar():any{
    
    this.muestra_form = false;
    this.show_valida_whatsapp=false;
  }

  selPais():void{
    let id_pais = this.form.get("pais_viaje")?.value;
    this.spinner = true;
    this.pais_service.validaPaisDerechoAdmision(id_pais)
    .subscribe(
      data =>{
          if(data.estatus == "0"){
            this.toastr.error(data.msj);
            this.spinner = false;
            return;
          }
          if(data.pais_derecho_admision == "0"){
            this.pais_derecho_admision = false;
          }
          if(data.pais_derecho_admision == "1"){
            this.pais_derecho_admision = true;
          }
          this.spinner = false;
      },
      error => {
        this.toastr.error("Error al validar el pais.","Error");
        this.spinner = false;
      }
    );
  }


  getAllCodigoTelPais():void{
    //this.form.get("codigo_pais")?.enable();
        
    this.pais_service.getAllCodigoTelPais()
    .subscribe(
      data => {
        
        
        this.codigos = data.data;
        //this.form.get("codigo_pais")?.setValue(141);
      },
      error => {

      }
    );
  }

}
