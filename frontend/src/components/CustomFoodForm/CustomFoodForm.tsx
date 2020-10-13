import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CustomFood } from '../../types/CustomFood';
import { CustomFoodFormProps } from '../../types/CustomFoodFormProps';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { TextBox } from '../TextBox/TextBox';
import { Checkbox } from '../Checkbox/Checkbox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

const CustomFoodForm: React.FC<CustomFoodFormProps> = (props) => {
    const {
        food, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(food.id);
    const [name, setName] = useState(food.name);
    const [calories, setCalories] = useState(food.calories);
    const [protein, setProtein] = useState(food.protein);
    const [carbohydrates, setCarbohydrates] = useState(food.carbohydrates);
    const [fat, setFat] = useState(food.fat);
    const [sugar, setSugar] = useState(food.sugar);
    const [isAlcoholic, setIsAlcoholic] = useState(food.isAlcoholic);
    const [isPublic, setIsPublic] = useState(food.isPublic);
    const [nameError, setNameError] = useState('');
    const [caloriesError, setCaloriesError] = useState('');
    const [proteinError, setProteinError] = useState('');
    const [carbohydratesError, setCarbohydratesError] = useState('');
    const [fatError, setFatError] = useState('');
    const [sugarError, setSugarError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theFoodForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setId(food.id);
        setName(food.name);
        setCalories(food.calories);
        setProtein(food.protein);
        setCarbohydrates(food.carbohydrates);
        setFat(food.fat);
        setSugar(food.sugar);
        setIsAlcoholic(food.isAlcoholic);
        setIsPublic(food.isPublic);
    }, [food]);

    useEffect(() => {
        if (nameError === ''
            && caloriesError === ''
            && proteinError === ''
            && carbohydratesError === ''
            && fatError === ''
            && sugarError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [nameError, caloriesError, proteinError, carbohydratesError, fatError, sugarError]);

    const resetForm = () => {
        setName('');
        setNameError('');
        setCalories(0);
        setCaloriesError('');
        setProtein(0);
        setProteinError('');
        setCarbohydrates(0);
        setCarbohydratesError('');
        setFat(0);
        setFatError('');
        setSugar(0);
        setSugarError('');
        setIsAlcoholic(false);
        setIsPublic(false);
        setSaveDisabled(false);
        theFoodForm.current.reset();
    };

    const addFood = (newFood: CustomFood) => {
        client('foods/addfood', {
            data: {
                name: newFood.name,
                calories: newFood.calories,
                protein: newFood.protein,
                carbohydrates: newFood.carbohydrates,
                fat: newFood.fat,
                sugar: newFood.sugar,
                isAlcoholic: newFood.isAlcoholic,
                isPublic: newFood.isPublic,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.foods);
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

    const updateFood = (updatedFood: CustomFood) => {
        client('foods/updatefood', {
            data: {
                id: updatedFood.id,
                name: updatedFood.name,
                calories: updatedFood.calories,
                protein: updatedFood.protein,
                carbohydrates: updatedFood.carbohydrates,
                fat: updatedFood.fat,
                sugar: updatedFood.sugar,
                isAlcoholic: updatedFood.isAlcoholic,
                isPublic: updatedFood.isPublic,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.foods);
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

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(name)) {
            isValid = false;
            setNameError('Name is required');
        }

        if (!FormValidator.validateNumeric(calories)) {
            isValid = false;
            setNameError('Calories must be numeric');
        }

        if (!FormValidator.validateNumeric(protein)) {
            isValid = false;
            setNameError('Protein must be numeric');
        }

        if (!FormValidator.validateNumeric(carbohydrates)) {
            isValid = false;
            setNameError('Carbohydrates must be numeric');
        }

        if (!FormValidator.validateNumeric(fat)) {
            isValid = false;
            setNameError('Fat must be numeric');
        }

        if (!FormValidator.validateNumeric(sugar)) {
            isValid = false;
            setNameError('Sugar must be numeric');
        }

        return isValid;
    };

    return (
        <ModalWindow width={376} visible={isVisible}>
            <div className="grid-form">
                <h2>
                    {id > 0 ? 'Update' : 'Add New' }
                    {' '}
                    Food
                </h2>

                <ErrorMessage error={errorMessage} />

                <form
                    className="autowidth"
                    method="POST"
                    ref={theFoodForm}
                    onSubmit={async (e) => {
                        e.preventDefault();

                        if (validate()) {
                            const editedFood: CustomFood = {
                                id,
                                name,
                                calories,
                                protein,
                                carbohydrates,
                                fat,
                                sugar,
                                isAlcoholic,
                                isPublic,
                            };

                            if (id > 0) {
                                await updateFood(editedFood);
                            } else {
                                await addFood(editedFood);
                            }
                        }
                    }}
                >
                    <fieldset>
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
                                id="calories"
                                name="calories"
                                label="Calories"
                                value={calories}
                                error={caloriesError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setCalories(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setCalories(0);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="protein"
                                name="protein"
                                label="Protein (g)"
                                value={protein}
                                error={proteinError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setProtein(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setProtein(0);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="carbohydrates"
                                name="carbohydrates"
                                label="Carbohydrates (g)"
                                value={carbohydrates}
                                error={carbohydratesError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setCarbohydrates(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setCarbohydrates(0);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="fat"
                                name="fat"
                                label="Fat (g)"
                                value={calories}
                                error={fatError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setFat(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setFat(0);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="sugar"
                                name="sugar"
                                label="Sugar (g)"
                                value={sugar}
                                error={sugarError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setSugar(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setSugar(0);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <Checkbox
                                id="alcholic"
                                name="alcoholic"
                                label="Alcoholic"
                                value={1}
                                isChecked={isAlcoholic}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setIsAlcoholic(e.target.checked);
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

                        <div className="form-field">
                            <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                                {id > 0 ? 'Update' : 'Add' }
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

CustomFoodForm.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    food: PropTypes.exact({
        id: PropTypes.number,
        userId: PropTypes.string,
        name: PropTypes.string.isRequired,
        calories: PropTypes.number,
        protein: PropTypes.number,
        carbohydrates: PropTypes.number,
        fat: PropTypes.number,
        sugar: PropTypes.number,
        isAlcoholic: PropTypes.bool,
        isPublic: PropTypes.bool,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { CustomFoodForm };
