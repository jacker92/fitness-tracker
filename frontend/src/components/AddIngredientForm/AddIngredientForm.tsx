import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { RecipeFoodFormProps } from '../../types/RecipeFoodFormProps';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { TextBox } from '../TextBox/TextBox';
import { FormValidator } from '../../lib/FormValidator';
import { RecipeFood } from '../../types/RecipeFood';

const AddIngredientForm: React.FC<RecipeFoodFormProps> = (props) => {
    const {
        recipeFood, nextRowId, isNew, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(recipeFood.id);
    const [foodId, setFoodId] = useState(recipeFood.foodId);
    const [food, setFood] = useState(recipeFood.food);
    const [foodName, setFoodName] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [quantity, setQuantity] = useState(recipeFood.quantity);
    const [quantityError, setQuantityError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);

    const theForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        if (recipeFood.id > 0) {
            setId(recipeFood.id);
        } else {
            setId(nextRowId);
        }

        setFoodId(recipeFood.foodId);
        setFood(recipeFood.food);
        setFoodName(`${recipeFood.food.brand} ${recipeFood.food.name}`);
        setServingSize(recipeFood.food.servingSize);
        setQuantity(recipeFood.quantity);
    }, [recipeFood, nextRowId]);

    useEffect(() => {
        if (quantityError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [quantityError]);

    const resetForm = () => {
        setId(0);
        setFoodId(0);
        setFoodName('');
        setServingSize('');
        setQuantity(1);
        setQuantityError('');
        theForm.current.reset();
    };

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateRequiredNumericGreaterThanZero(quantity)) {
            isValid = false;
            setQuantityError('Quantity must be numeric and greater than zero');
        }

        return isValid;
    };

    return (
        <ModalWindow width={400} visible={isVisible}>
            <div className="grid-form">
                <h2>
                    {isNew ? 'Add New' : 'Update' }
                    {' '}
                    Ingredient
                </h2>

                <form
                    className="autowidth"
                    method="POST"
                    ref={theForm}
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (validate()) {
                            const selIngredient: RecipeFood = {
                                id,
                                recipeId: 0,
                                foodId,
                                food,
                                quantity,
                                calories: food.calories * quantity,
                                protein: food.protein * quantity,
                                carbohydrates: food.carbohydrates * quantity,
                                fat: food.fat * quantity,
                                sugar: food.sugar * quantity,
                                isAlcoholic: food.isAlcoholic,
                            };

                            onSuccess(selIngredient);
                            resetForm();
                        }
                    }}
                >
                    <fieldset>
                        <div className="form-field">
                            <strong>Food:</strong>
                            {' '}
                            {foodName}
                        </div>

                        <div className="form-field">
                            <strong>Serving Size:</strong>
                            {' '}
                            {servingSize}
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="quantity"
                                name="quantity"
                                label="Quantity"
                                value={quantity}
                                error={quantityError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setQuantity(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setQuantity(0);
                                    }
                                }}
                                onErrorChange={(error: string) => {
                                    setQuantityError(error);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                                {isNew ? 'Add' : 'Update' }
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
                    </fieldset>
                </form>
            </div>
        </ModalWindow>
    );
};

AddIngredientForm.defaultProps = {
    isNew: true,
};

AddIngredientForm.propTypes = {
    recipeFood: PropTypes.exact({
        id: PropTypes.number,
        recipeId: PropTypes.number.isRequired,
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
    }).isRequired,
    isNew: PropTypes.bool,
    nextRowId: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { AddIngredientForm };
