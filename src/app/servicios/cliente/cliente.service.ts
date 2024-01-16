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

  actualizaCliente(form:any,id_cita:number = 0):Observable<any>{
    let data = {
      "id_cita":id_cita,
      "id_cliente":localStorage.getItem("id_cliente"),      
      "nombre": form.value.nombre,
      "apellido_p": form.value.apellido_p,
      "apellido_m": form.value.apellido_m,
      "whatsapp": form.value.whatsapp,
      "email": form.value.email,
      "pais_destino": form.value.pais_viaje,
      "fecha_viaje": form.value.fecha_viaje,
      "codigo_pais":form.value.codigo_pais
    }

    console.log(data);
    let url = environment.url_api + "cliente/actualizaCliente";

    return this.http.put(url,data);

  }

  validaClienteAdmin():Observable<any>{
    let id_cliente = localStorage.getItem("id_cliente");
    let url = environment.url_api + "cliente/validaClienteAdmin?id_cliente=" + id_cliente;
    return this.http.get(url);
  }

  validaPerfilSession():Observable<any>{
    let id_cliente = localStorage.getItem("id_cliente");
    let session = localStorage.getItem("session");
    
    let url = environment.url_api + "cliente/validaPerfilSession?id_cliente=" + id_cliente + "&session=" + session;
    return this.http.get(url);

  }
}
