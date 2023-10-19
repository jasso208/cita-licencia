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
  public dias_mes_actual:Array<string>;

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
    this.dias_mes_actual = new Array<string>();

  }

  ngOnInit(){
    let hoy = this.pipe.transform(this.date, 'dd/MM/YYYY');
    this.mes_seleccionado = Number(hoy?.substring(3,5));
    this.anio_seleccionado = Number(hoy?.substring(6,10));
    this.setMesActual();
    this.cargaDiasMes();
  }
  
  cargaDiasMes():void{
    let mes = this.mes_seleccionado.toString();

    if(mes.length == 1){
      mes = "0" + mes;
    }
    let fecha_dia_1 = this.anio_actual.toString() + "-" + mes + "-01 00:00:00";
    
    let fecha_dia_ultimo = new Date(Number(this.anio_actual), Number(this.mes_actual) + 1, 0);
    //let num_dia = this.cfecha.getNumeroDiaDeSemana(fecha_dia_1);

    this.dias_mes_actual = this.cfecha.getDiasMesActual(this.anio_seleccionado.toString(),this.mes_seleccionado.toString(),fecha_dia_1);

  }
  setMesActual():void{
    this.mes_actual = this.cfecha.getMesString(this.mes_seleccionado);
    this.anio_actual = this.anio_seleccionado.toString();
    this.cargaDiasMes();
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
