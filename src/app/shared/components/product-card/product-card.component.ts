import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FavoriteService } from 'src/app/pages/favorites/favorites.service';
import { ProductDetailPage } from 'src/app/pages/product-detail/product-detail.page';
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
  @Input() openInModal: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onOpenEdit: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {}

  favoriteHandle($event: any) {
    console.log($event);
    this.showListActionsModal();
  }

  public async showListActionsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: AddFavoriteListProductPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.8,
      componentProps: {
        product: this.product,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        const ids = data.data.selectedListsIds;
        console.log('selectedListsIds', data.data.selectedListsIds);
        if (ids?.length) {
          ids?.forEach((id: any) => {
            this.setToFavorites(id);
          });
        }
        // add product to favorite list
      }
    });
    return await modal.present();
  }

  openDetail() {
    if (this.openInModal) {
      this.openProductInModal();
    } else {
      this.navCtrl.navigateRoot(['/product/detail', this.product?.id]);
    }
  }

  async openProductInModal() {
    const modal = await this.modalController.create({
      component: ProductDetailPage,
      cssClass: '',
      mode: 'ios',
      handle: true,
      componentProps: {
        openedInModal: true,
        id: 1,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        console.log(returnedData);
        this.closeModal.emit(true);
      }
    });

    return await modal.present();
  }

  setToFavorites(id: any) {
    const data = {
      ids_to_add: [this.product?.id],
    };
    this.favoriteService.setProductToFavList(data, id).subscribe(
      (data: any) => {
        console.log(data);
        // this.favoritesList = data.results;
      },
      (error: any) => {}
    );
  }
}
