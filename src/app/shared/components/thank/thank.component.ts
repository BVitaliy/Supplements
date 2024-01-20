import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thank',
  templateUrl: './thank.component.html',
  styleUrls: ['./thank.component.scss'],
})
export class ThankComponent implements OnInit {
  @Input() imgSrc!: string;
  @Input() title!: string;
  @Input() buttonRouterUrl!: string;
  @Input() buttonText!: string;
  @Input() hasCloseBtn!: string;
  backBtnSubscription!: Subscription;

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform
    ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(9995, () => {
      this.cancelModal();
    });
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
    };
  }
}
