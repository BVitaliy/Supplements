import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { finalize, Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';
import {
  Brands,
  Categories,
  ProductRating,
  Special,
  UserRating,
} from 'src/mock/filters';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  @Input() filters!: any;
  public form!: FormGroup;
  public categories: any[] = [...Categories];
  public brands: any[] = [...Brands];
  public productRating: any[] = [...ProductRating];
  public userRating: any[] = [...UserRating];
  public special: any[] = [...Special];
  loading = false;
  selectedOptions: any[] = [];
  backBtnSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private catalogService: CatalogService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    console.log(this.filters);
    this.form = new FormGroup({
      filters: new FormControl(this.filters || null),
    });
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
    this.getData();
  }

  doRefresh(event: any) {
    this.getData(true, () => event.target.complete());
  }

  getData(refresh?: boolean, callbackFunction?: () => void) {
    // this.loading = true;
    this.catalogService
      .getFiltersRecords(refresh)
      .pipe(
        finalize(() => {
          // this.loading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  public async handleApplyChanges() {
    // apply changes
    // console.log(this.addedIngredientsOptions);
    await this.modalController.dismiss(null);
  }

  filtered($event: any) {
    console.log($event);
    // if (
    //   option &&
    //   this.addedOptions.every((el: any): boolean => el.id !== option.id)
    // ) {
    //   this.addedOptions.push(option);
    //   if (option.id) {
    //     this.handleChangeCheckboxState(true, option.id);
    //   }
    // } else if (
    //   option &&
    //   this.addedOptions.some((el: any): boolean => el.id === option.id)
    // ) {
    //   this.addedOptions = this.addedOptions.filter(
    //     (el: any): boolean => el.id !== option.id
    //   );
    //   if (option.id) {
    //     this.handleChangeCheckboxState(false, option.id);
    //   }
    // }
  }

  async cancelModal() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    const onClosedData = this.form.value?.filters || null;
    await this.modalController.dismiss(onClosedData);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }
}
