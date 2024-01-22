import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() type = 'vertical'; //horizontal
  @Input() product: any;

  constructor() {}

  ngOnInit() {}

  favoriteHandle($event: any) {
    console.log($event);
  }
}
