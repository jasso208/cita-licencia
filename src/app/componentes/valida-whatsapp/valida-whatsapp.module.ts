import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidaWhatsappRoutingModule } from './valida-whatsapp-routing.module';
import { ValidaWhatsappComponent } from './valida-whatsapp.component';


@NgModule({
  declarations: [
    ValidaWhatsappComponent
  ],
  imports: [
    CommonModule,
    ValidaWhatsappRoutingModule
  ]
})
export class ValidaWhatsappModule { }
