import { Activity } from './Activity';

export interface CustomActivityFormProps {
    activity: Activity,
    visible: boolean,
    onSuccess: (activities: Array<Activity>) => void,
    onCancel: () => void
}
