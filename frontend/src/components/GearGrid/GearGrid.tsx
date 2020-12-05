import React, { useState, useEffect, useContext } from 'react';
import { GridColumn } from '../../types/GridColumn';
import { Gear } from '../../types/Gear';
import { GearDataRow } from '../../types/GearDataRow';
import { client } from '../../lib/client';
import { Grid } from '../Grid/Grid';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { GearForm } from '../GearForm/GearForm';
import { Confirm } from '../Confirm/Confirm';

const GearGrid: React.FC = () => {
    const newGear: Gear = {
        id: 0, name: '', active: true,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [gear, setGear] = useState(newGear);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('Are you sure you want to delete this gear?');
    const [gearToDeleteId, setGearToDeleteId] = useState(null);

    const { currentUser } = useContext(AppContext);

    const transformData = (data: Array<Gear>) => {
        const gearData: Array<GearDataRow> = [];

        data.forEach((g: Gear) => {
            gearData.push({
                id: g.id,
                name: g.name,
                active: g.active,
                activeString: g.active ? 'Yes' : 'No',
                canEdit: true,
                canDelete: true,
            });
        });

        return gearData;
    };

    useEffect(() => {
        client('gear/getusergear').then(
            (data) => {
                if (data.successful) {
                    const gearData: Array<GearDataRow> = transformData(data.gear);

                    setGridData(gearData);
                    setStatus('loaded');
                } else {
                    setErrorMessage(data.error);
                    setStatus('errored');
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }
                setStatus('errored');
            },
        );
    }, [currentUser.id]);

    const getGearById = async (id: number) => {
        await client(`gear/get?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selGear: Gear = {
                        id: data.gear.id,
                        name: data.gear.name,
                    };
                    setGear(selGear);
                } else {
                    setErrorMessage(data.error);
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }
            },
        );
    };

    const toggleGearActive = (id: number, active: boolean) => {
        client('gear/setactiveflag', {
            data: {
                id,
                active,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const gearData: Array<GearDataRow> = transformData(data.gear);

                    setGridData(gearData);
                } else {
                    setErrorMessage(data.error);
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }
            },
        );
    };

    const deleteGear = async (id: number) => {
        await client('gear/delete', {
            data: {
                id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const gearData: Array<GearDataRow> = transformData(data.gear);
                    setGridData(gearData);
                } else {
                    setErrorMessage(data.error);
                }

                setGearToDeleteId(null);
                setConfirmVisible(false);
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }

                setGearToDeleteId(null);
                setConfirmVisible(false);
            },
        );
    };

    const columns: Array<GridColumn> = [
        {
            Heading: 'Name',
            Width: '35%',
            ColumnId: 'name',
            Key: 'NAME',
            CellStyle: { textAlign: 'left' },
        },
        {
            Heading: 'Active',
            Width: '15%',
            ColumnId: 'activeString',
            Key: 'ACTIVE',
            CellStyle: { textAlign: 'center' },
        },
        {
            Heading: ' ',
            Width: '20%',
            ColumnId: 'toggleactive',
            Key: 'TOGGLEACTIVE',
        },
        {
            Heading: ' ',
            Width: '15%',
            ColumnId: 'Edit',
            Key: 'EDIT',
        },
        {
            Heading: ' ',
            Width: '15%',
            ColumnId: 'Delete',
            Key: 'DELETE',
        },
    ];

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <>
                    <GearForm
                        gear={gear}
                        visible={formVisible}
                        onSuccess={(data: Array<Gear>) => {
                            setFormVisible(false);
                            const gearData: Array<GearDataRow> = transformData(data);
                            setGridData(gearData);
                        }}
                        onCancel={() => {
                            setFormVisible(false);
                        }}
                    />

                    <Confirm
                        text={confirmText}
                        visible={confirmVisible}
                        onCancel={() => {
                            setGearToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                        onConfirm={async () => {
                            await deleteGear(gearToDeleteId);
                        }}
                    />

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Gear"
                        onToggleActive={(id: number, active: boolean) => {
                            toggleGearActive(id, !active);
                        }}
                        onAdd={() => {
                            setGear(newGear);
                            setFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getGearById(id);
                            setFormVisible(true);
                        }}
                        onDelete={(id: number, gearName: string) => {
                            setGearToDeleteId(id);
                            setConfirmText(`Are you sure you want to delete ${gearName}?`);
                            setConfirmVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

export { GearGrid };
