import { Recipe } from './Recipe';

export interface RecipeFormProps {
    recipe: Recipe,
    visible: boolean,
    onSuccess: (foods: Array<Recipe>) => void,
    onCancel: () => void
}
