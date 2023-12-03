import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private http:HttpClient
  ) { }

  actualizaCliente(form:any):Observable<any>{
    let data = {
      "id_cliente":localStorage.getItem("id_cliente"),      
      "nombre": form.value.nombre,
      "apellido_p": form.value.apellido_p,
      "apellido_m": form.value.apellido_m,
      "whatsapp": form.value.whatsapp,
      "email": form.value.email,
      "pais_destino": form.value.pais_viaje,
      "fecha_viaje": form.value.fecha_viaje
    }

    let url = environment.url_api + "cliente/actualizaCliente";

    return this.http.put(url,data);

  }
}
