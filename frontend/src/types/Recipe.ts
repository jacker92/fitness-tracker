import { RecipeFood } from './RecipeFood';

export interface Recipe {
    id: number,
    userId?: string,
    name: string,
    servings: number,
    isPublic: boolean,
    ingredients: Array<RecipeFood>,
    calories?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    sugar?: number,
    isAlcoholic?: boolean,
}
