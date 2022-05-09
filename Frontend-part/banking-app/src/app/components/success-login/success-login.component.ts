import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-success-login',
  templateUrl: './success-login.component.html',
  styleUrls: ['./success-login.component.css']
})
export class SuccessLoginComponent implements OnInit {
  account:undefined | any=undefined;
  customer:undefined | any=undefined;
  cust_err:undefined |any=undefined;
  acc_err:undefined | any=undefined;
  // cust_id:undefined | any=undefined;
  // pass:undefined | any=undefined;
  constructor(private _cust_service:CustomerService, private _account_service:AccountService, private _activated_rout:ActivatedRoute) { }

    ngOnInit(): void {
    this._activated_rout.params.subscribe((params:Params)=>{
      // this.cust_id=params['cust_id'];
      // this.pass=params['pass'];
      this._cust_service.getCust(params['cust_id']).subscribe({
        next:(data)=>this.customer=data,
        error:(err)=>this.cust_err=err
      })
      this._account_service.getAccount(params['cust_id']).subscribe({
        next:(data)=>this.account=data,
        error:(err)=>this.acc_err=err
      })

      
    })
  }

  handleRefresh(){
    this._activated_rout.params.subscribe((params:Params)=>{
      // this.cust_id=params['cust_id'];
      // this.pass=params['pass'];
      
      this._account_service.getAccount(params['cust_id']).subscribe({
        next:(data)=>this.account=data,
        error:(err)=>this.acc_err=err
      })

      
    })
  }

  //url="https://cdn.i.haymarketmedia.asia/?n=campaign-india%2fcontent%2fjayeshullatil.jpg&h=570&w=855&q=100&v=20170226&c=1"
  url="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
  onselectFile(e: any){
    console.log(e.target.files)
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }
 
}
