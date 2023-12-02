import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http:HttpClient
  ) { }


  post(url:string,data:any):Observable<any>{

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(environment.url_api + url,data,{headers:headers});
  }

  get(url:string):Observable<any>{
    return this.http.get(url);
  }
}
