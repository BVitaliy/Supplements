import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  ProfileDetailsFields,
  ProfileGenders,
} from '../profile-details.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-profile-detail',
  templateUrl: './edit-profile-detail.page.html',
  styleUrls: ['./edit-profile-detail.page.scss'],
})
export class EditProfileDetailPage implements OnInit {
  public formGroup!: FormGroup;
  public profileDetailsFields: typeof ProfileDetailsFields =
    ProfileDetailsFields;
  public profileGenders: typeof ProfileGenders = ProfileGenders;
  public fieldTitle?: ProfileDetailsFields;
  public fieldValue?: string;
  public formattedDate!: string | undefined;
  constructor(public modalCtrl: ModalController, private datePipe: DatePipe) {}

  public ngOnInit(): void {
    switch (this.fieldTitle) {
      case ProfileDetailsFields.first_name: {
        this.formGroup = new FormGroup({
          first_name: new FormControl(this.fieldValue, [Validators.required]),
        });
        break;
      }
      case ProfileDetailsFields.last_name: {
        this.formGroup = new FormGroup({
          last_name: new FormControl(this.fieldValue, [Validators.required]),
        });
        break;
      }
      case ProfileDetailsFields.email: {
        this.formGroup = new FormGroup({
          email: new FormControl(this.fieldValue, [
            Validators.required,
            Validators.email,
          ]),
        });
        break;
      }
      case ProfileDetailsFields.gender: {
        this.formGroup = new FormGroup({
          gender: new FormControl(this.fieldValue, [Validators.required]),
        });
        break;
      }
      case ProfileDetailsFields.date_of_birth: {
        this.formGroup = new FormGroup({
          date_of_birth: new FormControl(this.fieldValue, [
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
    let field = '';
    switch (this.fieldTitle) {
      case ProfileDetailsFields.first_name: {
        newValue = this.formGroup.get('first_name')?.value;
        field = 'first_name';
        break;
      }
      case ProfileDetailsFields.last_name: {
        newValue = this.formGroup.get('last_name')?.value;
        field = 'last_name';
        break;
      }
      case ProfileDetailsFields.email: {
        newValue = this.formGroup.get('email')?.value;
        field = 'email';
        break;
      }
      case ProfileDetailsFields.gender: {
        newValue = this.formGroup.get('gender')?.value;
        field = 'gender';
        break;
      }
      case ProfileDetailsFields.date_of_birth: {
        let date = this.formGroup.get('date_of_birth')?.value;

        if (date && date?.length === 8) {
          const year = date.substring(0, 4);
          const month = date.substring(4, 6);
          const day = date.substring(6, 8);
          newValue = year + '-' + month + '-' + day;
        }
        field = 'date_of_birth';
        break;
      }
    }
    this.modalCtrl.dismiss({
      fieldTitle: field,
      fieldNewValue: newValue,
    });
  }

  public setFormattedBirth(event: any): void {
    this.formGroup
      .get('date_of_birth')!
      .setValue(new Date(event?.detail?.value).toISOString());
    this.formattedDate =
      this.datePipe.transform(new Date(event?.detail?.value), 'yyyy-MM-dd') ||
      undefined;
  }

  public handleChangeSexValue(gender: number): void {
    console.log(gender);
    // let value = 0;
    // if (gender === 'Female') {
    //   value = 1;
    // } else if (gender === 'Other') {
    //   value = 2;
    // } else {
    //   value = 0;
    // }
    this.formGroup.get('gender')?.setValue(gender);
  }
}
