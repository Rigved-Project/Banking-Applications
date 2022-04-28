import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   baseURL = "http://localhost:3002/customer"
  constructor(private  _http:HttpClient) { }

  //Customer login
  public login(cust_id: number, pass: string) : Observable<any> {
    let url = `${this.baseURL}/${cust_id}/${pass}`;
    return this._http.get(url);
  } 
  
}



