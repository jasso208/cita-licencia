import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from 'src/app/servicios/calendario/calendario.service';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-modifica-cita',
  templateUrl: './modifica-cita.component.html',
  styleUrls: ['./modifica-cita.component.css']
})
export class ModificaCitaComponent {

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
  public cita:any;
  public whatsapp:string;
  public id_cita:number;
  public carga_inicial:boolean;
  constructor(
    private emmiterService: EmmiterService,
    private fb: FormBuilder,
    private cals: CalendarioService,
    private cita_serv: CitaService,
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
        fecha_viaje: new FormControl('',[Validators.required]),
        cancelar_cita : new FormControl(false)
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

    this.emmiterService.$show_modifica_cita.subscribe(
      (id_cita: number) => {
        this.muestra_form = true;    
        this.id_cita = id_cita;
        this.carga_inicial = true;
        this.consultaCita(id_cita);      
      }
    );
  }

  consultaCita(id_cita:number):any{ 
    this.spinner = true;
    this.cita_serv.consultaCita(id_cita)
    .subscribe(
      data => {
        
        this.cita = data.data[0];
        
        this.spinner = false;

        this.form.get("nombre")?.setValue(this.cita.nombre);        
        this.form.get("apellido_p")?.setValue(this.cita.apellido_p);
        this.form.get("apellido_m")?.setValue(this.cita.apellido_m);
        this.form.get("whatsapp")?.setValue(this.cita.whatsapp);
        this.form.get("email")?.setValue(this.cita.email);
        this.form.get("pais_viaje")?.setValue(this.cita.pais_destino);
        this.form.get("fecha_viaje")?.setValue(this.cita.fecha_viaje);
        this.form.get("fecha_cita")?.setValue(this.cita.horario_cita__fecha__fecha);
        this.horariosDisponibles(this.cita.horario_cita__fecha__fecha);
        this.form.get("hora_cita")?.setValue(this.cita.horario_cita__id);
      },
      error => {
        this.toastr.error("Error al consultar la cita.","Error");
        this.spinner = false;
      }
    );
  }

  cambioFechaCita():void{
    this.carga_inicial = false;
    let fecha1 = this.form.get("fecha_cita")?.value;


    
    let fecha = new Date(fecha1 + "T00:00:00");
    let today = new Date()
    let td =  new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);
    if(fecha <= td){
      this.horarios = [];
      this.toastr.error("Fecha sin citas disponibles.","Error");
      let today = new Date();
      return ;
   //   this.fecha_seleccionada = yourDate.getFullYear().toString() + "-" + yourDate.getDate().toString() + "-" + yourDate.getMonth().toString() ;
    }



    this.horariosDisponibles(fecha1);  
  }
  horariosDisponibles(fecha_cita:string): any {
    this.horarios = null;
    this.spinner = true;
    this.cals.horariosDisponible(fecha_cita)
      .subscribe(
        data => {

          this.setForm(data);

          this.spinner = false;
        },
        error => {
          
          this.spinner = false;
        }
      );

  }

  setForm(data: any): any {
    this.horarios = data.data;

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
    }
  }

  actualizaCita():any{
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
      this.cita_serv.actualizaCita(this.id_cita,this.form)
      .subscribe(
        data=>{
            this.spinner = false;
            if(data.estatus == "0"){
              this.toastr.error(data.msj);
              return;
            }
            this.toastr.success("Cita actualizada con exito.","Notificación");
            this.muestra_form = false;
            this.actualizaCliente();
            this.reload.emit(true);
        },
        error => {
          this.toastr.error("Error al actualizar la cita.","Error");
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
      this.emmiter_service.enviaTokenWhatsapp(this.form.get("whatsapp")?.value);
    }
  }

  //Si entra aqui es porque confirmo a travez de whatsapp
  //el movimiento
  hideValidaWhatsapp():any{
      this.muestra_form = true;
      this.show_valida_whatsapp=false;
      
      this.actualizaCita();
  }
  cancelar():any{
    
    this.muestra_form = false;
    this.show_valida_whatsapp=false;
  }
}
