import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { InvestorsComponent } from './components/investors/investors.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AccountActivityComponent } from './components/account-activity/account-activity.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeLoginPasswordComponent } from './components/change-login-password/change-login-password.component';
import { ChangeTransferPasswordComponent } from './components/change-transfer-password/change-transfer-password.component';
import { SuccessLoginComponent } from './components/success-login/success-login.component';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InvestorsComponent,
    AboutUsComponent,
    ContactUsComponent,
    AccountActivityComponent,
    TransfersComponent,
    ChangePasswordComponent,
    ChangeLoginPasswordComponent,
    ChangeTransferPasswordComponent,
    SuccessLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
