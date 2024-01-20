import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysPipe } from './pipes/keys.pipe';
import { PinCodeComponent } from './components/pin-code/pin-code.component';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PinCodeComponent,
    KeysPipe,
    NumberOnlyDirective
  ],
  exports: [PinCodeComponent],
  providers: [KeysPipe]
})
export class PinCodeModule { }
