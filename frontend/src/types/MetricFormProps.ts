import { Metric } from './Metric';
import { UserTrackedMetric } from './UserTrackedMetric';

export interface MetricFormProps {
    metric: Metric,
    visible: boolean,
    onSuccess: (metrics: Array<UserTrackedMetric>) => void,
    onCancel: () => void
}
