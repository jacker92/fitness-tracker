import { Gear } from './Gear';

export interface GearFormProps{
    gear: Gear,
    visible: boolean,
    onSuccess: (data: Array<Gear>) => void,
    onCancel: () => void
}
