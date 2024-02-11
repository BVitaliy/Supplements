import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { FilterModalComponent } from 'src/app/shared/components/filter-modal/filter-modal.component';
import { SortModalComponent } from 'src/app/shared/components/sort-modal/sort-modal.component';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.page.html',
  styleUrls: ['./catalog-detail.page.scss'],
})
export class CatalogDetailPage implements OnInit {
  public listProducts: any[] = [...Products];
  loading: boolean = false;
  filterForm!: FormGroup;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl(null),
      sort: new FormControl(null),
    });
  }

  search(event: any) {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
  }

  // Відкривання модалки Filters
  async openFiltersModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: '',
      mode: 'ios',
      handle: true,
      componentProps: {
        // addedHIngredientsOptions: this.addedHIngredientsOptions,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        // this.addedHIngredientsOptions = returnedData?.data;
        console.log(returnedData);
      }
    });

    return await modal.present();
  }

  // Відкривання модалки ingredient detail
  async openSortPopover() {
    const modal = await this.modalController.create({
      component: SortModalComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.4],
      initialBreakpoint: 0.4,
      handle: true,
      componentProps: {
        sort: this.filterForm.get('sort')?.value,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        // this.addedHIngredientsOptions = returnedData?.data;
        console.log(returnedData);
      }
    });

    return await modal.present();
  }
}
