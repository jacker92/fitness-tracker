import { GridColumn } from './GridColumn';

export interface GridProps {
    columns: Array<GridColumn>,
    data?: Array<any>,
    noRowsMessage?: string,
    keyColumn: string,
    IDColumn?: string,
    nameColumn?: string,
    onAdd?: Function,
    onEdit?: Function,
    onDelete?: Function,
    onToggleActive?: Function,
    onTrackChange?: Function
}
