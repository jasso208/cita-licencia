import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConvierteFechaService } from 'src/app/servicios/convierte-fecha.service';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  public mes_actual:String;
  public anio_actual:string;

  private  date:Date; 
  private pipe = new DatePipe('en-US');
  private mes_seleccionado:number;
  private anio_seleccionado:number;

  constructor(
    private cfecha:ConvierteFechaService
  ){
    this.date = new Date();
    this.mes_actual = "";
    this.anio_actual = "";

    this.mes_seleccionado = 0;
    this.anio_seleccionado = 0;    
    //console.log(hoy?.substring(0,2)); //Dia
    //console.log(hoy?.substring(3,5)); //Mes
    //console.log(hoy?.substring(6,10));//Año

    //console.log(cfecha.getMesString(Number(hoy?.substring(3,5))));
    
  }

  ngOnInit(){
    let hoy = this.pipe.transform(this.date, 'dd/MM/YYYY');

    this.mes_seleccionado = Number(hoy?.substring(3,5));
    this.anio_seleccionado = Number(hoy?.substring(6,10));
    this.setMesActual();
    
  }
  
  setMesActual(){
    this.mes_actual = this.cfecha.getMesString(this.mes_seleccionado);
    this.anio_actual = this.anio_seleccionado.toString();
  }
  mesSiguiente():void{
    this.mes_seleccionado = this.mes_seleccionado + 1;

    if(this.mes_seleccionado == 13){
      this.mes_seleccionado = 1;
      this.anio_seleccionado = this.anio_seleccionado + 1;
    }
    this.setMesActual();
  }

  mesAnterior():void{
    this.mes_seleccionado = this.mes_seleccionado - 1;

    if(this.mes_seleccionado == 0){
      this.mes_seleccionado = 12;
      this.anio_seleccionado = this.anio_seleccionado - 1;
    }
    this.setMesActual();
  }

}
