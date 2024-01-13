import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from 'src/app/servicios/cita/cita.service';
import { EmmiterService } from 'src/app/servicios/emmiter.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit{
  public show:boolean;
  public spinner:boolean;

  constructor(
    private ms:EmmiterService,
    private cita:CitaService,
    private toas:ToastrService,
    private fb:FormBuilder
    
  ){
      this.show = false;
     
  }

  ngOnInit(): void {
    this.ms.$menu_admin.subscribe(
      () =>{
        
        this.show = true;
      }
    );
  }

  showCitasAdmin():void{
    this.ms.showCitasAdmin();
  }
  
}
