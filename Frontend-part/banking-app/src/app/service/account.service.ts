import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  public getTransPass(cust_id:number,tran_pass:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/pass/transaction/${tran_pass}`;
    return this._http.get(url)
  }

  public updateAccountBalSender(cust_id:number,account_no_sender:number,balance:number,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/${account_no_sender}/reduce_balance/${balance}`;
    return this._http.put(url,data)
  }

  public updateAccountBalReceiver(account_no_receiver:number,ifsc:any,balance:number,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${account_no_receiver}/${ifsc}/increase_balance/${balance}`;
    return this._http.put(url,data)
  }
}
