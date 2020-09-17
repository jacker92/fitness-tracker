import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Gear } from '../../types/Gear';
import { GearFormProps } from '../../types/GearFormProps';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { TextBox } from '../TextBox/TextBox';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

const GearForm: React.FC<GearFormProps> = (props) => {
    const {
        gear, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(gear.id);
    const [name, setName] = useState(gear.name);
    const [nameError, setNameError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const thsGearForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

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
        <ModalWindow width={376} visible={isVisible}>
            <div className="grid-form">
                <h2>Add New Gear</h2>

                <ErrorMessage error={errorMessage} />

                <form
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                </form>
            </div>
        </ModalWindow>
    );
};

GearForm.propTypes = {
    gear: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        active: PropTypes.bool,
        activeString: PropTypes.string,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { GearForm };
