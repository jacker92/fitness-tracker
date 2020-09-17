import { GridRow } from './GridRow';

export interface GearDataRow extends GridRow {
    id: number,
    name: string,
    active: boolean,
    activeString: string,
}
