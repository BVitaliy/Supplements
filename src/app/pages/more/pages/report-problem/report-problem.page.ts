import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.page.html',
  styleUrls: ['./report-problem.page.scss'],
})
export class ReportProblemPage {
  public form!: FormGroup;
  loading = false;

  constructor(
    public navCtrl: NavController,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.form = new FormGroup({
      theme: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });
  }

  public handleSaveChanges(): void {
    this.loading = true;
    console.log('form', this.form.value);
    this.profileService
      .sendReport(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.form.reset();
          this.alertService.createToast({
            header: 'Report sent successfully!',
            mode: 'ios',
            position: 'bottom',
          });
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
}
