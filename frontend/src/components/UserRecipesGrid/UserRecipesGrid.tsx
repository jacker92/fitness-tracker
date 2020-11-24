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
import { RecipeForm } from '../RecipeForm/RecipeForm';

const UserRecipesGrid: React.FC = () => {
    const { currentUser } = useContext(AppContext);

    const newRecipe: Recipe = {
        id: 0,
        name: '',
        servings: 1,
        userId: currentUser.id,
        ingredients: [],
        isPublic: false,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        sugar: 0,
        isAlcoholic: false,
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
                calories: r.calories,
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
        await client(`recipes/getrecipe?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selRecipe: Recipe = {
                        id: data.recipe.id,
                        userId: data.recipe.userId,
                        name: data.recipe.name,
                        servings: data.recipe.servings,
                        ingredients: data.recipe.ingredients,
                        isPublic: data.recipe.isPublic,
                        calories: data.recipe.calories,
                        protein: data.recipe.protein,
                        carbohydrates: data.recipe.carbohydrates,
                        fat: data.recipe.fat,
                        sugar: data.recipe.sugar,
                        isAlcoholic: data.recipe.isAlcoholic,
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
        setErrorMessage('');

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
            Width: '55%',
            ColumnId: 'name',
            Key: 'NAME',
        },
        {
            Heading: 'Calories',
            Width: '15%',
            ColumnId: 'calories',
            Key: 'CALORIES',
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
                    <RecipeForm
                        recipe={recipe}
                        visible={formVisible}
                        onSuccess={(recipes: Array<Recipe>) => {
                            setFormVisible(false);
                            const userRecipes: Array<RecipeDataRow> = transformData(recipes);
                            setGridData(userRecipes);
                        }}
                        onCancel={() => {
                            setFormVisible(false);
                        }}
                    />

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
