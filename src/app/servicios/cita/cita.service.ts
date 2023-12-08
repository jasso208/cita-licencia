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
    
    console.log(form);
    
    let data = {
      "id_cliente":localStorage.getItem("id_cliente"),
      "id_horario_cita": form.value.hora_cita,
      "nombre": form.value.hora_cita,
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
}
