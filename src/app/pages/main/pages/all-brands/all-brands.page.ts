import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-all-brands',
  templateUrl: './all-brands.page.html',
  styleUrls: ['./all-brands.page.scss'],
})
export class AllBrandsPage implements OnInit {
  loading: boolean = false;
  searchForm!: FormGroup;

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
      this.searchBrands(event?.detail?.value);
    });
  }

  doRefresh(event: any) {
    this.zone.run(() => {
      this.getData(true, () => event.target.complete());
    });
  }

  getData(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.mainService
      .getBrands(refresh)
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
}
