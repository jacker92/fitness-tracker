import { GridColumn } from './GridColumn';

export interface GridProps {
    columns: Array<GridColumn>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Array<any>,
    noRowsMessage?: string,
    keyColumn: string,
    IDColumn?: string,
    nameColumn?: string,
    onAdd?: () => void,
    onEdit?: (id: number) => void,
    onDelete?: (id: number, name: string) => void,
    onToggleActive?: (id: number, active: boolean) => void,
    onTrackChange?: (id: number) => void
}
