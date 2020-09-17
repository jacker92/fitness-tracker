import { Gear } from './Gear';

export interface GearFormProps{
    gear: Gear,
    visible: boolean,
    onSuccess: Function,
    onCancel: Function
}
