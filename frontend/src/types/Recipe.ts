import { Ingredient } from './Ingredient';

export interface Recipe {
    id: number,
    userId?: string,
    name: string,
    servings: number,
    isPublic: boolean,
    ingredients: Array<Ingredient>,
}
