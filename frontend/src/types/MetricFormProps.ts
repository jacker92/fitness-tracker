import { Metric } from './Metric';

export interface MetricFormProps {
    metric: Metric,
    visible: boolean,
    onSuccess: Function,
    onCancel: Function
}
