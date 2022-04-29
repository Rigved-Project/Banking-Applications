import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private  _http:HttpClient) { }
  baseUrl='http://localhost:3002'

  public getTransaction_sender(account_id_sender:number):Observable<any>{
    let url=`${this.baseUrl}/customer/cust_id/transaction/${account_id_sender}`;
    return this._http.get(url)
  }

  public getTransaction_receiver(account_id_receiver:number):Observable<any>{
    let url=`${this.baseUrl}/customer/cust_id/transaction/account_receiver/${account_id_receiver}`;
    return this._http.get(url)
  }

  public updatePassTrans(cust_id:number,old_pass:any,new_pass:any,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/transaction/${old_pass}/change_pass/${new_pass}`;
    return this._http.put(url,data)
  }

  public updatePasslogin(cust_id:number,old_pass:any,new_pass:any,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/${old_pass}/change_pass/${new_pass}`;
    return this._http.put(url,data)
  }
}