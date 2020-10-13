import React, { useState, useEffect, useContext } from 'react';
import { GridColumn } from '../../types/GridColumn';
import { FoodGroupingDataRow } from '../../types/FoodGroupingDataRow';
import { FoodGrouping } from '../../types/FoodGrouping';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { Confirm } from '../Confirm/Confirm';
import { FoodGroupingForm } from '../FoodGroupingForm/FoodGroupingForm';

const FoodGroupingsGrid: React.FC = () => {
    const newFoodGrouping: FoodGrouping = {
        id: 0, name: '', sortOrder: 0,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [foodGrouping, setFoodGrouping] = useState(newFoodGrouping);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('Are you sure you want to delete this grouping?');
    const [foodGroupingToDeleteId, setFoodGroupingToDeleteId] = useState(null);

    const { currentUser } = useContext(AppContext);

    const transformData = (groupings: Array<FoodGrouping>) => {
        const foodGroupings: Array<FoodGroupingDataRow> = [];

        groupings.forEach((fg: FoodGrouping) => {
            foodGroupings.push({
                id: fg.id,
                name: fg.name,
                sortOrder: fg.sortOrder,
                canDelete: true,
                canEdit: true,
            });
        });

        return foodGroupings;
    };

    useEffect(() => {
        client('foodgroupings/getuserfoodgroupings').then(
            (data) => {
                if (data.successful) {
                    const foodGroupings: Array<FoodGroupingDataRow> = transformData(data.foodGroupings);

                    setGridData(foodGroupings);
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

    const getFoodGroupingById = async (id: number) => {
        await client(`foodgroupings/getfoodgrouping?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selFoodGrouping: FoodGrouping = {
                        id: data.foodGrouping.id,
                        name: data.foodGrouping.name,
                        sortOrder: data.foodGrouping.sortOrder,
                    };
                    setFoodGrouping(selFoodGrouping);
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

    const deleteFoodGrouping = async (id: number) => {
        await client('foodgroupings/deletefoodgrouping', {
            data: {
                id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const foodGroupings: Array<FoodGroupingDataRow> = transformData(data.foodGroupings);

                    setGridData(foodGroupings);
                } else {
                    setErrorMessage(data.error);
                }

                setFoodGroupingToDeleteId(null);
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

                setFoodGroupingToDeleteId(null);
                setConfirmVisible(false);
            },
        );
    };

    const columns: Array<GridColumn> = [
        {
            Heading: 'Name',
            Width: '70%',
            ColumnId: 'name',
            Key: 'NAME',
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
                    <FoodGroupingForm
                        foodGrouping={foodGrouping}
                        visible={formVisible}
                        onSuccess={(groupings: Array<FoodGrouping>) => {
                            setFormVisible(false);
                            const foodGroupings: Array<FoodGroupingDataRow> = transformData(groupings);
                            setGridData(foodGroupings);
                        }}
                        onCancel={() => {
                            setFormVisible(false);
                        }}
                    />

                    <Confirm
                        text={confirmText}
                        visible={confirmVisible}
                        onCancel={() => {
                            setFoodGroupingToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                        onConfirm={async () => {
                            await deleteFoodGrouping(foodGroupingToDeleteId);
                        }}
                    />

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Food Groupings Defined"
                        onAdd={() => {
                            setFoodGrouping(newFoodGrouping);
                            setFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getFoodGroupingById(id);
                            setFormVisible(true);
                        }}
                        onDelete={async (id: number, foodGroupingName: string) => {
                            setFoodGroupingToDeleteId(id);
                            setConfirmText(`Are you sure you want to delete ${foodGroupingName}?`);
                            setConfirmVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

export { FoodGroupingsGrid };
