import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _builder: FormBuilder, 
    private _service: CustomerService, 
    private _router: Router) { }

    loginForm : FormGroup = this._builder.group({
      _id: ['',Validators.required], password: ['',Validators.required]
    });
    errorMessage : string | undefined = undefined;
  
  ngOnInit(): void {
    this._service.ngOnInit()
  }
 
  handleSubmit() {
    let cust_id = this.loginForm.controls['_id'].value;
    let pass = this.loginForm.controls['password'].value;
    this._service.login(cust_id, pass).subscribe({
      next: (data) => {
        this._router.navigate(['sucess', data._id,data.password])
      }, 
      error: (err) => {
        alert(err.error.message)
        //this.errorMessage = err.error.message;
        this.loginForm.reset({});
      }
    });
  }
}
