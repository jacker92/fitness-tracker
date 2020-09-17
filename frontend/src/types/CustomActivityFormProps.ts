import { Activity } from './Activity';

export interface CustomActivityFormProps {
    activity: Activity,
    visible: boolean,
    onSuccess: Function,
    onCancel: Function
}
