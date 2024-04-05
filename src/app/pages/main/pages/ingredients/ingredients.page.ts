import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
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

  public brandList: any[] = [
    {
      label: 'A',
      brands: [
        {
          label: 'Aloe Vera',
          id: 1,
          color: '#22B51F',
        },
        {
          label: 'Aloe Vera',
          id: 2,
          color: '#22B51F',
        },
        {
          label: 'Aloe Vera',
          id: 3,
          color: '#22B51F',
        },
        {
          label: 'Aloe Vera',
          id: 4,
          color: '#22B51F',
        },
      ],
    },
    {
      label: 'B',
      brands: [
        {
          label: 'Basil',
          id: 1,
          color: '#22B51F',
        },
        {
          label: 'Beta - Glucans',
          id: 2,
          color: '#FF001C',
        },
        {
          label: 'Bilberry',
          id: 3,
          color: '#FDE334',
        },
        {
          label: 'Bilberry',
          id: 4,
          color: '#FDE334',
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
    this.searchIngrediens(event?.detail?.value);
  }

  doRefresh(event: any) {
    this.getData(true, () => event.target.complete());
  }

  getData(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.mainService
      .getIngredients(refresh)
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
}
