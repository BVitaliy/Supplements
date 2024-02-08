import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IngredientOption } from 'src/app/core/models/highlighted-ingredients.models';

@Component({
  selector: 'app-ingredients-history',
  templateUrl: './ingredients-history.component.html',
  styleUrls: ['./ingredients-history.component.scss'],
})
export class IngredientsHistoryComponent {
  @Input() ingredientsHistory: IngredientOption[] = [];
  @Input() isHistory: boolean = true;

  @Output() onCleanHistory: EventEmitter<void> = new EventEmitter<void>();
}
