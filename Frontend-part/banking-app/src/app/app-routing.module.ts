import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AccountActivityComponent } from './components/account-activity/account-activity.component';
import { ChangeLoginPasswordComponent } from './components/change-login-password/change-login-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeTransferPasswordComponent } from './components/change-transfer-password/change-transfer-password.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HomeComponent } from './components/home/home.component';
import { InvestorsComponent } from './components/investors/investors.component';
import { SuccessLoginComponent } from './components/success-login/success-login.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { AuthenticationGuard } from './guard/authentication.guard';


const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"home",component:HomeComponent},
  {path:"sucess/:cust_id/:pass",component:SuccessLoginComponent,canActivate:[AuthenticationGuard],children:[
    {path:"",component:AccountActivityComponent},
    {path:"account-activity",component:AccountActivityComponent},
    {path:"transfer",component:TransfersComponent},
    {path:"change-password",component:ChangePasswordComponent,children:[
      {path:"",component:ChangeLoginPasswordComponent},
      {path:"change-login-password",component:ChangeLoginPasswordComponent},
      {path:"change-transfer-password",component:ChangeTransferPasswordComponent}
    ]}
  ]},
  {path:"investor",component:InvestorsComponent},
  {path:"about-us",component:AboutUsComponent},
  {path:"contact-us",component:ContactUsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
