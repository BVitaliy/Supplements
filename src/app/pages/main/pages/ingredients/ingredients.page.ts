import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonContent, IonInfiniteScroll, NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { getPriorityValue } from 'src/app/core/functions/priority-value';
import { AlertService } from 'src/app/core/services/alert.service';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  styleUrls: ['./ingredients.page.scss'],
})
export class IngredientsPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: {
    disabled: boolean;
    complete: () => any;
  };
  loading: boolean = false;
  searchForm!: FormGroup;
  disableInfinity = false;
  current_page = 1;
  items_per_page = 30;
  public brandList: any[] = [];

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
      this.searchIngrediens(event?.detail?.value);
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
        setTimeout(() => {
          this.current_page = 1;
          this.items_per_page = this.items_per_page + 30;

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
      .getIngredients(data)
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
          this.brandList = this.objectToArray(data?.results);

          this.disableInfinity =
            this.current_page * this.items_per_page >= data?.count;
          if (this.disableInfinity && this.infiniteScroll) {
            this.infiniteScroll.disabled = true;
          } else {
            this.infiniteScroll?.complete();
          }
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  searchIngrediens(search: string) {
    this.loading = true;
    this.mainService
      .searchIngredients({ query: search })
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

  getPriorityValue(data: any) {
    return getPriorityValue(data);
  }
}
