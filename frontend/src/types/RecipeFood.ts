import { CustomFood } from './CustomFood';

export interface RecipeFood {
    id: number,
    recipeId: number,
    foodId: number,
    food?: CustomFood,
    quantity: number,
    calories?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    sugar?: number,
    isAlcoholic?: boolean,
}
