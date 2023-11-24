import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmmiterService {

  $muestra_form_nuevacita = new EventEmitter();
  
  constructor() {     
  }

  eventoFormNuevaCita(fechaSeleccionada:string ){
    
    this.$muestra_form_nuevacita.emit(fechaSeleccionada);
  }
}
