import { Component, OnInit } from '@angular/core';
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

  public brandList: any[] = [
    {
      label: '0-9',
      brands: [
        {
          label: 'Brand name',
          id: 1,
        },
        {
          label: 'Brand name',
          id: 2,
        },
        {
          label: 'Brand name',
          id: 3,
        },
        {
          label: 'Brand name',
          id: 4,
        },
      ],
    },
    {
      label: 'A',
      brands: [
        {
          label: 'Brand name',
          id: 1,
        },
        {
          label: 'Brand name',
          id: 2,
        },
        {
          label: 'Brand name',
          id: 3,
        },
        {
          label: 'Brand name',
          id: 4,
        },
      ],
    },
  ];

  constructor(
    public navCtrl: NavController,
    private mainService: MainService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
  }

  ionViewWillEnter() {
    this.getData();
  }

  public search(event: any): void {
    this.searchForm.get('search')?.setValue(event?.detail?.value);
    this.searchBrands(event?.detail?.value);
  }

  doRefresh(event: any) {
    this.getData(true, () => event.target.complete());
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
