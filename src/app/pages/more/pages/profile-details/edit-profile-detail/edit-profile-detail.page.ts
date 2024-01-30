import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ProfileDetailsFields, ProfileGenders } from '../profile-details.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-profile-detail',
  templateUrl: './edit-profile-detail.page.html',
  styleUrls: ['./edit-profile-detail.page.scss'],
})
export class EditProfileDetailPage implements OnInit {
  public formGroup!: FormGroup;
  public profileDetailsFields: typeof ProfileDetailsFields = ProfileDetailsFields;
  public profileGenders: typeof ProfileGenders = ProfileGenders;
  public fieldTitle?: ProfileDetailsFields;
  public fieldValue?: string;
  public formattedDate!: string | undefined;
  constructor(public modalCtrl: ModalController, private datePipe: DatePipe) { }

  public ngOnInit(): void {
    switch (this.fieldTitle) {
      case ProfileDetailsFields.firstName: {
        this.formGroup = new FormGroup({
          firstName: new FormControl(this.fieldValue, [
            Validators.required,
          ]),
        });
        break;
      }
      case ProfileDetailsFields.lastName: {
        this.formGroup = new FormGroup({
          lastName: new FormControl(this.fieldValue, [
            Validators.required,
          ]),
        });
        break;
      }
      case ProfileDetailsFields.emailAddress: {
        this.formGroup = new FormGroup({
          email: new FormControl(this.fieldValue, [
            Validators.required,
            Validators.email,
          ]),
        });
        break;
      }
      case ProfileDetailsFields.sex: {
        this.formGroup = new FormGroup({
          sex: new FormControl(this.fieldValue, [
            Validators.required,
          ]),
        });
        break;
      }
      case ProfileDetailsFields.birthday: {
        this.formGroup = new FormGroup({
          birthday: new FormControl(this.fieldValue, [
            Validators.required,
          ]),
        });
        this.formattedDate = this.fieldValue;
        break;
      }
    }
  }

  public handleAction(): void {
    let newValue;
    switch (this.fieldTitle) {
      case ProfileDetailsFields.firstName: {
        newValue = this.formGroup.get('firstName')?.value;
        break;
      }
      case ProfileDetailsFields.lastName: {
        newValue = this.formGroup.get('lastName')?.value;
        break;
      }
      case ProfileDetailsFields.emailAddress: {
        newValue = this.formGroup.get('email')?.value;
        break;
      }
      case ProfileDetailsFields.sex: {
        newValue = this.formGroup.get('sex')?.value;
        break;
      }
      case ProfileDetailsFields.birthday: {
        newValue = this.formattedDate;
        break;
      }
    }
    this.modalCtrl.dismiss({
      fieldTitle: this.fieldTitle,
      fieldNewValue: newValue,
    });
  }

  public setFormattedBirth(event: any): void {
    this.formGroup
      .get('birthday')!
      .setValue(new Date(event?.detail?.value).toISOString());
    this.formattedDate = this.datePipe.transform(
      new Date(event?.detail?.value),
      'dd/MM/yyyy'
    ) || undefined;
  }

  public handleChangeSexValue(sex: ProfileGenders): void {
    this.formGroup.get('sex')?.setValue(sex);
  }
}
