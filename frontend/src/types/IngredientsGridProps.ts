import { RecipeFood } from './RecipeFood';

export interface IngredientsGridProps {
    ingredients: Array<RecipeFood>,
    onChange: (ingredients: Array<RecipeFood>) => void,
}
