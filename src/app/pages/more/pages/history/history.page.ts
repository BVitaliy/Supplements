import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HistoryTabs } from './history.models';
import { Products } from '../../../../../mock/products';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  public historyTabs: typeof HistoryTabs = HistoryTabs;
  public activeTab = 'viewed';
  public products: any[] = [];
  isLoading = false;

  constructor(
    public navCtrl: NavController,
    private catalogService: CatalogService
  ) {}

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event: any) {
    this.getProducts(() => event.target.complete());
  }

  handleChangeTab(event: any) {
    this.activeTab = event?.detail?.value;
    this.getProducts();
  }

  getProducts(callbackFunction?: () => void) {
    this.isLoading = true;
    const data = {
      [this.activeTab]: true,
    };
    this.catalogService
      .getHistory(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.products = data?.results;
        },
        error: (error: any) => {},
      });
  }
}
