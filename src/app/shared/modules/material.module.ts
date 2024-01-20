import { Injectable, NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';

import {
  MatRippleModule,
  MatNativeDateModule,
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Injectable()
class MyDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    ClipboardModule,
    DragDropModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MyDateAdapter },
  ],
})
export class MaterialModule {}
