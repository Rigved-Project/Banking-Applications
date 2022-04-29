import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { TransactionService } from 'src/app/service/transaction.service';

@Component({
  selector: 'app-change-transfer-password',
  templateUrl: './change-transfer-password.component.html',
  styleUrls: ['./change-transfer-password.component.css']
})
export class ChangeTransferPasswordComponent implements OnInit {
  account:undefined | any=undefined
  modifiedCount:undefined| any=undefined
  constructor(private _actived_rout:ActivatedRoute, private _account_service:AccountService,private _transaction_service:TransactionService) { }

  ngOnInit(): void {
    this._actived_rout.parent?.parent?.params.subscribe({
      next:(params:Params)=>{
        this._account_service.getAccount(params['cust_id']).subscribe({
          next:(data)=>{
            //console.log(data)
            this.account=data
          }
        })
      }
    })
  }

  password=new FormControl('')
  handleUpdate(){
    this._actived_rout.parent?.parent?.params.subscribe({
      next:(params:Params)=>{
        this._account_service.updateTransPass(params['cust_id'],this.password.value,undefined).subscribe({
          next:(data)=>{console.log(data)
            this.modifiedCount=data.modifiedCount
          }
        });
        this._transaction_service.updatePassTrans(params['cust_id'],this.account.password,this.password.value,undefined).subscribe({
          next:(data)=>console.log(data)
        })
        this._account_service.getAccount(params['cust_id']).subscribe({
          next:(data)=>{
            //console.log(data)
            this.account=data
          }
        })
      }
    })
  }

}
