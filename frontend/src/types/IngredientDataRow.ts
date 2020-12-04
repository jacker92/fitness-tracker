import { GridRow } from './GridRow';

export interface IngredientDataRow extends GridRow {
    id: number,
    foodId: number,
    name: string,
    calories?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    sugar?: number,
    quantity: number,
    isAlcoholic?: boolean,
}
