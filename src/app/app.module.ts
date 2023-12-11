import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule, ClrIconModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { LoginComponent } from './componentes/login/login.component';
import { NuevaCitaComponent } from './componentes/nueva-cita/nueva-cita.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ValidaWhatsappComponent } from './componentes/valida-whatsapp/valida-whatsapp.component';
import { MisCitasComponent } from './componentes/mis-citas/mis-citas.component';
import { ModificaCitaComponent } from './componentes/modifica-cita/modifica-cita.component';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    LoginComponent,
    NuevaCitaComponent,
    ValidaWhatsappComponent,
    MisCitasComponent,
    ModificaCitaComponent,
    BienvenidoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule, 
    BrowserAnimationsModule, 
    ClarityModule,
    ClrIconModule,
    ReactiveFormsModule,
    HttpClientModule,    
	  ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
