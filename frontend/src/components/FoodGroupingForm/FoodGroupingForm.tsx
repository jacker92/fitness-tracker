import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FoodGrouping } from '../../types/FoodGrouping';
import { FoodGroupingFormProps } from '../../types/FoodGroupingFormProps';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

const FoodGroupingForm: React.FC<FoodGroupingFormProps> = (props) => {
    const {
        foodGrouping, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(foodGrouping.id);
    const [name, setName] = useState(foodGrouping.name);
    const [sortOrder, setSortOrder] = useState(foodGrouping.sortOrder);
    const [nameError, setNameError] = useState('');
    const [sortOrderError, setSortOrderError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theFoodGroupingForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setId(foodGrouping.id);
        setName(foodGrouping.name);
        setSortOrder(foodGrouping.sortOrder);
    }, [foodGrouping]);

    useEffect(() => {
        if (nameError === '' && sortOrderError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [nameError, sortOrderError]);

    const resetForm = () => {
        setName('');
        setNameError('');
        setSortOrder(0);
        setSortOrderError('');
        setSaveDisabled(false);
        theFoodGroupingForm.current.reset();
    };

    const addFoodGrouping = (newFoodGrouping: FoodGrouping) => {
        client('foodgroupings/addfoodgrouping', {
            data: {
                name: newFoodGrouping.name,
                sortOrder: newFoodGrouping.sortOrder,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.foodGroupings);
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

    const updateFoodGrouping = (updatedFoodGrouping: FoodGrouping) => {
        client('foodgroupings/updatefoodgrouping', {
            data: {
                id: updatedFoodGrouping.id,
                name: updatedFoodGrouping.name,
                sortOrder: updatedFoodGrouping.sortOrder,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.foodGroupings);
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

        if (!FormValidator.validateRequiredNumeric(sortOrder)) {
            isValid = false;
            setNameError('Sort order is required');
        }

        return isValid;
    };

    return (
        <ModalWindow width={376} visible={isVisible}>
            <div className="grid-form">
                <h2>
                    {id > 0 ? 'Update' : 'Add New' }
                    {' '}
                    Food Grouping
                </h2>

                <ErrorMessage error={errorMessage} />

                <form
                    className="autowidth"
                    method="POST"
                    ref={theFoodGroupingForm}
                    onSubmit={async (e) => {
                        e.preventDefault();

                        if (validate()) {
                            const editedFoodGrouping: FoodGrouping = {
                                id,
                                name,
                                sortOrder,
                            };

                            if (id > 0) {
                                await updateFoodGrouping(editedFoodGrouping);
                            } else {
                                await addFoodGrouping(editedFoodGrouping);
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
                                id="sortorder"
                                name="sortorder"
                                label="Sort Order"
                                value={sortOrder}
                                error={sortOrderError}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setSortOrder(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setSortOrder(0);
                                    }
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

FoodGroupingForm.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    foodGrouping: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        sortOrder: PropTypes.number.isRequired,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { FoodGroupingForm };
