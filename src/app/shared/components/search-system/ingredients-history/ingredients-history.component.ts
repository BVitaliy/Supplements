import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IngredientOption } from '../../../../pages/more/pages/highlighted-ingredients/highlighted-ingredients.models';

@Component({
  selector: 'app-ingredients-history',
  templateUrl: './ingredients-history.component.html',
  styleUrls: ['./ingredients-history.component.scss'],
})
export class IngredientsHistoryComponent {
  @Input() ingredientsHistory: IngredientOption[] = [];

  @Output() onCleanHistory: EventEmitter<void> = new EventEmitter<void>();
}
