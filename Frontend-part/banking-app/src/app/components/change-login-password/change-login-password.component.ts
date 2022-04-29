import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomerService } from 'src/app/service/customer.service';
import { TransactionService } from 'src/app/service/transaction.service';

@Component({
  selector: 'app-change-login-password',
  templateUrl: './change-login-password.component.html',
  styleUrls: ['./change-login-password.component.css']
})
export class ChangeLoginPasswordComponent implements OnInit {

  modifiedCount:undefined| any=undefined
  constructor(private _actived_rout:ActivatedRoute, private _customer_service:CustomerService,private _transaction_service:TransactionService, private _rout:Router) { }

  ngOnInit(): void {
    
  }

  password=new FormControl('')
  handleUpdate(){
    this._actived_rout.parent?.parent?.params.subscribe({
      next:(params:Params)=>{
        this._customer_service.updateLoginPass(params['cust_id'],this.password.value,undefined).subscribe({
          next:(data)=>{console.log(data)
            this.modifiedCount=data.modifiedCount
          }
        });
        this._transaction_service.updatePasslogin(params['cust_id'],params['pass'],this.password.value,undefined).subscribe({
          next:(data)=>console.log(data)
        })
        
        
      }
    })
    this._rout.navigate(['/home'])
  }

}
