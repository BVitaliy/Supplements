import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { FormControl, FormGroup } from '@angular/forms';
import {
  IngredientOption,
  IngredientsSection,
  ReasonLabels,
  ReasonOption,
} from 'src/app/core/models/highlighted-ingredients.models';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { finalize, Subscription } from 'rxjs';
import { MainService } from 'src/app/pages/main/main.service';

@Component({
  selector: 'app-highlighted-ingredients',
  templateUrl: './highlighted-ingredients.page.html',
  styleUrls: ['./highlighted-ingredients.page.scss'],
})
export class HighlightedIngredientsPage implements OnInit {
  @ViewChild('reasonsSwiper') reasonsSwiper!: SwiperComponent;
  @ViewChild('ingredientsSwiper') ingredientsSwiper!: SwiperComponent;
  @Input() addedIngredientsOptions: Array<IngredientOption> = [];
  // backBtnSubscription!: Subscription;
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
  loading = false;

  public optionsToShow: any[] = [];
  public options: any[] = [];

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private mainService: MainService
  ) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });

    this.searchIngrediens();
  }

  public async handleApplyChanges() {
    await this.modalController.dismiss(this.addedIngredientsOptions);
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
    this.addedIngredientsOptions?.map((item: any) => {
      this.handleChangeCheckboxState(false, item?.id);
    });
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

  public search(event: any): void {
    this.searchForm.get('search')?.setValue(event?.detail?.value);
    this.searchIngrediens(event?.detail?.value);
  }

  public checkboxChangeState(_e: any, option?: any): void {
    if (
      option &&
      this.addedIngredientsOptions.every((el: any): boolean => el !== option.id)
    ) {
      this.addedIngredientsOptions.push(option);
    } else if (
      option &&
      this.addedIngredientsOptions.some((el: any): boolean => el === option.id)
    ) {
      this.addedIngredientsOptions = this.addedIngredientsOptions.filter(
        (el: any): boolean => el !== option.id
      );
    }
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

  cancelModal() {
    this.modalController.dismiss();
  }

  public items: any[] = [];

  doRefresh(event: any) {
    this.searchIngrediens();
  }

  searchIngrediens(search?: string, type?: any) {
    this.loading = true;
    let data = {
      query: search,
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
          console.log(data);
          this.optionsToShow = this.objectToArray(data?.results);
          this.options = this.objectToArray(data?.results);
        },
        (error: any) => {
          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
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

  isSelected(option: any): boolean {
    return !!this.addedIngredientsOptions.find((el: any) => el === option?.id);
  }
}
