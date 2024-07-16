import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import {
  IngredientOption,
  IngredientsSection,
  ReasonLabels,
  ReasonOption,
} from '../../../../core/models/highlighted-ingredients.models';
import { FormControl, FormGroup } from '@angular/forms';
import { MainService } from 'src/app/pages/main/main.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { finalize } from 'rxjs';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';

@Component({
  selector: 'app-highlighted-ingredients',
  templateUrl: './highlighted-ingredients.page.html',
  styleUrls: ['./highlighted-ingredients.page.scss'],
})
export class HighlightedIngredientsPage implements OnInit {
  @ViewChild('reasonsSwiper') reasonsSwiper!: SwiperComponent;
  @ViewChild('ingredientsSwiper') ingredientsSwiper!: SwiperComponent;
  loading = false;
  public searchForm!: FormGroup;
  public activeReasonFilter: string = '';
  public reasonsSlideOpts: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 8,
    speed: 400,
    freeMode: true,
  };
  public addedIngrSlideOpts: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 12,
    speed: 400,
    freeMode: true,
  };
  public reasonsOptions: ReasonOption[] = [
    {
      color: '#22B51F',
      label: ReasonLabels.benefit,
      isActive: false,
      type: 'is_benefit',
    },
    {
      color: '#FF001C',
      label: ReasonLabels.weakness,
      isActive: false,
      type: 'is_weaknesses',
    },
    {
      color: '#FF9635',
      label: ReasonLabels.contaminant,
      isActive: false,
      type: 'is_contamintant',
    },
    {
      color: '#FDE334',
      label: ReasonLabels.allergen,
      isActive: false,
      type: 'is_allergen',
    },
  ];
  public addedIngredientsOptions: any[] = [];
  public optionsToShow: any[] = [];
  public options: any[] = [];

  constructor(
    public navCtrl: NavController,
    private mainService: MainService,
    private alertService: AlertService,
    private catalogService: CatalogService
  ) {}

  public ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
    this.optionsToShow = this.options;
  }

  // apply changes
  public handleApplyChanges(): void {
    console.log(this.addedIngredientsOptions);
    this.addedIngredientsOptions.forEach((el, index) => {
      this.switchHighlightedIng(el);

      if (index === this.addedIngredientsOptions.length - 1) {
        setTimeout(() => {
          this.searchIngrediens(this.searchForm.value.search);
        }, 300);
      }
    });
  }

  public handleSelectReasonFilter(option?: any): void {
    console.log(option);

    if (this.activeReasonFilter === option.label) {
      this.activeReasonFilter = '';
    } else {
      this.activeReasonFilter = option.label || '';
    }
    this.searchIngrediens(this.searchForm.value.search, option?.type);
  }

  public handleClearAllAddedIngredients(): void {
    this.addedIngredientsOptions = [];
  }

  public handleClearAddedIngredient(id?: number): void {
    this.addedIngredientsOptions = this.addedIngredientsOptions.filter(
      (opt: IngredientOption): boolean => opt.id !== id
    );
    if (id) {
      this.handleChangeCheckboxState(false, id);
    }
  }

  // public search(event: any): void {
  //   console.log(event?.detail?.value);
  //   this.searchForm.get('search')?.setValue(event?.detail?.value);
  // }

  public checkboxChangeState(_e: any, ingredient?: IngredientOption): void {
    if (
      ingredient &&
      this.addedIngredientsOptions.every(
        (el: IngredientOption): boolean => el.id !== ingredient.id
      )
    ) {
      this.addedIngredientsOptions.push(ingredient);
      if (ingredient.id) {
        this.handleChangeCheckboxState(true, ingredient.id);
      }
    } else if (
      ingredient &&
      this.addedIngredientsOptions.some(
        (el: IngredientOption): boolean => el.id === ingredient.id
      )
    ) {
      this.addedIngredientsOptions = this.addedIngredientsOptions.filter(
        (el: IngredientOption): boolean => el.id !== ingredient.id
      );
      if (ingredient.id) {
        this.handleChangeCheckboxState(false, ingredient.id);
      }
    }
    console.log(this.addedIngredientsOptions);
  }

  private handleChangeCheckboxState(value: boolean, id: number): void {
    this.optionsToShow = this.optionsToShow.map((item: IngredientsSection) => {
      return {
        ...item,
        ingredients: item?.ingredients?.map(
          (option: IngredientOption): IngredientOption =>
            option.id === id
              ? {
                  ...option,
                  checked: value,
                }
              : option
        ),
      } as IngredientsSection;
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
    this.getData(() => event.target.complete());
  }

  getData(callbackFunction?: () => void) {
    this.loading = true;
    const data = {
      highlighted: true,
      limit: 200,
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
          this.options = this.objectToArray(data?.results);
          console.log(this.options);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  searchIngrediens(search: string, type?: any) {
    this.loading = true;
    let data = {
      highlighted: true,
      query: search,
      limit: 200,
    };

    if (type && this.activeReasonFilter) {
      data = {
        ...data,
        [type]: true,
      };
    }
    this.mainService
      .searchIngredients(data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          this.options = this.objectToArray(data?.results);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  objectToArray(obj: {
    [key: string]: any;
  }): { label: string; ingredients: any }[] {
    return Object.keys(obj).map((key) => ({
      label: key,
      ingredients: obj[key],
    }));
  }

  switchHighlightedIng(item: any) {
    this.catalogService
      .switchHighlightedIng(item.id)
      .pipe(finalize(() => {}))
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
}
