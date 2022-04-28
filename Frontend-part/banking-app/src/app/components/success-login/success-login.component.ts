import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-success-login',
  templateUrl: './success-login.component.html',
  styleUrls: ['./success-login.component.css']
})
export class SuccessLoginComponent implements OnInit {

  constructor(private _builder: FormBuilder, 
    private _service: CustomerService, 
    private _router: Router) { }

    loginForm : FormGroup = this._builder.group({
      _id: [], password: []
    });
    errorMessage : string | undefined = undefined;
  

  ngOnInit(): void {}
 
  handleSubmit() {
    let cust_id = this.loginForm.controls['_id'].value;
    let pass = this.loginForm.controls['password'].value;
    this._service.login(cust_id, pass).subscribe({
      next: (data) => {
        this._router.navigate(['account-activity', data._id])
      }, 
      error: (err) => {
        this.errorMessage = err.error.message;
        this.loginForm.reset({});
      }
    });
  }
}
