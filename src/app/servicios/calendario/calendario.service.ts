import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(
    private http:HttpClient
  ) { }

  diasMes(month:number,year:number):Observable<any>{
    let data = {
      month: month,
      year: year     
    }   
    let url = environment.url_api + "calendario/cargaDiasMes";
    return this.http.post(url,data);    
  }


  horariosDisponible(fecha:string):Observable<any>{
    let url =  environment.url_api + "calendario/horariosLibres";
    url = url + "?fecha=" + fecha;

    return this.http.get(url);

  }

}
