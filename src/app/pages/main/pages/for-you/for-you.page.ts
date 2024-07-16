import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';

@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.page.html',
  styleUrls: ['./for-you.page.scss'],
})
export class ForYouPage implements OnInit {
  public products: any[] = [];
  isLoading: boolean = false;

  constructor(
    public navCtrl: NavController,
    private catalogService: CatalogService
  ) {}

  ngOnInit() {}

  doRefresh(event: any) {
    this.getProduct(() => event.target.complete());
  }

  ionViewWillEnter() {
    this.getProduct();
  }

  getProduct(callbackFunction?: () => void) {
    this.isLoading = true;
    const data = {
      limit: 60,
    };
    this.catalogService
      .getForYouProduct(data)
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
