import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvierteFechaService {

  constructor() { }

  getDiasMesActual(anio_seleccionado:string,mes_seleccionado:string,fecha:string):Array<string>{        
    let dias_mes_actual = new Array<string>();
    const numero_dia = new Date(fecha).getDay();    
    var año = Number(anio_seleccionado);
    var mes2 = Number(mes_seleccionado);
    var diasMes = new Date(año, mes2, 0).getDate();        
    for(var x=0;x<numero_dia;x++){
      dias_mes_actual.push("");
    }
  
    for (var dia = 1; dia <= diasMes; dia++) {    
      dias_mes_actual.push(dia.toString());
    }


    return dias_mes_actual;
  }


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
