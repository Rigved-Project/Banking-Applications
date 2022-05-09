import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { TransactionService } from 'src/app/service/transaction.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {

  Last_Tran_Id:undefined | any=undefined
  Account_data:undefined | any=undefined
  formValue:undefined | any=undefined
  Tran_data:undefined | any=undefined

  constructor(private _activated_route:ActivatedRoute,private _account_service:AccountService,private _transaction_service:TransactionService, private _builder:FormBuilder, private _route:Router) { }

  ngOnInit(): void {
    this._transaction_service.getTransaction().subscribe({
      next:(data)=>{
        //console.log(data)
        let a=data
        let b=data[a.length-1]._id
        this.Last_Tran_Id=b
      }
    })
    this._activated_route.parent?.params.subscribe({
      next:(params:Params)=>{
        this._account_service.getAccount(params['cust_id']).subscribe({
          next:(data)=>{
            //console.log(data)
            this.Account_data=data
          }
        })

      }
    })
  }
  FormValue:FormGroup=this._builder.group({
    account_num_receiver:['',Validators.required],
    name:[''],
    IFSC:['',Validators.required],
    send_amount:['',Validators.compose([
      Validators.min(500),Validators.max(10000),Validators.required
    ])]
  })

  handleTransfer(){
    this.formValue=this.FormValue.value
    //console.log(this.formValue)
    
  }

  errorMessage:undefined | any = undefined

  password=new FormControl('',Validators.required)

  handleSubmit(){
    this._activated_route.parent?.params.subscribe({
      next:(params:Params)=>{
        this._account_service.getTransPass(params['cust_id'],this.password.value).subscribe({
          next:(data)=>{
            //console.log(data)
            this._transaction_service.postTransaction(this.Last_Tran_Id,this.Account_data._id,this.formValue).subscribe({
              next:(data)=>console.log(data)
            })
            this._transaction_service.getTransaction().subscribe({
              next:(data)=>{
                //console.log(data)
                let a=data
                let b=data[a.length-1]._id
                this.Last_Tran_Id=b
              }
            });
            this._account_service.updateAccountBalSender(params['cust_id'],this.Account_data._id,this.formValue.send_amount,undefined).subscribe({
              next:(data)=>{
                console.log(data)
              }
            })
            this._account_service.updateAccountBalReceiver(this.formValue.account_num_receiver,this.formValue.IFSC,this.formValue.send_amount,undefined).subscribe({
              next:(data)=>{
                console.log(data)
              }
            })
            this._route.navigate(['sucess',params['cust_id'],params['pass']])
          },
          error:(err)=>{
            this.errorMessage=err.error.message
          }
        })
        
      }
    })
  }
}
