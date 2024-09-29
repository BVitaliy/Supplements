import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/core/services/alert.service';
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
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.idFavorilteList = this.route.snapshot.paramMap.get('favoriteId');
    console.log(this.product);
    if (this.product.supplement?.id && this.product.status !== 2) {
      this.product = {
        ...this.product.supplement,
        images: this.product.images,
        title: this.product.title,
        average_rating: 0,
      };
    }
    console.log(this.product);
  }

  getStarWidth(starIndex: number): number {
    const score = this.product?.rating_score || 0;
    const fullStars = Math.floor(score);
    const partialStar = score - fullStars;

    if (starIndex <= fullStars) {
      return 100; // Повна зірка
    } else if (starIndex === fullStars + 1) {
      return partialStar * 100; // Часткова зірка
    } else {
      return 0; // Порожня зірка
    }
  }

  favoriteHandle($event: any) {
    if (this.product!.in_favorite) {
      this.removeFromFavorites(this.product?.id);
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
        this.alertService.createToast({
          header: `Product was successfully added to Favorite list!`,
          mode: 'ios',
          position: 'bottom',
        });
      },
      (error: any) => {}
    );
  }

  removeFromFavorites(id: any) {
    this.favoriteService.deleteProductFromFavList(id).subscribe(
      (data: any) => {
        if (!this.idFavorilteList) {
          this.product.in_favorite = false;
        }
        this.alertService.createToast({
          header: `Product was successfully removed from Favorite lists!`,
          mode: 'ios',
          position: 'bottom',
        });
        this.reloadPage.emit(true);
      },
      (error: any) => {}
    );
  }
}
