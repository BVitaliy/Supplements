import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss'],
})
export class DoneComponent implements OnInit {
  @Input() imgSrc!: string;
  @Input() buttonRouterUrl!: string;
  backBtnSubscription!: Subscription;

  constructor(
    private navCtrl: NavController,
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
    setTimeout(() => {
      this.redirect();
    }, 4000);
  }

  async cancelModal() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    const onClosedData = null;
    await this.modalController.dismiss(onClosedData);
  }

  redirect(): void {
    this.navCtrl.navigateForward([this.buttonRouterUrl]);
    this.cancelModal();
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }
}
