import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmmiterService {

  $muestra_form_nuevacita = new EventEmitter();  
  $token_whatsapp = new EventEmitter();
  $mis_citas = new EventEmitter();
  $citas_admin = new EventEmitter();
  $show_modifica_cita = new EventEmitter();
  $valida_admin = new EventEmitter();
  $menu_admin = new EventEmitter();
  $hide_modifica_cita = new EventEmitter();
  $reload_citas = new EventEmitter();
  $confirmacion_citas = new EventEmitter();
  constructor() {    

  }

  eventoFormNuevaCita(fechaSeleccionada:string ){  
    this.$muestra_form_nuevacita.emit(fechaSeleccionada);
  }

  enviaTokenWhatsapp(whatsapp:string):any{
    
    this.$token_whatsapp.emit(whatsapp);
  } 

  showMisCitas():any{
    this.$mis_citas.emit();
  }
  showMenuAdmin():void{
    this.$menu_admin.emit();
  }

  showModificaCita(id_cita:number):any{
    
    this.$show_modifica_cita.emit(id_cita);
  }

  validaAdmin():any{
    
    this.$valida_admin.emit();
  }
  showCitasAdmin():any{
    this.$citas_admin.emit();
  }
  hideModificaCita():void{
    this.$hide_modifica_cita.emit();
  }
  reloadDates(){
    this.$reload_citas.emit();
  }
  confirmacionCita():void{
    this.$confirmacion_citas.emit();
  }
}
