import React, {
    useContext, useState, useEffect, useCallback,
} from 'react';
import { GridColumn } from '../../types/GridColumn';
import { RecipeDataRow } from '../../types/RecipeDataRow';
import { Recipe } from '../../types/Recipe';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { Confirm } from '../Confirm/Confirm';

const UserRecipesGrid: React.FC = () => {
    const { currentUser } = useContext(AppContext);

    const newRecipe: Recipe = {
        id: 0,
        name: '',
        servings: 1,
        userId: currentUser.id,
        ingredients: [],
        isPublic: false,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [recipe, setRecipe] = useState(newRecipe);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('Are you sure you want to delete this recipe?');
    const [recipeToDeleteId, setRecipeToDeleteId] = useState(null);

    const transformData = useCallback((userRecipes: Array<Recipe>) => {
        const recipes: Array<RecipeDataRow> = [];

        userRecipes.forEach((r: Recipe) => {
            recipes.push({
                id: r.id,
                name: r.name,
                canDelete: r.userId === currentUser.id,
                canEdit: r.userId === currentUser.id,
            });
        });

        return recipes;
    }, [currentUser.id]);

    useEffect(() => {
        client('recipes/getuserrecipes').then(
            (data) => {
                if (data.successful) {
                    const userRecipes: Array<RecipeDataRow> = transformData(data.recipes);

                    setGridData(userRecipes);
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

    const getRecipeById = async (id: number) => {
        await client(`recipes/getrecipes?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selRecipe: Recipe = {
                        id: data.recipe.id,
                        userId: data.recipe.userId,
                        name: data.recipe.name,
                        servings: data.recipe.servings,
                        ingredients: data.recipe.ingredients,
                        isPublic: data.recipe.isPublic,
                    };

                    setRecipe(selRecipe);
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

    const deleteRecipe = async (id: number) => {
        await client('recipes/deleterecipe', {
            data: {
                id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const userRecipes: Array<RecipeDataRow> = transformData(data.recipes);

                    setGridData(userRecipes);
                } else {
                    setErrorMessage(data.error);
                }

                setRecipeToDeleteId(null);
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

                setRecipeToDeleteId(null);
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
                    {/* <CustomFoodForm
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
                    /> */}

                    <Confirm
                        text={confirmText}
                        visible={confirmVisible}
                        onCancel={() => {
                            setRecipeToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                        onConfirm={async () => {
                            await deleteRecipe(recipeToDeleteId);
                        }}
                    />

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Recipes Defined"
                        onAdd={() => {
                            setRecipe(newRecipe);
                            setFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getRecipeById(id);
                            setFormVisible(true);
                        }}
                        onDelete={async (id: number, recipeName: string) => {
                            setRecipeToDeleteId(id);
                            setConfirmText(`Are you sure you want to delete ${recipeName}?`);
                            setConfirmVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

export { UserRecipesGrid };
