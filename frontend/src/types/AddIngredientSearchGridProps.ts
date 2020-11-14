import { RecipeFood } from './RecipeFood';

export interface AddIngredientSearchGridProps {
    visible: boolean,
    onFoodSelected: (food: RecipeFood) => void,
    onCancel: () => void,
}
