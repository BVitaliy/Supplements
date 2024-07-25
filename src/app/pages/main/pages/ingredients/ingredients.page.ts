import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
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
  loading: boolean = false;
  searchForm!: FormGroup;

  public brandList: any[] = [];

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
    this.searchIngrediens(event?.detail?.value);
  }

  doRefresh(event: any) {
    this.getData(true, () => event.target.complete());
  }

  getData(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.mainService
      .getIngredients()
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

  searchIngrediens(search: string) {
    this.loading = true;
    this.mainService
      .searchIngredients(search)
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
