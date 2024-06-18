import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-btn',
  templateUrl: './favorite-btn.component.html',
  styleUrls: ['./favorite-btn.component.scss'],
})
export class FavoriteBtnComponent implements OnInit {
  @Output() favorited: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() product: any;
  @Input() favorite: boolean = false;
  @Input() size = ''; //md

  constructor() {}

  ngOnInit() {}

  favoriteHandle() {
    this.product.favorite = !this.product?.favorite;
    this.favorited.emit(this.product.favorite);
  }
}
