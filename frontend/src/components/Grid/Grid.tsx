import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { GridProps } from '../../lib/types/GridProps';
// eslint-disable-next-line no-unused-vars
import { GridColumn } from '../../lib/types/GridColumn';

import './Grid.css';

const Grid = (props: GridProps) => {
    const {
        columns,
        data,
        noRowsMessage,
        keyColumn,
        IDColumn,
        nameColumn,
        onAdd,
        onEdit,
        onDelete,
        onToggleActive,
        onTrackChange,
    } = props;

    const [gridData, setGridData] = useState(data);

    useEffect(() => {
        setGridData(data);
    }, [data]);

    return (
        <>
            {typeof onAdd === 'function' && (
                <div className="add-button">
                    <button
                        type="button"
                        className="blue"
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.preventDefault();
                            onAdd();
                        }}
                    >
                        Add
                    </button>
                </div>
            )}
            <table className="grid" cellSpacing={0}>
                <thead>
                    <tr>
                        {columns.map((col: GridColumn) => (
                            <th style={{ width: col.Width }} key={col.Key}>{col.Heading}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {gridData.length > 0 && (
                        gridData.map((row: any) => (
                            <tr data-testid="griddatarow" key={row[keyColumn]}>
                                {columns.map((col: GridColumn) => {
                                    switch (col.Key) {
                                        case 'EDIT':
                                            return (
                                                <td key={`row_${col.Key}`} align="center">
                                                    {row.canEdit
                                                        ? (
                                                            <button
                                                                className="blue"
                                                                type="button"
                                                                onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                                    e.preventDefault();
                                                                    if (typeof onEdit === 'function') {
                                                                        onEdit(row[IDColumn]);
                                                                    }
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                        ) : <></>}
                                                </td>
                                            );

                                        case 'TRACK':
                                            return (
                                                <td key={`row_${col.Key}`} align="center">
                                                    <button
                                                        className="blue"
                                                        type="button"
                                                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                            e.preventDefault();
                                                            if (typeof onTrackChange === 'function') {
                                                                onTrackChange(row[IDColumn]);
                                                            }
                                                        }}
                                                    >
                                                        {row.isTracked ? 'Untrack' : 'Track'}
                                                    </button>
                                                </td>
                                            );

                                        case 'TOGGLEACTIVE':
                                            return (
                                                <td key={`row_${col.Key}`} align="center">
                                                    <button
                                                        className="blue"
                                                        type="button"
                                                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                            e.preventDefault();
                                                            if (typeof onToggleActive === 'function') {
                                                                onToggleActive(row[IDColumn], row.active);
                                                            }
                                                        }}
                                                    >
                                                        {row.active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </td>
                                            );

                                        case 'DELETE':
                                            return (
                                                <td key={`row_${col.Key}`} align="center">
                                                    {row.canDelete
                                                        ? (
                                                            <button
                                                                className="red"
                                                                type="button"
                                                                onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                                    e.preventDefault();
                                                                    if (typeof onDelete === 'function') {
                                                                        onDelete(row[IDColumn], row[nameColumn]);
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        ) : <></>}
                                                </td>
                                            );

                                        default:
                                            return (
                                                <td key={`row_${col.Key}`} style={col.CellStyle}>{row[col.ColumnId]}</td>
                                            );
                                    }
                                })}
                            </tr>
                        ))
                    )}
                    {gridData.length === 0 && (
                        <tr>
                            <td align="center" colSpan={columns.length}>{noRowsMessage}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

Grid.defaultProps = {
    data: [],
    noRowsMessage: 'No rows',
    IDColumn: 'ID',
    nameColumn: 'name',
    onAdd: null,
    onEdit: null,
    onDelete: null,
    onTrackChange: null,
    onToggleActive: null,
};

Grid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    columns: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array,
    noRowsMessage: PropTypes.string,
    keyColumn: PropTypes.string.isRequired,
    IDColumn: PropTypes.string,
    nameColumn: PropTypes.string,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onTrackChange: PropTypes.func,
    onToggleActive: PropTypes.func,
};

export { Grid };
