import React, {
    useState, useEffect, useContext, useCallback,
} from 'react';
import { GridColumn } from '../../types/GridColumn';
import { CustomFoodDataRow } from '../../types/CustomFoodDataRow';
import { CustomFood } from '../../types/CustomFood';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { Confirm } from '../Confirm/Confirm';
import { CustomFoodForm } from '../CustomFoodForm/CustomFoodForm';

const CustomFoodsGrid: React.FC = () => {
    const { currentUser } = useContext(AppContext);

    const newFood: CustomFood = {
        id: 0,
        userId: currentUser.id,
        name: '',
        servingSize: '',
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        sugar: 0,
        isAlcoholic: false,
        isPublic: false,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [food, setFood] = useState(newFood);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('Are you sure you want to delete this food?');
    const [foodToDeleteId, setFoodToDeleteId] = useState(null);

    const transformData = useCallback((foods: Array<CustomFood>) => {
        const customFoods: Array<CustomFoodDataRow> = [];

        foods.forEach((f: CustomFood) => {
            customFoods.push({
                id: f.id,
                name: f.name,
                canDelete: f.userId === currentUser.id,
                canEdit: f.userId === currentUser.id,
            });
        });

        return customFoods;
    }, [currentUser.id]);

    useEffect(() => {
        client('foods/getusercustomfoods').then(
            (data) => {
                if (data.successful) {
                    const customFoods: Array<CustomFoodDataRow> = transformData(data.foods);

                    setGridData(customFoods);
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
    }, [currentUser.id, transformData]);

    const getFoodById = async (id: number) => {
        await client(`foods/getfood?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selFood: CustomFood = {
                        id: data.food.id,
                        userId: data.food.userId,
                        name: data.food.name,
                        servingSize: data.food.servingSize,
                        calories: data.food.calories,
                        protein: data.food.protein,
                        carbohydrates: data.food.carbohydrates,
                        fat: data.food.fat,
                        sugar: data.food.sugar,
                        isAlcoholic: data.food.isAlcoholic,
                        isPublic: data.food.isPublic,
                    };

                    setFood(selFood);
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

    const deleteFood = async (id: number) => {
        await client('foods/deletefood', {
            data: {
                id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const customFoods: Array<CustomFoodDataRow> = transformData(data.foods);

                    setGridData(customFoods);
                } else {
                    setErrorMessage(data.error);
                }

                setFoodToDeleteId(null);
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

                setFoodToDeleteId(null);
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
                    <CustomFoodForm
                        food={food}
                        visible={formVisible}
                        onSuccess={(foods: Array<CustomFood>) => {
                            setFormVisible(false);
                            const customFoods: Array<CustomFoodDataRow> = transformData(foods);
                            setGridData(customFoods);
                        }}
                        onCancel={() => {
                            setFormVisible(false);
                        }}
                    />

                    <Confirm
                        text={confirmText}
                        visible={confirmVisible}
                        onCancel={() => {
                            setFoodToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                        onConfirm={async () => {
                            await deleteFood(foodToDeleteId);
                        }}
                    />

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Custom Foods Defined"
                        onAdd={() => {
                            setFood(newFood);
                            setFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getFoodById(id);
                            setFormVisible(true);
                        }}
                        onDelete={async (id: number, foodName: string) => {
                            setFoodToDeleteId(id);
                            setConfirmText(`Are you sure you want to delete ${foodName}?`);
                            setConfirmVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

export { CustomFoodsGrid };
