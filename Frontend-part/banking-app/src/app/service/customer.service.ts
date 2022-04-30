import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   
   
  constructor(private  _http:HttpClient) { }
  baseUrl = "http://localhost:3002"

   cust_data:any=[]
   ngOnInit(): void {
     //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
     //Add 'implements OnInit' to the class.
     this.getCustomer().subscribe({
       next:(data)=>this.cust_data=data
     })
   }
   public getCustomer():Observable<any>{
    return this._http.get(`${this.baseUrl}/customer`)
  }


  
  //Customer login
  public login(cust_id: number, pass: any) : Observable<any> {
    let url = `${this.baseUrl}/customer/${cust_id}/${pass}`;
    return this._http.get(url)
  } 
  public updateLoginPass(cust_id:number,new_pass:any,data:any):Observable<any>{
    let url=`${this.baseUrl}/customer/${cust_id}/change_pass/${new_pass}`;
    return this._http.put(url,data)
  }
}



