import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control-popover',
  templateUrl: './control-popover.component.html',
  styleUrls: ['./control-popover.component.scss'],
})
export class ControlPopoverComponent implements OnInit {
  backBtnSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
  }

  async cancelModal(type?: number) {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    await this.modalController.dismiss(type);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }
}
