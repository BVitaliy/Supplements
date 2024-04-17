import { Component, OnInit } from '@angular/core';
import { ManageFavoriteListModes } from './manage-favorite-list.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-manage-favorite-list',
  templateUrl: './manage-favorite-list.page.html',
  styleUrls: ['./manage-favorite-list.page.scss'],
})
export class ManageFavoriteListPage implements OnInit {
  public mode?: ManageFavoriteListModes;
  public titleText?: string;
  public buttonText?: string;
  public name?: string;
  public description?: string;
  public formGroup!: FormGroup;
  public data!: any;

  constructor(public modalCtrl: ModalController) {}

  public ngOnInit(): void {
    console.log(this.data);
    this.formGroup = new FormGroup({
      name: new FormControl(this.name, [Validators.required]),
      description: new FormControl(this.description, [Validators.required]),
    });
  }

  public handleAction(): void {
    this.modalCtrl.dismiss({
      name: this.formGroup.get('name')?.value,
      description: this.formGroup.get('description')?.value,
      mode: this.mode,
    });
  }
}
