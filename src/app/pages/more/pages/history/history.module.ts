import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HistoryPageRoutingModule } from './history-routing.module';
import { HistoryPage } from './history.page';
import { SharedModule } from '../../../../shared/shared.module';
import { ReviewedListPageModule } from './reviewed-list/reviewed-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    SharedModule,
    ReviewedListPageModule,
  ],
  declarations: [HistoryPage],
})
export class HistoryPageModule {}
