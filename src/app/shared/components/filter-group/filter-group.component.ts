import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
  addedOptions: any[] = [];
  optionsToShow: any[] = [];

  open = false;
  countHide = 0;

  constructor() {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
    this.optionsToShow = this.options;
    console.log(this.optionsToShow);

    this.searchForm.get('search')?.valueChanges.subscribe((el) => {
      this.optionsToShow =
        el.length > 0
          ? this.options.filter((option) =>
              option.label.toLowerCase().includes(el.toLowerCase())
            )
          : this.options;
    });

    if (this.options && this.options?.length > 10) {
      this.countHide = this.options?.length - 10;
    }
  }

  toggleAllOptions() {
    this.open = !this.open;
  }

  public search(event: any): void {
    console.log(event?.detail?.value);
    this.searchForm.get('search')?.setValue(event?.detail?.value);
  }

  public checkboxChangeState(_e: any, option?: any): void {
    if (
      option &&
      this.addedOptions.every((el: any): boolean => el.id !== option.id)
    ) {
      this.addedOptions.push(option);
      if (option.id) {
        this.handleChangeCheckboxState(true, option.id);
      }
    } else if (
      option &&
      this.addedOptions.some((el: any): boolean => el.id === option.id)
    ) {
      this.addedOptions = this.addedOptions.filter(
        (el: any): boolean => el.id !== option.id
      );
      if (option.id) {
        this.handleChangeCheckboxState(false, option.id);
      }
    }

    this.filteredOptions.emit(this.addedOptions);
    console.log(this.addedOptions);
  }

  private handleChangeCheckboxState(value: boolean, id: number): void {
    this.optionsToShow = this.optionsToShow.map((option: any) => {
      return option.id === id
        ? {
            ...option,
            checked: value,
          }
        : option;
    });
  }
}
