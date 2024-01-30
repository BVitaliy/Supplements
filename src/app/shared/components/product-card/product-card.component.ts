import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AddFavoriteListProductPage } from '../../../pages/favorites/add-favorite-list-product/add-favorite-list-product.page';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() type = 'vertical'; //horizontal
  @Input() product: any;
  @Input() showStars: boolean = true;
  @Input() showRatingCount: boolean = true;
  @Input() showFavoriteBtn: boolean = true;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  favoriteHandle($event: any) {
    console.log($event);
    this.showListActionsModal();
  }

  public async showListActionsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: AddFavoriteListProductPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.8,
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        console.log('selectedListsIds', data.data.selectedListsIds);
        // add product to favorite list
      }
    });
    return await modal.present();
  }
}
