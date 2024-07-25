import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getPriorityValue } from 'src/app/core/functions/priority-value';

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

  open = false;
  countHide = 0;

  constructor() {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
    this.optionsToShow = this.options;

    this.checkCount();

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
    this.searchForm.get('search')?.setValue(event?.detail?.value);
  }

  public checkboxChangeState(_e: any, option?: any): void {
    if (
      option &&
      this.addedOptions.every((el: any): boolean => el !== option.id)
    ) {
      this.addedOptions.push(option?.id);
    } else if (
      option &&
      this.addedOptions.some((el: any): boolean => el === option.id)
    ) {
      this.addedOptions = this.addedOptions.filter(
        (el: any): boolean => el !== option.id
      );
    }

    this.filteredOptions.emit(this.addedOptions);
  }

  isSelected(option: any): boolean {
    return !!this.addedOptions.find((el: any) => el === option?.id);
  }

  getPriorityValue(data: any) {
    return getPriorityValue(data);
  }
}
