import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.page.html',
  styleUrls: ['./report-problem.page.scss'],
})
export class ReportProblemPage {
  public form!: FormGroup;

  constructor(public navCtrl: NavController) {}

  public ngOnInit(): void {
    this.form = new FormGroup(
      {
        problemTheme: new FormControl(null, [
          Validators.required,
        ]),
        problemDescription: new FormControl(null, [
          Validators.required,
        ]),
      },
    );
  }

  public handleSaveChanges(): void {
    // save changes
  }
}
