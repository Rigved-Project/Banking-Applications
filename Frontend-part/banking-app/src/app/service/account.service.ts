import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _http:HttpClient) { }
  baseUrl="http://localhost:3002"

  public getAccount(cust_id:number):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}`;
    return this._http.get(url)
  }

  public updateTransPass(cust_id:number,trans_pass:any,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/${trans_pass}`;
    return this._http.put(url,data)
  }
}
