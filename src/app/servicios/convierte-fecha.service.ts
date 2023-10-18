import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvierteFechaService {

  constructor() { }


  getMesString(mes:number):String{
    
    let mesString:String;
    mesString = "Error";
    if(mes == 1){
      mesString = "Enero";
    }
    if(mes == 2){
      mesString = "Febrero";
    }
    if(mes == 3){
      mesString = "Marzo";
    }
    if(mes == 4){
      mesString = "Abril";
    }
    if(mes == 5){
      mesString = "Mayo";
    }
    if(mes == 6){
      mesString = "Junio";
    }
    if(mes == 7){
      mesString = "Julio";
    }
    if(mes == 8){
      mesString = "Agosto";
    }
    if(mes == 9){
      mesString = "Septiembre";
    }
    if(mes == 10){
      mesString = "Octubre";
    }
    if(mes == 11){
      mesString = "Noviembre";
    }
    if(mes == 12){
      mesString = "Diciembre";
    }

    return mesString;

  }
}
