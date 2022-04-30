import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { TransactionService } from 'src/app/service/transaction.service';


@Component({
  selector: 'app-account-activity',
  templateUrl: './account-activity.component.html',
  styleUrls: ['./account-activity.component.css']
})
export class AccountActivityComponent implements OnInit {

  transaction_send:undefined | any =undefined;
  transaction_receive:undefined | any =undefined;
  constructor(private _transaction_service:TransactionService, private _acc_service:AccountService, private _activted_rout:ActivatedRoute) { }

  ngOnInit(): void {
    this._activted_rout.parent?.params.subscribe({
      next:(params:Params)=>{
        console.log(params['cust_id'])
        this._acc_service.getAccount(params['cust_id']).subscribe({
          next:(data)=>{

            this._transaction_service.getTransaction_sender(data._id).subscribe({
              next:(data)=>this.transaction_send=data
            })
            this._transaction_service.getTransaction_receiver(data._id).subscribe({
              next:(data)=>this.transaction_receive=data
            })
          }
        });
      }
    })
  }

}
