import { RecipeFood } from './RecipeFood';

export interface RecipeFoodFormProps {
    recipeFood: RecipeFood,
    visible: boolean,
    isNew?: boolean,
    onSuccess: (recipeFood: RecipeFood) => void,
    onCancel: () => void
}
