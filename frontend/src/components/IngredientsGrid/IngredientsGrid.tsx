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

    const transformData = useCallback((recipeFoods: Array<RecipeFood>) => {
        const foods: Array<IngredientDataRow> = [];

        recipeFoods.forEach((rf: RecipeFood) => {
            foods.push({
                id: rf.id,
                foodId: rf.food.id,
                name: rf.food.name,
                calories: rf.calories,
                protein: rf.protein,
                carbohydrates: rf.carbohydrates,
                fat: rf.fat,
                sugar: rf.sugar,
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
                                    id: 0,
                                    foodId: recipeFood.food.id,
                                    name: recipeFood.food.name,
                                    quantity: recipeFood.quantity,
                                    calories: recipeFood.calories,
                                    protein: recipeFood.protein,
                                    carbohydrates: recipeFood.carbohydrates,
                                    fat: recipeFood.fat,
                                    sugar: recipeFood.sugar,
                                    canEdit: true,
                                    canDelete: true,
                                };

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
                                            name: i.name,
                                            quantity: recipeFood.quantity,
                                            calories: recipeFood.calories,
                                            protein: recipeFood.protein,
                                            carbohydrates: recipeFood.carbohydrates,
                                            fat: recipeFood.fat,
                                            sugar: recipeFood.sugar,
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

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="foodId"
                        noRowsMessage="No Ingredients Added"
                        onAdd={() => {
                            setIsNewIngredient(true);
                            setSearchFoodGridVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            let recipeFood = null;
                            ingredients.forEach((i: RecipeFood) => {
                                if (i.foodId === id) {
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
                            // setGearToDeleteId(id);
                            // setConfirmText(`Are you sure you want to delete ${gearName}?`);
                            // setConfirmVisible(true);
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
    })),
    onChange: PropTypes.func.isRequired,
};

export { IngredientsGrid };
