import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs';
import { getPriorityValue } from 'src/app/core/functions/priority-value';
import { MainService } from 'src/app/pages/main/main.service';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnInit {
  searchForm!: FormGroup;
  @Input() options: Array<any> = [];
  @Input() type = '';
  @Output() filteredOptions: EventEmitter<any> = new EventEmitter<any>();
  @Input() addedOptions: any[] = [];
  optionsToShow: any[] = [];
  isLoading = false;
  open = false;
  countHide = 0;

  constructor(private zone: NgZone, private mainService: MainService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
    this.optionsToShow = this.options;
    console.log(this.addedOptions);
    this.checkCount();
    if (this.type !== 'brands' && this.type !== 'ingredients') {
      this.searchForm.get('search')?.valueChanges.subscribe((el) => {
        this.optionsToShow =
          el.length > 0
            ? this.options.filter((option) =>
                option.title.toLowerCase().includes(el.toLowerCase())
              )
            : this.options;

        this.checkCount();
      });
    }
  }

  checkCount() {
    if (this.optionsToShow && this.optionsToShow?.length > 10) {
      this.countHide = this.optionsToShow?.length - 10;
    } else {
      this.countHide = 0;
    }
  }

  toggleAllOptions() {
    this.open = !this.open;
  }

  public search(event: any): void {
    this.zone.run(() => {
      this.searchForm.get('search')?.setValue(event?.detail?.value);

      if (this.type === 'brands') {
        this.getBrands(event?.detail?.value);
      }
      if (this.type === 'ingredients') {
        this.getIngredients(event?.detail?.value);
      }
    });
  }

  public checkboxChangeState(_e: any, option?: any): void {
    if (
      option &&
      this.addedOptions?.every((el: any): boolean => el !== option.id)
    ) {
      this.addedOptions?.push(option?.id);
    } else if (
      option &&
      this.addedOptions?.some((el: any): boolean => el === option.id)
    ) {
      this.addedOptions = this.addedOptions.filter(
        (el: any): boolean => el !== option.id
      );
    }

    this.filteredOptions.emit(this.addedOptions);
  }

  isSelected(option: any): boolean {
    return !!this.addedOptions?.find((el: any) => el === option?.id);
  }

  getPriorityValue(data: any) {
    return getPriorityValue(data);
  }

  getBrands(search?: any) {
    this.isLoading = true;
    let data: any = {
      limit: search ? 40 : 300,
    };
    if (search) {
      data = {
        ...data,
        query: search,
      };
    }
    this.mainService
      .getBrands(data)
      .pipe(
        distinctUntilChanged(),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.optionsToShow = [];
          const options = this.objectToArray(data?.results);
          options.forEach((brand: any) => {
            console.log(brand);
            this.optionsToShow = [...this.optionsToShow, ...brand?.brands];
          });
          console.log(this.optionsToShow);
          this.checkCount();
        },
        (error: any) => {}
      );
  }
  getIngredients(search?: any) {
    this.isLoading = true;
    let data: any = {
      limit: search ? 40 : 240,
    };
    if (search) {
      data = {
        ...data,
        query: search,
      };
    }
    this.mainService
      .getIngredients(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.optionsToShow = [];
          const options = this.objectToArray(data?.results);
          options.forEach((brand: any) => {
            console.log(brand);
            this.optionsToShow = [...this.optionsToShow, ...brand?.brands];
          });
          console.log(this.optionsToShow);
          this.checkCount();
        },
        (error: any) => {}
      );
  }

  objectToArray(obj: { [key: string]: any }): { label: string; brands: any }[] {
    return Object.keys(obj).map((key) => ({ label: key, brands: obj[key] }));
  }
}
