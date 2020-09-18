import { Metric } from './Metric';

export interface UserTrackedMetric {
    id: number,
    userId: string,
    metricId: number,
    metric: Metric,
    isTracked: boolean
}
