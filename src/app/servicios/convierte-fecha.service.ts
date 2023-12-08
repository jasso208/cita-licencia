import { Injectable } from '@angular/core';
import { DiasMes } from '../modelos/dia-mes';

@Injectable({
  providedIn: 'root'
})
export class ConvierteFechaService {

  constructor() { }

  getDiasMesActual(anio_seleccionado:string,mes_seleccionado:string,fecha:string,data:any):Array<DiasMes>{        
    
    let dias_mes_actual = new Array<DiasMes>();    
    const numero_dia = new Date(fecha).getDay();    
    var año = Number(anio_seleccionado);
    var mes2 = Number(mes_seleccionado);
    var diasMes = new Date(año, mes2, 0).getDate();   

    for(var x=0;x<numero_dia;x++){
      let dm = new DiasMes("",false);
      dias_mes_actual.push(dm);
    }
  
    for (var dia = 1; dia <= diasMes; dia++) {    
      let fechavalida = this.validaFechaAnterior(new Date(año, mes2-1, dia));
      let dm:any;   
      dm = new DiasMes(dia.toString(),fechavalida);      
      dias_mes_actual.push(dm);
    }
    

    //Valida si los dias del mes aun tiene fecha disponibles.      
    for(let dm of dias_mes_actual){
      if(dm.tiene_hora_disponible){
        dm.tiene_hora_disponible = false;
        for(let d of data){
          let dia = parseInt(d.fecha__fecha.substring(8));
          let dia2 = parseInt(dm.dia);
          
          if(dia == dia2){
            if(d.horarios_disponibles > 0){
              dm.tiene_hora_disponible = true;
            }
          }
        }
      }
      
    }


   
    return dias_mes_actual;
  }

  //valida la fecha que recibe como parametro
  //para determinar si es anterior al dia actual.
  private validaFechaAnterior(fecha:Date,):boolean{

    let num_dia = new Date(fecha).getDay();  
    if(num_dia == 0 || num_dia == 6){
      return false;
    }
    let hoy = new Date();

    //para pruebas
    //if(fecha.getDate() == 25){
    //  return false;
    //}
    if(fecha < hoy){
      return false;
    }
    return true;
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
      mesString = "Sept.";
    }
    if(mes == 10){
      mesString = "Octubre";
    }
    if(mes == 11){
      mesString = "Nov.";
    }
    if(mes == 12){
      mesString = "Dic.";
    }

    return mesString;

  }
}
