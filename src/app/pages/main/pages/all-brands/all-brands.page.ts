import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonContent, IonInfiniteScroll, NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-all-brands',
  templateUrl: './all-brands.page.html',
  styleUrls: ['./all-brands.page.scss'],
})
export class AllBrandsPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: {
    disabled: boolean;
    complete: () => any;
  };

  disableInfinity = false;
  current_page = 1;
  items_per_page = 30;

  loading: boolean = false;
  searchForm!: FormGroup;

  public brandList: any[] = [];

  private scrollPosition = 0;

  constructor(
    public navCtrl: NavController,
    private mainService: MainService,
    private alertService: AlertService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
  }

  ionViewWillEnter() {
    this.zone.run(() => {
      this.getData();
    });
  }

  public search(event: any): void {
    this.zone.run(() => {
      this.searchForm.get('search')?.setValue(event?.detail?.value);
      this.searchBrands(event?.detail?.value);
    });
  }

  doRefresh(event: any) {
    this.zone.run(() => {
      this.getData(true, () => event.target.complete());
    });
  }

  loadData() {
    this.zone.run(() => {
      if (!this.disableInfinity) {
        setTimeout(async() => {
          this.current_page = 1;
          this.items_per_page = this.items_per_page + 30;
          await this.saveScrollPosition();
          this.getData(false, undefined);
        }, 500);
      } else {
        this.disableInfinity = true;
      }
    });
  }

  getData(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;

    const data = {
      limit: this.items_per_page,
    };

    this.mainService
      .getBrands(data)
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
          this.brandList = this.objectToArray(data?.results);
          this.disableInfinity =
            this.current_page * this.items_per_page >= data?.count;
          if (this.disableInfinity && this.infiniteScroll) {
            this.infiniteScroll.disabled = true;
          } else {
            this.infiniteScroll?.complete();
          }
          setTimeout(() => {
            this.restoreScrollPosition()
          }, 100);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  searchBrands(search: string) {
    this.loading = true;
    this.mainService
      .searchBrands(search)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.brandList = this.objectToArray(data?.results);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  objectToArray(obj: { [key: string]: any }): { label: string; brands: any }[] {
    return Object.keys(obj).map((key) => ({ label: key, brands: obj[key] }));
  }

  async saveScrollPosition() {
    this.scrollPosition = await this.content.getScrollElement().then(el => el.scrollTop);
    
  }

  // Відновлюємо позицію після оновлення даних
  restoreScrollPosition() {
    this.content.scrollToPoint(0, this.scrollPosition, 0); // 300ms для плавного скролу
  }
}
