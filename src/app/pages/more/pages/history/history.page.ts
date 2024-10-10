import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HistoryTabs } from './history.models';
import { Products } from '../../../../../mock/products';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';
import { finalize } from 'rxjs';
import { Storage } from '@ionic/storage';

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
    private catalogService: CatalogService,
    private zone: NgZone,
    private storage: Storage
  ) {}

  ionViewWillEnter() {
    this.zone.run(() => {
      this.getProducts();
      this.storage.get('history_page').then((value) => {
        if (value) {
          this.activeTab = value;
        }
      });
    });
  }

  doRefresh(event: any) {
    this.zone.run(() => {
      this.getProducts(() => event.target.complete());
    });
  }

  handleChangeTab(event: any) {
    this.zone.run(() => {
      this.activeTab = event?.detail?.value;
      this.storage.set('history_page', event?.detail?.value);
      this.getProducts();
    });
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
