import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule, ClrIconModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { LoginComponent } from './componentes/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule, 
    BrowserAnimationsModule, 
    ClarityModule,
    ClrIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
