import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  @Input() isLoading: any = false;
  @Input() detailDisabled: any = false;
  @Input() product: any;
  @Input() showStars: boolean = true;
  @Input() showRatingCount: boolean = true;
  @Input() showFavoriteBtn: boolean = true;
  @Input() openInModal: boolean = false;
  @Input() favorite: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onOpenEdit: EventEmitter<number> = new EventEmitter<number>();
  @Output() reloadPage: EventEmitter<boolean> = new EventEmitter<boolean>();
  idFavorilteList: any;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private favoriteService: FavoriteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idFavorilteList = this.route.snapshot.paramMap.get('favoriteId');

    if (this.product.supplement) {
      this.product = {
        ...this.product.supplement,
        images: this.product.images,
        title: this.product.title,
        average_rating: 0,
      };
    }
  }

  favoriteHandle($event: any) {
    if (this.product!.in_favorite) {
      if (this.idFavorilteList) {
        this.removeToFavorites(this.idFavorilteList);
      }
    } else {
      this.showListActionsModal();
    }
  }

  public async showListActionsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: AddFavoriteListProductPage,
      cssClass: 'auto-height',
      breakpoints: [0, 0.3, 0.5, 1],
      initialBreakpoint: 1,
      componentProps: {
        product: this.product,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        const ids = data.data.selectedListsIds;
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
    if (!this.detailDisabled) {
      if (this.openInModal) {
        this.openProductInModal();
      } else {
        this.navCtrl.navigateRoot(['/product/detail', this.product?.id]);
      }
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
        id: this.product?.id,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
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
        this.product.in_favorite = true;
        // this.favoritesList = data.results;
      },
      (error: any) => {}
    );
  }

  removeToFavorites(id: any) {
    const data = {
      ids_to_delete: [this.product?.id],
    };
    this.favoriteService.setProductToFavList(data, id).subscribe(
      (data: any) => {
        this.reloadPage.emit(true);
      },
      (error: any) => {}
    );
  }
}
