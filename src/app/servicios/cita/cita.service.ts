import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  constructor(
    private http:HttpClient
  ) { }

  generaCita(form:any):Observable<any>{
    
    let data = {
      "id_cliente":localStorage.getItem("id_cliente"),
      "id_horario_cita": form.value.hora_cita,
      "nombre": form.value.nombre,
      "apellido_p": form.value.apellido_p,
      "apellido_m": form.value.apellido_m,
      "whatsapp": form.value.whatsapp,
      "email": form.value.email,
      "pais_destino": form.value.pais_viaje,
      "fecha_viaje": form.value.fecha_viaje
    }

    let url = environment.url_api + "cita/generaCita"
    return this.http.post(url,data)

  }

  actualizaCita(id_cita:number,form:any):Observable<any>{
    
    let data = {
      "id_cita":id_cita.toString(),
      "id_horario_cita": form.value.hora_cita,
      "nombre": form.value.nombre,
      "apellido_p": form.value.apellido_p,
      "apellido_m": form.value.apellido_m,
      "whatsapp": form.value.whatsapp,
      "email": form.value.email,
      "pais_destino": form.value.pais_viaje,
      "fecha_viaje": form.value.fecha_viaje,
      "cancelar_cita":form.value.cancelar_cita
    }

    let url = environment.url_api + "cita/actualizaCita"
    return this.http.put(url,data)

  }

  getCitas(email:string,solo_activas:boolean,num_page:number):Observable<any>{

    let url = environment.url_api + "cita/getCitas?email="+email;
    url = url + "&solo_activas=" + solo_activas;    
    url = url + "&num_page=" + num_page.toString();
    return this.http.get(url);

  }

  getAllCitas(fecha:string,solo_activas:boolean,num_page:number):Observable<any>{
    let url = environment.url_api + "cita/getAllCitas?fecha="+fecha;
    url = url + "&solo_activas=" + solo_activas;    
    url = url + "&num_page=" + num_page.toString();
    return this.http.get(url);
  }

  consultaCita(id_cita:number):Observable<any>{
    let url = environment.url_api + "cita/consultaCita?id_cita="+id_cita.toString();

    return this.http.get(url)
  }
}
