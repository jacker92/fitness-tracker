import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Form } from '../Styles/Form';
import { GridForm } from '../Styles/GridForm';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
// eslint-disable-next-line no-unused-vars
import { Gear } from '../../lib/types/Gear';

const GearForm = (props: { gear: Gear, onSuccess: Function, onCancel: Function }) => {
    const {
        gear, onSuccess, onCancel,
    } = props;

    const [id, setId] = useState(gear.id);
    const [name, setName] = useState(gear.name);
    const [nameError, setNameError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const thsGearForm = useRef(null);

    useEffect(() => {
        setId(gear.id);
        setName(gear.name);
    }, [gear]);

    useEffect(() => {
        if (nameError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [nameError]);

    const resetForm = () => {
        setId(0);
        setName('');
        setNameError('');
        setSaveDisabled(false);
        thsGearForm.current.reset();
    };

    const addGear = (newGear: Gear) => {
        client('gear/addgear', {
            data: {
                name: newGear.name,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.gear);
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

    const updateGear = (updatedGear: Gear) => {
        client('gear/updategear', {
            data: {
                id: updatedGear.id,
                name: updatedGear.name,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.gear);
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

        return isValid;
    };

    return (
        <GridForm>
            <h2>Add New Gear</h2>

            <ErrorMessage error={errorMessage} />

            <Form
                className="autowidth"
                method="POST"
                ref={thsGearForm}
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (validate()) {
                        const editedGear: Gear = {
                            id,
                            name,
                        };

                        if (id > 0) {
                            await updateGear(editedGear);
                        } else {
                            await addGear(editedGear);
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
                            onChange={(e: any) => {
                                setName(e.target.value);
                            }}
                            onErrorChange={(error: string) => {
                                setNameError(error);
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
            </Form>

        </GridForm>
    );
};

GearForm.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    gear: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { GearForm };
