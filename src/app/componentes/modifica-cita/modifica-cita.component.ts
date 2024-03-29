import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from 'src/app/servicios/calendario/calendario.service';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';
import { PaisService } from 'src/app/servicios/pais/pais.service';

@Component({
  selector: 'app-modifica-cita',
  templateUrl: './modifica-cita.component.html',
  styleUrls: ['./modifica-cita.component.css']
})
export class ModificaCitaComponent implements OnInit,OnDestroy,AfterContentInit{

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
  public email:string;
  public id_cita:number;
  public carga_inicial:boolean;
  public paises:Array<any>;
  public codigo_pais:string;
  public codigos:Array<any>;
  public pais_derecho_admision:boolean;
  constructor(
    private emmiterService: EmmiterService,
    private fb: FormBuilder,
    private cals: CalendarioService,
    private cita_serv: CitaService,
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
        cancelar_cita : new FormControl(false),
        codigo_pais: new FormControl('',[Validators.required])
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
  ngOnInit(): void {
    this.emmiterService.$show_modifica_cita.subscribe(
      (id_cita: number) => {
        this.muestra_form = true;    
        this.id_cita = id_cita;
        this.carga_inicial = true;
        this.consultaCita(id_cita);    
       
      }
    );
    this.emitModificaCita();
    this.getAllPaises();
    this.getAllCodigoTelPais();
  }

  getAllPaises():void{
    this.spinner = true;
    this.pais_service.getAllPaises()
    .subscribe(
      data =>{
        this.paises = data.data;
        this.spinner = false;
      },
      error => {
        this.toastr.error("Error al consultar el catalogo de paises.");
        
        this.spinner = false;
      }
    );
  }

  emitModificaCita(){
    this.emmiterService.$show_modifica_cita.subscribe(
      (id_cita: number) => {
        this.muestra_form = true;    
             
      }
    );
    
  }
  ngOnDestroy() {
    //this.emmiterService.$show_modifica_cita.unsubscribe();   
  }
  ngAfterContentInit():void{
   
  }

  consultaCita(id_cita:number):any{ 
    this.spinner = true;
    
    this.errores.nombre = false;
    this.errores.apellido_p = false;
    this.errores.pais_viaje = false;
    this.errores.fecha_viaje = false;
    this.errores.email = false;
    this.errores.whatsapp = false;
    this.errores.hora_cita = false;
    this.errores.fecha_cita = false;
    this.errores.codigo_pais = false;

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
        this.form.get("pais_viaje")?.setValue(this.cita.pais_destino__id);
        this.form.get("fecha_viaje")?.setValue(this.cita.fecha_viaje);
        this.form.get("fecha_cita")?.setValue(this.cita.horario_cita__fecha__fecha);
        this.horariosDisponibles(this.cita.horario_cita__fecha__fecha);
        this.form.get("hora_cita")?.setValue(this.cita.horario_cita__id);
        this.form.get("codigo_pais")?.setValue(this.cita.codigo_pais__id);
        this.form.get("whatsapp")?.disable();
        this.form.get("codigo_pais")?.disable();
    this.form.get("email")?.disable();
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
      this.form.get("hora_cita")?.setValue('');
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
          this.toastr.error("Fecha sin citas disponibles.");
          this.spinner = false;
        }
      );

  }

  setForm(data: any): any {
    this.horarios = data.data;

  }

  actualizaCita():any{
    this.spinner = true;

    this.form.get("whatsapp")?.enable();
    this.form.get("codigo_pais")?.enable();
    this.form.get("email")?.enable();

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.codigo_pais = !this.form.get("codigo_pais")?.valid;
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
            //this.reload.emit(true);
            this.emmiterService.reloadDates();
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
        localStorage.setItem("codigo_pais",this.form.value.codigo_pais);
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
    this.form.get("codigo_pais")?.enable();
    this.form.get("email")?.enable();

    this.errores.nombre = !this.form.get("nombre")?.valid;
    this.errores.apellido_p = !this.form.get("apellido_p")?.valid;
    this.errores.pais_viaje = !this.form.get("pais_viaje")?.valid;
    this.errores.fecha_viaje = !this.form.get("fecha_viaje")?.valid;
    this.errores.email = !this.form.get("email")?.valid;
    this.errores.whatsapp = !this.form.get("whatsapp")?.valid;
    this.errores.codigo_pais = !this.form.get("codigo_pais")?.valid;
    this.errores.hora_cita = !this.form.get("hora_cita")?.valid;
    this.errores.fecha_cita = !this.form.get("fecha_cita")?.valid;

    this.form.get("whatsapp")?.disable();
    this.form.get("codigo_pais")?.disable();
    this.form.get("email")?.disable();

    if(this.form.valid){
      this.form.get("whatsapp")?.enable();
      this.form.get("codigo_pais")?.enable();
      this.form.get("email")?.enable();
      this.muestra_form = false;
      this.show_valida_whatsapp=true;
      this.codigo_pais= this.form.get("codigo_pais")?.value;
      this.whatsapp = this.form.get("whatsapp")?.value;
      this.email = this.form.get("email")?.value;
      //this.emmiter_service.enviaTokenWhatsapp("",this.form.get("whatsapp")?.value,this.form.get("email")?.value);
      this.emmiter_service.enviaTokenWhatsapp(this.form.get("codigo_pais")?.value,this.form.get("whatsapp")?.value,this.form.get("email")?.value);
 
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
  volver():void{
    this.muestra_form = false;
    this.muestra_form = false;
  }

  
  selPais():void{
    let id_pais = this.form.get("pais_viaje")?.value;
    this.spinner = true;
    this.pais_service.validaPaisDerechoAdmision(id_pais)
    .subscribe(
      data =>{
          console.log(data);
          if(data.estatus == "0"){
            this.toastr.error(data.msj);
            this.spinner = false;
            return;
          }
          if(data.pais_derecho_admision == "0"){
            this.pais_derecho_admision = false;
          }
          console.log(data.pais_derecho_admision);
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
       // this.form.get("codigo_pais")?.setValue(141);
      },
      error => {

      }
    );
  }
}
