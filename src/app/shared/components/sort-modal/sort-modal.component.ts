import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: ['./sort-modal.component.scss'],
})
export class SortModalComponent implements OnInit {
  @Input() sort!: string;
  public sortForm!: FormGroup;
  backBtnSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log(this.sort);
    this.sortForm = new FormGroup({
      sort: new FormControl(this.sort || 'average_rating'),
    });
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
  }

  async cancelModal() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    const onClosedData = this.sortForm.value?.sort || null;
    await this.modalController.dismiss(onClosedData);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  sortFn($event: any) {
    this.cancelModal();
  }
}
