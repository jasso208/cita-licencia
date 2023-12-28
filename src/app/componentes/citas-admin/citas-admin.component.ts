import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-citas-admin',
  templateUrl: './citas-admin.component.html',
  styleUrls: ['./citas-admin.component.css']
})
export class CitasAdminComponent {
  public show:boolean;
  public spinner:boolean;
  public citas:any;
  public form:FormGroup;
  private solo_activas:boolean;
  public total_page:number;
  public form_page:FormGroup;
  public pagination:any;
  public existen_citas:boolean;
  public date:string;
  public modifica_cita:boolean;
  constructor(
    private ms:EmmiterService,
    private cita:CitaService,
    private toas:ToastrService,
    private fb:FormBuilder
    
  ){
      this.show = false;
      this.spinner = false;
      this.total_page = 1;
      this.existen_citas = false;
      this.form = this.fb.group(
        {
          fecha:new FormControl("",[Validators.required]),
          solo_activas:new FormControl(true)
        }
      );

      this.form_page = this.fb.group(
        {
          num_page:new FormControl(1)
        }
      );

      this.ms.$citas_admin.subscribe(
        () =>{
          this.form_page.get("num_page")?.setValue(1);
          this.showCitasAdmin();
        }
      );

      this.ms.$hide_modifica_cita.subscribe(
        ()=>{
            this.modifica_cita = false;
        }
      );
      

  }

  showCitasAdmin(){

    let today = new Date();
    let todays = today.toLocaleString();
 
    todays = todays.substring(3,5) + "/" + todays.substring(0,2) + "/" + todays.substring(6,10);
    
    this.date = todays;
  
    this.form.get("solo_activas")?.setValue(true);
    this.solo_activas=false;
    this.show = true;
    this.soloActivas();
  }

  soloActivas():any{
    this.solo_activas = !this.solo_activas;
    this.getAllCitas();
  }

  lastPagina():any{
    let total_page = this.pagination.total_pages;
    this.form_page.get("num_page")?.setValue(total_page);
    this.getAllCitas();
  }
  firstPagina():any{
    
    this.form_page.get("num_page")?.setValue(1);
    this.getAllCitas();
  }
  nextPagina():any{
    let total_page = this.pagination.total_pages;
    let num_page = this.form_page.get("num_page")?.value;

    num_page = num_page + 1;
    
    this.form_page.get("num_page")?.setValue(num_page);

    if(num_page > total_page){
      this.form_page.get("num_page")?.setValue(total_page);
    }
    this.getAllCitas();
  }

  backPagina():any{
    let total_page = this.pagination.total_pages;
    let num_page = this.form_page.get("num_page")?.value;

    num_page = num_page - 1;
    
    this.form_page.get("num_page")?.setValue(num_page);

    if(num_page <= 0){
      this.form_page.get("num_page")?.setValue(1);
    }
    this.getAllCitas();
  }

  cambiaPagina():any{
    let total_page = this.pagination.total_pages;
    let num_page = this.form_page.get("num_page")?.value;
    if(num_page > total_page){
      this.form_page.get("num_page")?.setValue(total_page);
    }

    if(num_page <= 0){
      this.form_page.get("num_page")?.setValue(1);
    }
  }

  getAllCitas():any{

    
    if(this.date == undefined || this.date == ""){
      this.toas.error("Debe indicar una fecha.","Error");
      return;
    }
    this.existen_citas=false;
    this.citas = undefined;
    this.spinner = true;
    
    let num_page = this.form_page.get("num_page")?.value;
    //let solo_activas = this.form.get("solo_activas")?.value;
    if(num_page == undefined){
      num_page = 1;
    }
  
    //cambiamos formato de fecha
    moment.locale("es");
    let date2 = moment(this.date).format("YYYY-MM-DD");
    //alert(date2);
    this.cita.getAllCitas(date2,this.solo_activas,num_page)
    .subscribe(
      data => {
        console.log(data);
        if(data.estatus == "0"){
          this.toas.error(data.msj,"Error");
          this.spinner = false;
          return ;
        }

        this.citas= data.data;
        this.pagination = data.pagination
        
        for(let c of this.citas){
          
          this.existen_citas = true;
        }

        this.spinner = false;
      },
      error => {
        console.log(error);
        this.toas.error("Error al consultar la citas.");
        this.spinner = false
      }
    );
  }

  modificaCita(id_cita:number):any{
    this.modifica_cita=true;
    this.ms.showModificaCita(id_cita);
  }
  reload(){
    this.getAllCitas();
  }
}
