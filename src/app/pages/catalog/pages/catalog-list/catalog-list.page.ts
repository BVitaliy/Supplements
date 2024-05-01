import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { FilterModalComponent } from 'src/app/shared/components/filter-modal/filter-modal.component';
import { ProductNotFoundComponent } from 'src/app/shared/components/product-not-found/product-not-found.component';
import { CatalogService } from '../../catalog.service';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.page.html',
  styleUrls: ['./catalog-list.page.scss'],
})
export class CatalogListPage implements OnInit {
  public loading: boolean = false;
  public filterForm!: FormGroup;
  public isSearchActive: boolean = false;
  categories: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private catalogService: CatalogService
  ) {}

  public ngOnInit(): void {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
    });
    this.getCategories();
    // setTimeout(() => {
    // this.openProductNotFound();
    // }, 3000);
  }

  public search(event: any): void {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
  }

  public onSearchFocus(_event: any): void {
    this.isSearchActive = true;
  }

  public handleCancelSearch(): void {
    this.isSearchActive = false;
  }

  async openProductNotFound() {
    const modal = await this.modalController.create({
      component: ProductNotFoundComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.75],
      initialBreakpoint: 0.75,
      handle: true,
      componentProps: {},
    });

    return await modal.present();
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getCategories(true, () => event.target.complete());
  }

  getCategories(refresh?: boolean, callbackFunction?: () => void) {
    this.catalogService
      .getCategories(refresh)
      .pipe(
        finalize(() => {
          this.loading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          // this.profileDetails = data;
          this.categories = data.results;
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
}
