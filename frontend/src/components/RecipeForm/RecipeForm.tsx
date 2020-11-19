import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { RecipeFood } from '../../types/RecipeFood';
import { RecipeFormProps } from '../../types/RecipeFormProps';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { TextBox } from '../TextBox/TextBox';
import { Checkbox } from '../Checkbox/Checkbox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { IngredientsGrid } from '../IngredientsGrid/IngredientsGrid';

import './RecipeForm.css';

const RecipeForm: React.FC<RecipeFormProps> = (props) => {
    const {
        recipe, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(recipe.id);
    const [name, setName] = useState(recipe.name);
    const [nameError, setNameError] = useState('');
    const [servings, setServings] = useState(recipe.servings);
    const [servingsError, setServingsError] = useState('');
    const [isPublic, setIsPublic] = useState(recipe.isPublic);
    const [isAlcoholic, setIsAlcoholic] = useState(recipe.isAlcoholic);
    const [ingredients, setIngredients] = useState([]);
    const [calories, setCalories] = useState(recipe.calories);
    const [protein, setProtein] = useState(recipe.protein);
    const [carbohydrates, setCarbohydrates] = useState(recipe.carbohydrates);
    const [fat, setFat] = useState(recipe.fat);
    const [sugar, setSugar] = useState(recipe.sugar);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theRecipeForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setId(recipe.id);
        setName(recipe.name);
        setServings(recipe.servings);
        setCalories(recipe.calories);
        setProtein(recipe.protein);
        setCarbohydrates(recipe.carbohydrates);
        setFat(recipe.fat);
        setSugar(recipe.sugar);
        setIsPublic(recipe.isPublic);
        setIsAlcoholic(recipe.isAlcoholic);
        setIngredients(recipe.ingredients);
    }, [recipe]);

    useEffect(() => {
        if (nameError === ''
            && servingsError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [nameError, servingsError]);

    useEffect(() => {
        const nutritionInfo = {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            sugar: 0,
        };

        ingredients.forEach((i: RecipeFood) => {
            nutritionInfo.calories += i.calories;
            nutritionInfo.protein += i.protein;
            nutritionInfo.carbohydrates += i.carbohydrates;
            nutritionInfo.fat += i.fat;
            nutritionInfo.sugar += i.sugar;
        });

        if (servings === 0) {
            setCalories(0);
            setProtein(0);
            setCarbohydrates(0);
            setFat(0);
            setSugar(0);
        } else {
            setCalories(Math.round(nutritionInfo.calories / servings));
            setProtein(Math.round(nutritionInfo.protein / servings));
            setCarbohydrates(Math.round(nutritionInfo.carbohydrates / servings));
            setFat(Math.round(nutritionInfo.fat / servings));
            setSugar(Math.round(nutritionInfo.sugar / servings));
        }
    }, [ingredients, servings]);

    const resetForm = () => {
        setName('');
        setNameError('');
        setServings(0);
        setServingsError('');
        setIsPublic(false);
        setSaveDisabled(false);
        theRecipeForm.current.reset();
    };

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(name)) {
            setNameError('Name is required');
            isValid = false;
        }

        if (!FormValidator.validateRequiredNumericGreaterThanZero(servings)) {
            setServingsError('There must be more than zero servings');
            isValid = false;
        }

        if (ingredients.length === 0) {
            setErrorMessage('Please enter at least 1 ingredient');
            isValid = false;
        }

        return isValid;
    };

    const saveRecipe = async () => {
        const recipeFoods: Array<RecipeFood> = [];

        ingredients.forEach((i) => {
            recipeFoods.push({
                id: i.id,
                foodId: i.food.id,
                quantity: i.quantity,
                recipeId: i.recipeId,
            });
        });

        await client('recipes/save', {
            data: {
                id,
                name,
                servings,
                isPublic,
                ingredients: recipeFoods,
                calories,
                protein,
                carbohydrates,
                fat,
                sugar,
                isAlcoholic,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.recipes);
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

    return (
        <ModalWindow width={1000} visible={isVisible}>
            <div className="grid-form">
                <h2>
                    {id > 0 ? 'Update' : 'Add New' }
                    {' '}
                    Recipe
                </h2>

                <ErrorMessage error={errorMessage} />

                <form
                    className="autowidth"
                    method="POST"
                    ref={theRecipeForm}
                    onSubmit={async (e) => {
                        e.preventDefault();

                        if (validate()) {
                            await saveRecipe();
                        }
                    }}
                >
                    <fieldset>
                        <div className="two-columns">
                            <div className="column-one">
                                <div className="form-field">
                                    <TextBox
                                        id="name"
                                        name="name"
                                        label="Name"
                                        value={name}
                                        error={nameError}
                                        validationRule="notempty"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setName(e.target.value);
                                        }}
                                        onErrorChange={(error: string) => {
                                            setNameError(error);
                                        }}
                                    />
                                </div>

                                <div className="form-field">
                                    <TextBox
                                        id="servings"
                                        name="servings"
                                        label="Servings"
                                        value={servings}
                                        error={servingsError}
                                        validationRule="notempty"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.value !== '') {
                                                if (!Number.isNaN(e.target.value)) {
                                                    setServings(parseInt(e.target.value, 10));
                                                }
                                            } else {
                                                setServings(1);
                                            }
                                        }}
                                        onErrorChange={(error: string) => {
                                            setServingsError(error);
                                        }}
                                    />
                                </div>

                                <div className="form-field">
                                    <Checkbox
                                        id="public"
                                        name="public"
                                        label="Public"
                                        value={1}
                                        isChecked={isPublic}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setIsPublic(e.target.checked);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="column-two">
                                <div className="nutrition-information">
                                    <h3>Nutrition</h3>
                                    <div>
                                        <strong>Calories:</strong>
                                        {' '}
                                        {calories}
                                    </div>
                                    <div>
                                        <strong>Protein:</strong>
                                        {' '}
                                        {protein}
                                        g
                                    </div>
                                    <div>
                                        <strong>Carbohydrates:</strong>
                                        {' '}
                                        {carbohydrates}
                                        g
                                    </div>
                                    <div>
                                        <strong>Fat:</strong>
                                        {' '}
                                        {fat}
                                        g
                                    </div>
                                    <div>
                                        <strong>Sugar:</strong>
                                        {' '}
                                        {sugar}
                                        g
                                    </div>
                                </div>

                                <div className="form-field">
                                    <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                                        Save Recipe
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            onCancel();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <div className="recipe-form-ingredients">
                    <h3>Ingredients</h3>
                    <IngredientsGrid
                        ingredients={ingredients}
                        onChange={(i: Array<RecipeFood>) => {
                            setIngredients(i);

                            const alcoholicIngredients = i.filter((ing) => ing.isAlcoholic === true);

                            if (alcoholicIngredients.length > 0) {
                                setIsAlcoholic(true);
                            } else {
                                setIsAlcoholic(false);
                            }
                        }}
                    />
                </div>
            </div>
        </ModalWindow>
    );
};

RecipeForm.propTypes = {
    recipe: PropTypes.exact({
        id: PropTypes.number.isRequired,
        userId: PropTypes.string,
        name: PropTypes.string.isRequired,
        servings: PropTypes.number.isRequired,
        isPublic: PropTypes.bool.isRequired,
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
        calories: PropTypes.number,
        protein: PropTypes.number,
        carbohydrates: PropTypes.number,
        fat: PropTypes.number,
        sugar: PropTypes.number,
        isAlcoholic: PropTypes.bool,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { RecipeForm };
