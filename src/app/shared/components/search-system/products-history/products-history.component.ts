import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-products-history',
  templateUrl: './products-history.component.html',
  styleUrls: ['./products-history.component.scss'],
})
export class ProductsHistoryComponent {
  @Input() productsHistory: any[] = [];

  @Output() onCleanHistory: EventEmitter<void> = new EventEmitter<void>();
}
