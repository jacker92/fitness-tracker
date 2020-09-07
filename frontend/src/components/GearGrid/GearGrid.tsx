import React, { useState, useEffect, useContext } from 'react';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { GearForm } from '../GearForm/GearForm';
// eslint-disable-next-line no-unused-vars
import { GridColumn } from '../../lib/types/GridColumn';
// eslint-disable-next-line no-unused-vars
import { Gear } from '../../lib/types/Gear';
// eslint-disable-next-line no-unused-vars
import { GearDataRow } from '../../lib/types/GearDataRow';

const GearGrid = () => {
    const newGear: Gear = {
        id: 0, name: '', active: true,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [gear, setGear] = useState(newGear);
    const [addFormVisible, setAddFormVisible] = useState(false);

    const { currentUser } = useContext(AppContext);

    const transformData = (data: any) => {
        const gearData: Array<GearDataRow> = [];

        data.forEach((g: any) => {
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
        client('users/getusergear').then(
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
        await client(`gear/getgear?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selGear: Gear = {
                        id: data.id,
                        name: data.name,
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
        client('gear/setgearactiveflag', {
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
        await client('gear/deletegear', {
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

    const columns: Array<GridColumn> = [
        {
            Heading: 'Name',
            Width: '35%',
            ColumnId: 'name',
            Key: 'NAME',
        },
        {
            Heading: 'Active',
            Width: '15%',
            ColumnId: 'activeString',
            Key: 'ACTIVE',
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
                    <ModalWindow
                        width={460}
                        height="auto"
                        visible={addFormVisible}
                    >
                        <GearForm
                            gear={gear}
                            onSuccess={(data: any) => {
                                setAddFormVisible(false);
                                const gearData: Array<GearDataRow> = transformData(data);
                                setGridData(gearData);
                            }}
                            onCancel={() => {
                                setAddFormVisible(false);
                            }}
                        />
                    </ModalWindow>
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
                            setAddFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getGearById(id);
                            setAddFormVisible(true);
                        }}
                        onDelete={async (id: number) => {
                            // eslint-disable-next-line max-len, no-alert
                            if (window.confirm('Are you sure you want to delete this gear?')) {
                                await deleteGear(id);
                            }
                        }}
                    />
                </>
            )}
        </>
    );
};

export { GearGrid };
