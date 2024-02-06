import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IngredientDetailModalComponent } from '../ingredient-detail-modal/ingredient-detail-modal.component';

@Component({
  selector: 'app-ingredient-modal',
  templateUrl: './ingredient-modal.component.html',
  styleUrls: ['./ingredient-modal.component.scss'],
})
export class IngredientModalComponent implements OnInit {
  @Input() product: any;
  @Input() indregientsDetail: any;
  backBtnSubscription!: Subscription;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log(this.indregientsDetail);
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

    await this.modalController.dismiss();
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  // Відкривання модалки ingredient detail
  async openIngredientModal(title: string) {
    const modal = await this.modalController.create({
      component: IngredientDetailModalComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      handle: true,
      componentProps: {
        title,
        indregientDetail: this.indregientsDetail,
      },
    });

    // modal.onDidDismiss().then((returnedData: any) => {
    //   if (returnedData && returnedData?.data) {

    //   }
    // });

    return await modal.present();
  }
}
