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
  public listName?: string;
  public listDescription?: string;
  public formGroup!: FormGroup;

  constructor(public modalCtrl: ModalController) { }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      listName: new FormControl(this.listName, [
        Validators.required,
      ]),
      listDescription: new FormControl(this.listDescription, [
        Validators.required,
      ]),
    });
  }

  public handleAction(): void {
    this.modalCtrl.dismiss({
      listName: this.formGroup.get('listName')?.value,
      listDescription: this.formGroup.get('listDescription')?.value,
      mode: this.mode,
    });
  }
}
