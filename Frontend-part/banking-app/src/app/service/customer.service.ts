import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _http:HttpClient) { }
  baseUrl="http://localhost:3002"

  public getCustomer():Observable<any>{
    return this._http.get(`${this.baseUrl}/customer`)
  }

  public login(cust_id:number,pass:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/${pass}`;
    return this._http.get(url)
  }

  public updateLoginPass(cust_id:number,new_pass:any,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/change_pass/${new_pass}`;
    return this._http.put(url,data)
  }
}
