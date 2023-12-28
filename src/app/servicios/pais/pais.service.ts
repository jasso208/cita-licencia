import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(
    private http:HttpClient
  ) { }

  getAllPaises():Observable<any>{
    let url = environment.url_api;
    return this.http.get( url + "pais/getAllPais");
  }
}
