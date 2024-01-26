import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
})
export class FilterRowComponent implements OnInit {
  @Output() onOpenFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onOpenSort: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() resultCount = 0;

  constructor() {}

  ngOnInit() {}
}
