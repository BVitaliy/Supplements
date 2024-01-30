import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportProblemPageRoutingModule } from './report-problem-routing.module';
import { ReportProblemPage } from './report-problem.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReportProblemPageRoutingModule,
        ReactiveFormsModule,
    ],
  declarations: [ReportProblemPage],
})
export class ReportProblemPageModule {}
