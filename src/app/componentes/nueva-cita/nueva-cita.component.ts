import { NONE_TYPE } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from 'src/app/servicios/calendario/calendario.service';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

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
  public whatsapp:string;  
  public email:string;
  constructor(
    private emmiterService: EmmiterService,
    private fb: FormBuilder,
    private cals: CalendarioService,
    private cita: CitaService,
    private toastr: ToastrService,
    private clis: ClienteService,
    private emmiter_service: EmmiterService
  ) {
    this.spinner = false;
    this.muestra_form = false;
    this.fecha_seleccionada = "";
    this.disable_email = true;
    this.disable_whatsapp = true;
    this.show_valida_whatsapp = false;

    this.form = this.fb.group(
      {
        fecha_cita: new FormControl('',[Validators.required]),
        hora_cita: new FormControl('',[Validators.required]),
        nombre: new FormControl('',[Validators.required]),
        apellido_p: new FormControl('',[Validators.required]),
        apellido_m: new FormControl(''),
        whatsapp: new FormControl('',[Validators.required]),
        email: new FormControl('',[Validators.required]),
        pais_viaje: new FormControl('',[Validators.required]),
        fecha_viaje: new FormControl('',[Validators.required])
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
      fecha_viaje: false
    }

  }

  ngOnInit() {

    this.emmiterService.$muestra_form_nuevacita.subscribe(
      (fechaSeleccionada: string) => {
        this.fecha_seleccionada = fechaSeleccionada;
        this.form.get("fecha_cita")?.setValue(fechaSeleccionada);
        this.muestra_form = true;
        this.horariosDisponibles();
        this.setForm();
      }
    );
  }

  cambioFechaCita():void{
    
    this.fecha_seleccionada = this.form.get("fecha_cita")?.value;
    let fecha = new Date(this.fecha_seleccionada + "T00:00:00");
    let today = new Date()
    let td =  new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);
    if(fecha <= td){
      this.horarios = [];
      this.toastr.error("Fecha sin citas disponibles.","Error");
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
          console.log(error);
          this.spinner = false;
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
    this.form.get("pais_viaje")?.setValue(localStorage.getItem("pais_destino"));
    this.form.get("fecha_viaje")?.setValue(localStorage.getItem("fecha_viaje"));

    
    this.form.get("email")?.setValue(localStorage.getItem("email"));
    this.form.get("email")?.disable();

    this.form.get("whatsapp")?.setValue(localStorage.getItem("whatsapp"));    
    

    if(this.form.get("whatsapp")?.valid){
      this.form.get("whatsapp")?.disable();      
    }else{
      this.form.get("whatsapp")?.enable();      
      
    }
  }
  generaCita():any{
    this.spinner = true;

    this.form.get("whatsapp")?.enable();
    this.form.get("email")?.enable();

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.hora_cita = !this.form.get("hora_cita")?.valid;
    this.errores.fecha_cita = !this.form.get("fecha_cita")?.valid;

    
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
        
      },
      error => {
        this.toastr.error("La cita se genero con exito. Error al actualizar la información del cliente.");
      }
    );

  }

  validaWhatsapp():any{

    this.form.get("whatsapp")?.enable();
    this.form.get("email")?.enable();

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.hora_cita = !this.form.get("hora_cita")?.valid;
    this.errores.fecha_cita = !this.form.get("fecha_cita")?.valid;

    this.form.get("whatsapp")?.disable();
    this.form.get("email")?.disable();
    
    if(this.form.valid){
      this.form.get("whatsapp")?.enable();
      this.form.get("email")?.enable();
      this.muestra_form = false;
      this.show_valida_whatsapp=true;
      this.whatsapp = this.form.get("whatsapp")?.value;
      this.email = this.form.get("email")?.value;
      this.emmiter_service.enviaTokenWhatsapp(this.form.get("whatsapp")?.value,this.form.get("email")?.value);
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
}
