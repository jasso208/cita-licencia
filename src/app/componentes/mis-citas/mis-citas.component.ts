import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
 styleUrls: ['./mis-citas.component.css'],
 providers:[DatePipe]
})
export class MisCitasComponent {

  public show:boolean;
  public spinner:boolean;
  public citas:any;
  public form:FormGroup;
  private solo_activas:boolean;
  public total_page:number;
  public form_page:FormGroup;
  public pagination:any;
  public existen_citas:boolean;

  constructor(
    private ms:EmmiterService,
    private cita:CitaService,
    private toas:ToastrService,
    private datep: DatePipe,
    private fb:FormBuilder
    
  ){
      this.show = false;
      this.spinner = false;
      this.total_page = 1;
      this.existen_citas = false;
      this.form = this.fb.group(
        {
          solo_activas:new FormControl(true)
        }
      );

      this.form_page = this.fb.group(
        {
          num_page:new FormControl(1)
        }
      );

      this.ms.$mis_citas.subscribe(
        () =>{
          this.form_page.get("num_page")?.setValue(1);
          this.showMisCitas();
        }
      );
  }

  showMisCitas(){

    let today = new Date();
    let t = this.datep.transform(today,'YYYY-mm-dd');
    this.form.get("solo_activas")?.setValue(true);
    this.solo_activas=false;
    this.show = true;
    //this.getCitas();
    this.soloActivas();
  }

  soloActivas():any{
    this.solo_activas = !this.solo_activas;
    this.getCitas();
  }

  lastPagina():any{
    let total_page = this.pagination.total_pages;
    this.form_page.get("num_page")?.setValue(total_page);
    this.getCitas();
  }
  firstPagina():any{
    
    this.form_page.get("num_page")?.setValue(1);
    this.getCitas();
  }
  nextPagina():any{
    let total_page = this.pagination.total_pages;
    let num_page = this.form_page.get("num_page")?.value;

    num_page = num_page + 1;
    
    this.form_page.get("num_page")?.setValue(num_page);

    if(num_page > total_page){
      this.form_page.get("num_page")?.setValue(total_page);
    }
    this.getCitas();
  }

  backPagina():any{
    let total_page = this.pagination.total_pages;
    let num_page = this.form_page.get("num_page")?.value;

    num_page = num_page - 1;
    
    this.form_page.get("num_page")?.setValue(num_page);

    if(num_page <= 0){
      this.form_page.get("num_page")?.setValue(1);
    }
    this.getCitas();
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

  getCitas():any{
    this.existen_citas=false;
    this.citas = undefined;
    this.spinner = true;
    let email = localStorage.getItem("email");
    let num_page = this.form_page.get("num_page")?.value;
    //let solo_activas = this.form.get("solo_activas")?.value;
    if(num_page == undefined){
      num_page = 1;
    }
  
    this.cita.getCitas(email,this.solo_activas,num_page)
    .subscribe(
      data => {
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
    this.ms.showModificaCita(id_cita);
  }
  reload(){
    this.getCitas();
  }

}
