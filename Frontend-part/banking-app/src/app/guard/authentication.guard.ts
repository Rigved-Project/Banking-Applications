import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from '../components/home/home.component';
import { CustomerService } from '../service/customer.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private _cust_service:CustomerService,private _router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
       
       this._cust_service.ngOnInit();
       let arr=this._cust_service.cust_data;
       //console.log(arr)
       let name=route.paramMap.get('name');
       let password=route.paramMap.get('pass')
       
       for(let i = 0; i<arr.length; i++){
         //console.log(state);
         if(name==arr[i].name && password==arr[i].password){
           return true;           
         }
       }
       alert('Please enter Id or Password in login Form');
         this._router.navigate(['/home']);
         return false;
  }
  
}
