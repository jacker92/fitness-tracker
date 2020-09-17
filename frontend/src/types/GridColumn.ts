import { CSSProperties } from 'react';

export interface GridColumn {
    Key: string,
    Heading: string,
    Width: string,
    ColumnId: string,
    CellStyle?: CSSProperties
}
