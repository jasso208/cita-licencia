import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-nueva-cita',
  templateUrl: './nueva-cita.component.html',
  styleUrls: ['./nueva-cita.component.css']
})
export class NuevaCitaComponent implements OnInit{

  @Input() muestra_form:boolean;

  public fecha_seleccionada:string;
  public form:FormGroup;
  constructor(
    private emmiterService:EmmiterService,
    private fb:FormBuilder
  ){
    this.muestra_form =false;
    this.fecha_seleccionada = "";
    this.form  = this.fb.group(
      {
        fecha_cita: new FormControl(''),
        hora_cita: new FormControl('')
      }
    );
  }

  ngOnInit(){

    this.emmiterService.$muestra_form_nuevacita.subscribe(
      (fechaSeleccionada:string) =>  { 
          console.log(fechaSeleccionada);
          this.fecha_seleccionada = fechaSeleccionada;
         this.form.get("fecha_cita")?.setValue(fechaSeleccionada);
        
        this.muestra_form =true;
      }
    );

    
  }

  

}
