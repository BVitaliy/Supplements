import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.page.html',
  styleUrls: ['./trending.page.scss'],
})
export class TrendingPage implements OnInit {
  public products: any[] = [];
  isLoading: boolean = false;

  constructor(
    public navCtrl: NavController,
    private catalogService: CatalogService
  ) {}

  ngOnInit() {}

  doRefresh(event: any) {
    this.getTrending(() => event.target.complete());
  }

  ionViewWillEnter() {
    this.getTrending();
  }

  getTrending(callbackFunction?: () => void) {
    this.isLoading = true;
    const data = {
      limit: 100,
    };
    this.catalogService
      .getTopRated(data)
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
