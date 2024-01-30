import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { IngredientOption, IngredientsSection, ReasonLabels, ReasonOption } from './highlighted-ingredients.models';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-highlighted-ingredients',
  templateUrl: './highlighted-ingredients.page.html',
  styleUrls: ['./highlighted-ingredients.page.scss'],
})
export class HighlightedIngredientsPage implements OnInit {
  @ViewChild('reasonsSwiper') reasonsSwiper!: SwiperComponent;
  @ViewChild('ingredientsSwiper') ingredientsSwiper!: SwiperComponent;

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
    },
    {
      color: '#FF001C',
      label: ReasonLabels.weakness,
      isActive: false,
    },
    {
      color: '#FF9635',
      label: ReasonLabels.contaminant,
      isActive: false,
    },
    {
      color: '#FDE334',
      label: ReasonLabels.allergen,
      isActive: false,
    },
  ];
  public addedIngredientsOptions: IngredientOption[] = [];
  public optionsToShow: IngredientsSection[] = [];
  public options: IngredientsSection[] = [
    {
      label: 'A',
      ingredients: [
        {
          color: '#22B51F',
          label: 'Aloe Vera',
          id: 1,
          status: ReasonLabels.benefit,
          checked: false,
        },
        {
          color: '#22B51F',
          label: 'Alpha-Carotene',
          id: 3,
          status: ReasonLabels.benefit,
          checked: false,
        },
        {
          color: '#22B51F',
          label: 'Alpha-Ketoglutaric Acid',
          id: 4,
          status: ReasonLabels.benefit,
          checked: false,
        },
        {
          color: '#22B51F',
          label: 'Apple Pectin',
          id: 5,
          status: ReasonLabels.benefit,
          checked: false,
        },
      ],
    },
    {
      label: 'B',
      ingredients: [
        {
          color: '#22B51F',
          label: 'Basil',
          id: 6,
          status: ReasonLabels.benefit,
          checked: false,
        },
        {
          color: '#22B51F',
          label: 'Beet Root',
          id: 7,
          status: ReasonLabels.benefit,
          checked: false,
        },
        {
          color: '#22B51F',
          label: 'Berberine',
          id: 8,
          status: ReasonLabels.benefit,
          checked: false,
        },
        {
          color: '#FF001C',
          label: 'Beta - Glucans',
          id: 9,
          status: ReasonLabels.weakness,
          checked: false,
        },
        {
          color: '#FDE334',
          label: 'Bilberry',
          id: 10,
          status: ReasonLabels.allergen,
          checked: false,
        },
        {
          color: '#FF9635',
          label: 'Some test',
          id: 11,
          status: ReasonLabels.contaminant,
          checked: false,
        },
      ],
    },
  ];

  constructor(public navCtrl: NavController) {}

  public ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
    this.optionsToShow = this.options;
  }

  public handleApplyChanges(): void {
    // apply changes
  }

  public handleSelectReasonFilter(label?: ReasonLabels | string): void {
    if (this.activeReasonFilter === label) {
      this.activeReasonFilter = '';
      this.optionsToShow = this.options;
    } else {
      this.activeReasonFilter = label || '';
      this.optionsToShow = this.options.map((el: IngredientsSection) => {
        return {
          ...el,
          ingredients: el.ingredients?.filter((option: IngredientOption): boolean => option.status === label),
        };
      });
    }
  }

  public handleClearAllAddedIngredients(): void {
    this.addedIngredientsOptions = [];
  }

  public handleClearAddedIngredient(id?: number): void {
    this.addedIngredientsOptions = this.addedIngredientsOptions.filter((opt: IngredientOption): boolean => opt.id !== id);
    if (id) {
      this.handleChangeCheckboxState(false, id);
    }
  }

  public search(event: any): void {
    console.log(event?.detail?.value);
    this.searchForm.get('search')?.setValue(event?.detail?.value);
  }

  public checkboxChangeState(_e: any, ingredient?: IngredientOption): void {
    if (ingredient && this.addedIngredientsOptions.every((el: IngredientOption): boolean => el.id !== ingredient.id)) {
      this.addedIngredientsOptions.push(ingredient);
      if (ingredient.id) {
        this.handleChangeCheckboxState(true, ingredient.id);
      }
    } else if (ingredient && this.addedIngredientsOptions.some((el: IngredientOption): boolean => el.id === ingredient.id)) {
      this.addedIngredientsOptions = this.addedIngredientsOptions.filter((el: IngredientOption): boolean => el.id !== ingredient.id)
      if (ingredient.id) {
        this.handleChangeCheckboxState(false, ingredient.id);
      }
    }
  }

  private handleChangeCheckboxState(value: boolean, id: number): void {
    this.optionsToShow = this.optionsToShow.map((item: IngredientsSection) => {
      return {
        ...item,
        ingredients: item?.ingredients?.map((option: IngredientOption): IngredientOption => option.id === id ? {
          ...option,
          checked: value,
        } : option),
      } as IngredientsSection;
    });
  }
}
