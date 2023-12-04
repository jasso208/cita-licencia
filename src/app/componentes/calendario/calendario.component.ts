import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConvierteFechaService } from 'src/app/servicios/convierte-fecha.service';
import { DiasMes } from 'src/app/modelos/dia-mes';
import { NuevaCitaComponent } from '../nueva-cita/nueva-cita.component';
import { EmmiterService } from 'src/app/servicios/emmiter.service';
import { CalendarioService } from 'src/app/servicios/calendario/calendario.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  @ViewChild(NuevaCitaComponent) nueva_cita:any;

  public mes_actual:String;
  public anio_actual:string;
  public dias_mes_actual:Array<DiasMes>;
  public spinner:boolean;

  private  date:Date; 
  private pipe = new DatePipe('en-US');
  private mes_seleccionado:number;
  private anio_seleccionado:number;

  public  nombre_completo:string;
  constructor(
    private cfecha:ConvierteFechaService,
    private emmiterService:EmmiterService,
    private cs:CalendarioService,
    private toastr:ToastrService
  ){
    
    this.date = new Date();
    this.mes_actual = "";
    this.anio_actual = "";

    this.mes_seleccionado = 0;
    this.anio_seleccionado = 0;    
    this.dias_mes_actual = new Array<DiasMes>();

  }

  ngOnInit(){
    let hoy = this.pipe.transform(this.date, 'dd/MM/YYYY');
    this.mes_seleccionado = Number(hoy?.substring(3,5));
    this.anio_seleccionado = Number(hoy?.substring(6,10));
    this.setMesActual();
    this.cargaDiasMes();

    
    if(localStorage.getItem("nombre") != ""){
      this.nombre_completo = localStorage.getItem("nombre") + " " + localStorage.getItem("apellido_p") + " " + localStorage.getItem("apellido_m")
    }
    else{
      this.nombre_completo = localStorage.getItem("email");
    }
    
  }
  cargaDiasMes():void{
    
    this.spinner = true;
    let mes = this.mes_seleccionado.toString();

    if(mes.length == 1){
      mes = "0" + mes;
    }

    let fecha_dia_1 = this.anio_actual.toString() + "-" + mes + "-01 00:00:00";
    
    let fecha_dia_ultimo = new Date(Number(this.anio_actual), Number(this.mes_actual) + 1, 0);
    //let num_dia = this.cfecha.getNumeroDiaDeSemana(fecha_dia_1);

    this.cs.diasMes(this.mes_seleccionado,this.anio_seleccionado)
    .subscribe(
      data => {
        if(data.estatus == "1"){          
          this.dias_mes_actual = this.cfecha.getDiasMesActual(this.anio_seleccionado.toString(),this.mes_seleccionado.toString(),fecha_dia_1,data.data);
        }else{
          this.toastr.error("Error al cargar el calendario.","Error");
        }
        this.spinner = false;
      },
      error => {
          this.toastr.error("Error al cargar el calendario","Error");
          this.spinner = false;
      }
    );

    

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

  agendarCita(dias_disponibles:boolean,dia_s:string):void{
    if(dias_disponibles){

      let mes = this.mes_seleccionado.toString();
      let dia = dia_s.toString();

      if(mes.length == 1){
        mes = "0" + mes;
      }

      if(dia.length == 1){
        dia = "0" + dia;
      }


      let fecha = this.anio_actual.toString() + "-" + mes + "-" + dia ;

      this.emmiterService.eventoFormNuevaCita(fecha);
      
    }

  }
  reload():any{
    this.cargaDiasMes();
  }
  cerrarSesion():any{
    localStorage.clear();
    window.location.reload();
  }
}
