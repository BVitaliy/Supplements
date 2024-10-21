import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';

@Component({
  selector: 'app-onboarding-search-product',
  templateUrl: './onboarding-search-product.component.html',
  styleUrls: ['./onboarding-search-product.component.scss'],
})
export class OnboardingSearchProductComponent implements OnInit {
  products: Array<any> = [];
  modalHeight = 0;
  searchText = '';
  openInModal = true;
  isLoading = false;

  constructor(
    private zone: NgZone,
    private catalogService: CatalogService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.modalHeight = Math.floor(0.9 * window.innerHeight);
  }

  public search(event: any): void {
    this.zone.run(() => {
      this.searchText = event?.detail?.value;

      if (
        (event?.detail?.value && event?.detail?.value?.length >= 3) ||
        !event?.detail?.value
      ) {
        this.isLoading = true;
        this.catalogService
          .searchProduct({ query: this.searchText })
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe({
            next: (data: any) => {
              this.products = data.results;
            },
            error: (error: any) => {},
          });
      }
    });
  }

  async cancelModal(closeModal = false) {
    await this.modalController.dismiss(closeModal);
  }
}
