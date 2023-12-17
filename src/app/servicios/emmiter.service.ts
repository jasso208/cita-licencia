import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmmiterService {

  $muestra_form_nuevacita = new EventEmitter();  
  $token_whatsapp = new EventEmitter();
  $mis_citas = new EventEmitter();
  $show_modifica_cita = new EventEmitter();
  $valida_admin = new EventEmitter();
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

  showModificaCita(id_cita:number):any{
    
    this.$show_modifica_cita.emit(id_cita);
  }

  validaAdmin():any{
    
    this.$valida_admin.emit();
  }
}
