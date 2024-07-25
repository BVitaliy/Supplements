export class IngredientOption {
  public color?: string;
  public label?: string;
  public name?: string;
  public id?: number;
  public status?: ReasonLabels;
  public checked?: boolean;
  is_contamintant?: boolean;
  is_allergen?: boolean;
  is_weaknesses?: boolean;
  is_benefit?: boolean;
}

export class IngredientsSection {
  public label?: string;
  public ingredients?: IngredientOption[];
}

export class ReasonOption {
  public color?: string;
  public label?: ReasonLabels;
  public type?: string;
  public isActive?: boolean;
}

export enum ReasonLabels {
  benefit = 'Benefit',
  weakness = 'Weakness',
  contaminant = 'Contaminant',
  allergen = 'Allergen',
}
