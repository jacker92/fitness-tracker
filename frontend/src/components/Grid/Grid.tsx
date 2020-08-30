import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// eslint-disable-next-line no-unused-vars
import { GridColumn } from '../../lib/types/GridColumn';

const Table = styled.table`
    width: 100%;

    thead {
        tr {
            background-color: hsl(0, 0%, 19%);
            color: hsl(0,0%,100%);
            padding: 10px 0;

            th {
                text-align: left;
                padding: 10px;
            }
        }
    }

    tbody {
        tr {
            padding: 10px 0;

            td {
                padding: 10px;

                button.edit {
                    background: hsl(199, 83%, 56%);
                    color: hsl(0,0%,100%);
                    padding: 4px 10px;
                    border: 1px solid hsl(199, 100%, 34%);
                    font-size: 1rem;
                    border-radius: 3px;

                    &:hover {
                        background: hsl(199, 100%, 34%);
                    }
                }

                button.delete {
                    background: hsl(2, 99%, 45%);
                    color: hsl(0,0%,100%);
                    padding: 4px 10px;
                    border: 1px solid hsl(3, 87%, 35%);
                    font-size: 1rem;
                    border-radius: 3px;

                    &:hover {
                        background: hsl(3, 87%, 35%);
                    }
                }
            }
        }

        tr:nth-child(even) {
            background: hsl(0, 0%, 92%)
        }
    }
`;

const Grid = (props: { columns: Array<GridColumn>, data: Array<any>, noRowsMessage: string, keyColumn: string }) => {
    const {
        columns, data, noRowsMessage, keyColumn,
    } = props;

    const [gridData] = useState(data);

    return (
        <Table cellSpacing={0}>
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
                        <tr key={row[keyColumn]}>
                            {columns.map((col: GridColumn) => {
                                switch (col.Key) {
                                    case 'EDIT':
                                        return (
                                            <td key={`row_${col.Key}`}>
                                                {row.canEdit ? <button className="edit" type="button">Edit</button> : <></>}
                                            </td>
                                        );

                                    case 'DELETE':
                                        return (
                                            <td key={`row_${col.Key}`}>
                                                {row.canDelete ? <button className="delete" type="button">Delete</button> : <></>}
                                            </td>
                                        );

                                    default:
                                        return (
                                            <td key={`row_${col.Key}`}>{row[col.ColumnId]}</td>
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
        </Table>
    );
};

Grid.defaultProps = {
    columns: [],
    data: [],
    noRowsMessage: 'No rows',
};

Grid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    columns: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array,
    noRowsMessage: PropTypes.string,
    keyColumn: PropTypes.string.isRequired,
};

export { Grid };
