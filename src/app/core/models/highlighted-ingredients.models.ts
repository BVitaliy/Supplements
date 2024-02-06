export class IngredientOption {
  public color?: string;
  public label?: string;
  public id?: number;
  public status?: ReasonLabels;
  public checked?: boolean;
}

export class IngredientsSection {
  public label?: string;
  public ingredients?: IngredientOption[];
}

export class ReasonOption {
  public color?: string;
  public label?: ReasonLabels;
  public isActive?: boolean;
}

export enum ReasonLabels {
  benefit = 'Benefit',
  weakness = 'Weakness',
  contaminant = 'Contaminant',
  allergen = 'Allergen',
}
