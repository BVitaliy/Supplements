import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoverPasswordPageRoutingModule } from './recover-password-routing.module';

import { RecoverPasswordPage } from './recover-password.page';
import { SharedModule } from '../../../../shared/shared.module';
// import { CountdownModule } from 'ngx-countdown';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoverPasswordPageRoutingModule,
    ReactiveFormsModule,
    // CountdownModule,
    NgOtpInputModule,
    SharedModule,
  ],
  declarations: [RecoverPasswordPage],
})
export class RecoverPasswordPageModule {}
