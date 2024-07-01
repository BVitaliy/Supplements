import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating-count',
  templateUrl: './rating-count.component.html',
  styleUrls: ['./rating-count.component.scss'],
})
export class RatingCountComponent implements OnInit {
  @Input() count: number = 0;
  @Input() rating: number = 0;
  @Input() text = '';
  @Input() isLoading!: boolean;
  @Input() type = ''; //badge

  constructor() {}

  ngOnInit() {}
}
