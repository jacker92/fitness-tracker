import { FoodGrouping } from './FoodGrouping';

export interface FoodGroupingFormProps {
    foodGrouping: FoodGrouping,
    visible: boolean,
    onSuccess: (foodGroupings: Array<FoodGrouping>) => void,
    onCancel: () => void
}
