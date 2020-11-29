import React, {
    forwardRef, useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { AddIngredientSearchGridProps } from '../../types/AddIngredientSearchGridProps';
import { GridColumn } from '../../types/GridColumn';
import { client } from '../../lib/client';
import { Grid } from '../Grid/Grid';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { TextBox } from '../TextBox/TextBox';
import { CustomFood } from '../../types/CustomFood';
import { RecipeFood } from '../../types/RecipeFood';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { CustomFoodDataRow } from '../../types/CustomFoodDataRow';
import { FormValidator } from '../../lib/FormValidator';

const AddIngredientSearchGrid: React.FC<AddIngredientSearchGridProps> = (props) => {
    const { visible, onFoodSelected, onCancel } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [searchTerms, setSearchTerms] = useState('');
    const [searchTermsError, setSearchTermsError] = useState('');
    const [gridData, setGridData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const theForm = useRef(null);
    const searchElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsVisible(visible);
        if (visible && searchElement !== null) {
            searchElement.current.focus();
        }
    }, [visible]);

    const transformData = (foods: Array<CustomFood>) => {
        const customFoods: Array<CustomFoodDataRow> = [];

        foods.forEach((f: CustomFood) => {
            customFoods.push({
                id: f.id,
                name: f.name,
                brand: f.brand,
                canDelete: false,
                canEdit: false,
            });
        });

        return customFoods;
    };

    const searchFoods = async () => {
        await client(`foods/search?keywords=${searchTerms}`).then(
            (data) => {
                if (data.successful) {
                    const foods: Array<CustomFoodDataRow> = transformData(data.foods);

                    setGridData(foods);
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

    const resetForm = () => {
        setSearchTerms('');
        setSearchTermsError('');
        setGridData([]);
        theForm.current.reset();
    };

    const getFoodById = async (id: number) => {
        await client(`foods/getfood?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selFood: CustomFood = {
                        id: data.food.id,
                        userId: data.food.userId,
                        name: data.food.name,
                        brand: data.food.brand,
                        servingSize: data.food.servingSize,
                        calories: data.food.calories,
                        protein: data.food.protein,
                        carbohydrates: data.food.carbohydrates,
                        fat: data.food.fat,
                        sugar: data.food.sugar,
                        isAlcoholic: data.food.isAlcoholic,
                        isPublic: data.food.isPublic,
                    };

                    const selIngredient: RecipeFood = {
                        id: 0,
                        recipeId: 0,
                        foodId: selFood.id,
                        food: selFood,
                        quantity: 1,
                        calories: selFood.calories,
                        protein: selFood.protein,
                        carbohydrates: selFood.carbohydrates,
                        fat: selFood.fat,
                        sugar: selFood.sugar,
                        isAlcoholic: selFood.isAlcoholic,
                    };

                    onFoodSelected(selIngredient);
                    resetForm();
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

    const columns: Array<GridColumn> = [
        {
            Heading: 'Name',
            Width: '60%',
            ColumnId: 'name',
            Key: 'NAME',
        },
        {
            Heading: 'Brand',
            Width: '25%',
            ColumnId: 'brand',
            Key: 'BRAND',
        },
        {
            Heading: ' ',
            Width: '15%',
            ColumnId: 'Add',
            Key: 'ADD',
        },
    ];

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(searchTerms)) {
            isValid = false;
            setSearchTermsError('Please enter some search terms');
        }

        return isValid;
    };

    const SearchTextfield = forwardRef<HTMLInputElement>((_forwardProps, ref) => (
        <TextBox
            ref={ref}
            id="searchterms"
            name="searchterms"
            label="Search Terms"
            value={searchTerms}
            error={searchTermsError}
            validationRule="notempty"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerms(e.target.value);
            }}
            onErrorChange={(error: string) => {
                setSearchTermsError(error);
            }}
        />
    ));

    return (
        <ModalWindow width={800} visible={isVisible}>
            <div className="modal-window-content">
                <h2>Add Ingredient</h2>

                <ErrorMessage error={errorMessage} />

                <div className="add-ingredient-form">
                    <form
                        method="GET"
                        ref={theForm}
                        onSubmit={async (e) => {
                            e.preventDefault();

                            if (validate()) {
                                searchFoods();
                            }
                        }}
                    >
                        <div className="form-field">
                            <SearchTextfield ref={searchElement} />
                        </div>

                        <div className="form-field">
                            <button type="submit">Search</button>

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
                    </form>
                </div>
                <div className="add-ingredient-results-grid">
                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Foods Found"
                        onRowAdd={async (id: number) => {
                            await getFoodById(id);
                        }}
                    />
                </div>
            </div>
        </ModalWindow>
    );
};

AddIngredientSearchGrid.propTypes = {
    visible: PropTypes.bool.isRequired,
    onFoodSelected: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { AddIngredientSearchGrid };
