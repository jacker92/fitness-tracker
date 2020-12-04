import { GridRow } from './GridRow';

export interface FoodGroupingDataRow extends GridRow {
    id: number,
    name: string,
    sortOrder: number,
}
