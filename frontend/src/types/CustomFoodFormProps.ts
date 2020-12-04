import { CustomFood } from './CustomFood';

export interface CustomFoodFormProps {
    food: CustomFood,
    visible: boolean,
    onSuccess: (foods: Array<CustomFood>) => void,
    onCancel: () => void
}
