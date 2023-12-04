import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmmiterService {

  $muestra_form_nuevacita = new EventEmitter();
  
  $token_whatsapp = new EventEmitter();

  constructor() {     
  }

  eventoFormNuevaCita(fechaSeleccionada:string ){
    
    this.$muestra_form_nuevacita.emit(fechaSeleccionada);
  }

  enviaTokenWhatsapp(whatsapp:number):any{
    this.$token_whatsapp.emit(whatsapp);
  }
}
