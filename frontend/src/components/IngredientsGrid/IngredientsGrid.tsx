import React, {
    useState, useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { RecipeFood } from '../../types/RecipeFood';
import { GridColumn } from '../../types/GridColumn';
import { Grid } from '../Grid/Grid';
import { IngredientsGridProps } from '../../types/IngredientsGridProps';
import { IngredientDataRow } from '../../types/IngredientDataRow';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { AddIngredientSearchGrid } from '../AddIngredientSearchGrid/AddIngredientSearchGrid';
import { AddIngredientForm } from '../AddIngredientForm/AddIngredientForm';
import { AppContext } from '../AppContext/AppContext';
import { Confirm } from '../Confirm/Confirm';

const IngredientsGrid: React.FC<IngredientsGridProps> = (props) => {
    const { ingredients, onChange } = props;

    const { currentUser } = useContext(AppContext);

    const newIngredient: RecipeFood = {
        id: 0,
        recipeId: 0,
        foodId: 0,
        food: {
            id: 0,
            userId: currentUser.id,
            name: '',
            brand: '',
            servingSize: '',
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            sugar: 0,
            isAlcoholic: false,
            isPublic: false,
        },
        quantity: 1,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        sugar: 0,
    };

    const [status, setStatus] = useState('initialized');
    const [searchFoodGridVisible, setSearchFoodGridVisible] = useState(false);
    const [editIngredientFormVisible, setEditIngredientFormVisible] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(newIngredient);
    const [isNewIngredient, setIsNewIngredient] = useState(true);
    const [gridData, setGridData] = useState([]);
    const [nextRowId, setNextRowId] = useState(-1);
    const [confirmText, setConfirmText] = useState('Are you sure you want to delete this ingredient?');
    const [ingredientToDeleteId, setIngredientToDeleteId] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const transformData = useCallback((recipeFoods: Array<RecipeFood>) => {
        const foods: Array<IngredientDataRow> = [];

        recipeFoods.forEach((rf: RecipeFood) => {
            foods.push({
                id: rf.id,
                foodId: rf.food.id,
                name: `${rf.food.brand} ${rf.food.name} (${rf.food.servingSize})`,
                calories: rf.calories,
                protein: rf.protein,
                carbohydrates: rf.carbohydrates,
                fat: rf.fat,
                sugar: rf.sugar,
                isAlcoholic: rf.isAlcoholic,
                quantity: rf.quantity,
                canDelete: true,
                canEdit: true,
            });
        });

        return foods;
    }, [ingredients]);

    useEffect(() => {
        const ingredientsData: Array<IngredientDataRow> = transformData(ingredients);
        setGridData(ingredientsData);
        setStatus('loaded');
    }, [ingredients]);

    const columns: Array<GridColumn> = [
        {
            Heading: 'Name',
            Width: '50%',
            ColumnId: 'name',
            Key: 'NAME',
            CellStyle: { textAlign: 'left' },
        },
        {
            Heading: 'Quantity',
            Width: '15%',
            ColumnId: 'quantity',
            Key: 'quantity',
            CellStyle: { textAlign: 'center' },
            HeaderCellStyle: { width: '15%', textAlign: 'center' },
        },
        {
            Heading: 'Calories',
            Width: '15%',
            ColumnId: 'calories',
            Key: 'calories',
            CellStyle: { textAlign: 'center' },
            HeaderCellStyle: { width: '15%', textAlign: 'center' },
        },
        {
            Heading: ' ',
            Width: '10%',
            ColumnId: 'Edit',
            Key: 'EDIT',
        },
        {
            Heading: ' ',
            Width: '10%',
            ColumnId: 'Delete',
            Key: 'DELETE',
        },
    ];

    return (
        <>
            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <>
                    <AddIngredientSearchGrid
                        visible={searchFoodGridVisible}
                        onFoodSelected={(food: RecipeFood) => {
                            setSearchFoodGridVisible(false);
                            setSelectedIngredient(food);
                            setEditIngredientFormVisible(true);
                        }}
                        onCancel={() => {
                            setSearchFoodGridVisible(false);
                        }}
                    />

                    <AddIngredientForm
                        visible={editIngredientFormVisible}
                        isNew={isNewIngredient}
                        recipeFood={selectedIngredient}
                        nextRowId={nextRowId}
                        onSuccess={(recipeFood: RecipeFood) => {
                            const updatedGridData: Array<IngredientDataRow> = [];
                            const updatedIngredients: Array<RecipeFood> = [];

                            if (isNewIngredient) {
                                ingredients.forEach((i: RecipeFood) => {
                                    updatedIngredients.push(i);
                                });

                                updatedIngredients.push(recipeFood);

                                gridData.forEach((i) => {
                                    updatedGridData.push(i);
                                });

                                const newRow: IngredientDataRow = {
                                    id: nextRowId,
                                    foodId: recipeFood.food.id,
                                    name: `${recipeFood.food.brand} ${recipeFood.food.name} (${recipeFood.food.servingSize})`,
                                    quantity: recipeFood.quantity,
                                    calories: recipeFood.calories,
                                    protein: recipeFood.protein,
                                    carbohydrates: recipeFood.carbohydrates,
                                    fat: recipeFood.fat,
                                    sugar: recipeFood.sugar,
                                    isAlcoholic: recipeFood.isAlcoholic,
                                    canEdit: true,
                                    canDelete: true,
                                };

                                setNextRowId(recipeFood.id - 1);

                                updatedGridData.push(newRow);
                            } else {
                                ingredients.forEach((i: RecipeFood) => {
                                    if (i.foodId === recipeFood.foodId) {
                                        const updatedFood: RecipeFood = {
                                            id: i.id,
                                            recipeId: i.recipeId,
                                            foodId: i.foodId,
                                            food: recipeFood.food,
                                            quantity: recipeFood.quantity,
                                            calories: recipeFood.calories,
                                            protein: recipeFood.protein,
                                            carbohydrates: recipeFood.carbohydrates,
                                            fat: recipeFood.fat,
                                            sugar: recipeFood.sugar,
                                            isAlcoholic: recipeFood.isAlcoholic,
                                        };

                                        updatedIngredients.push(updatedFood);
                                    } else {
                                        updatedIngredients.push(i);
                                    }
                                });

                                gridData.forEach((i: IngredientDataRow) => {
                                    if (i.foodId === recipeFood.foodId) {
                                        const updatedRow: IngredientDataRow = {
                                            id: i.id,
                                            foodId: i.foodId,
                                            name: `${recipeFood.food.brand} ${recipeFood.food.name} (${recipeFood.food.servingSize})`,
                                            quantity: recipeFood.quantity,
                                            calories: recipeFood.calories,
                                            protein: recipeFood.protein,
                                            carbohydrates: recipeFood.carbohydrates,
                                            fat: recipeFood.fat,
                                            sugar: recipeFood.sugar,
                                            isAlcoholic: recipeFood.isAlcoholic,
                                            canEdit: true,
                                            canDelete: true,
                                        };

                                        updatedGridData.push(updatedRow);
                                    } else {
                                        updatedGridData.push(i);
                                    }
                                });
                            }

                            setGridData(updatedGridData);

                            setEditIngredientFormVisible(false);
                            setSelectedIngredient(newIngredient);

                            onChange(updatedIngredients);
                        }}
                        onCancel={() => {
                            setEditIngredientFormVisible(false);
                            setSelectedIngredient(newIngredient);
                        }}
                    />

                    <Confirm
                        text={confirmText}
                        visible={confirmVisible}
                        onCancel={() => {
                            setIngredientToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                        onConfirm={async () => {
                            const newIngredients: Array<RecipeFood> = [];

                            ingredients.forEach((i: RecipeFood) => {
                                if (i.id !== ingredientToDeleteId) {
                                    newIngredients.push(i);
                                }
                            });

                            onChange(newIngredients);

                            const ingredientsData: Array<IngredientDataRow> = transformData(newIngredients);
                            setGridData(ingredientsData);
                            setIngredientToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                    />

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Ingredients Added"
                        onAdd={() => {
                            setIsNewIngredient(true);
                            setSearchFoodGridVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            let recipeFood = null;
                            ingredients.forEach((i: RecipeFood) => {
                                if (i.id === id) {
                                    recipeFood = i;
                                }
                            });

                            if (recipeFood !== null) {
                                setIsNewIngredient(false);
                                setSelectedIngredient(recipeFood);
                                setEditIngredientFormVisible(true);
                            }
                        }}
                        onDelete={(id: number, foodName: string) => {
                            setIngredientToDeleteId(id);
                            setConfirmText(`Are you sure you want to delete ${foodName}?`);
                            setConfirmVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

IngredientsGrid.defaultProps = {
    ingredients: [],
};

IngredientsGrid.propTypes = {
    ingredients: PropTypes.arrayOf(PropTypes.exact({
        id: PropTypes.number,
        recipeId: PropTypes.number,
        foodId: PropTypes.number.isRequired,
        food: PropTypes.exact({
            id: PropTypes.number,
            userId: PropTypes.string,
            name: PropTypes.string.isRequired,
            brand: PropTypes.string,
            servingSize: PropTypes.string.isRequired,
            calories: PropTypes.number,
            protein: PropTypes.number,
            carbohydrates: PropTypes.number,
            fat: PropTypes.number,
            sugar: PropTypes.number,
            isAlcoholic: PropTypes.bool,
            isPublic: PropTypes.bool,
        }),
        quantity: PropTypes.number.isRequired,
        calories: PropTypes.number,
        protein: PropTypes.number,
        carbohydrates: PropTypes.number,
        fat: PropTypes.number,
        sugar: PropTypes.number,
        isAlcoholic: PropTypes.bool,
    })),
    onChange: PropTypes.func.isRequired,
};

export { IngredientsGrid };
