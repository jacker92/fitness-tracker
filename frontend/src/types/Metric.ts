export interface Metric {
    id?: number,
    userId?: string,
    name: string,
    units: string,
    type: number,
    isSystem?: boolean,
}
