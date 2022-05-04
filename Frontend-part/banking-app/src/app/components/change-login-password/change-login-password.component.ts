import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  password=new FormControl('',Validators.required)
  again_pass=new FormControl('',Validators.required)
  handleUpdate(){
    if(this.password.value==this.again_pass.value){
      this._actived_rout.parent?.parent?.params.subscribe({
        next:(params:Params)=>{
          this._customer_service.updateLoginPass(params['cust_id'],this.password.value,undefined).subscribe({
            next:(data)=>{console.log(data)
              //this.modifiedCount=data.modifiedCount
            }
          });
          let pass={pass:params['pass']}
          this._transaction_service.updatePasslogin(params['cust_id'],this.password.value,pass).subscribe({
            next:(data)=>console.log(data)
          })
          
          
          this._rout.navigate(['/home'])
        }
      })

    } else{
      
      alert('password is not match')
    }
  }

}


