import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MetricFormProps } from '../../types/MetricFormProps';
import { Metric } from '../../types/Metric';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { ModalWindow } from '../ModalWindow/ModalWindow';

const MetricForm: React.FC<MetricFormProps> = (props) => {
    const {
        metric, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(metric.id);
    const [name, setName] = useState(metric.name);
    const [nameError, setNameError] = useState('');
    const [units, setUnits] = useState(metric.units);
    const [showUnits, setShowUnits] = useState(metric.type === 3);
    const [type, setType] = useState(metric.type);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theMetricForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setId(metric.id);
        setName(metric.name);
        setUnits(metric.units);
        setType(metric.type);
    }, [metric]);

    useEffect(() => {
        if (nameError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [nameError]);

    const resetForm = () => {
        setName('');
        setNameError('');
        setUnits('');
        setType(0);
        setSaveDisabled(false);
        theMetricForm.current.reset();
    };

    const addNewMetric = (newMetric: Metric) => {
        client('metrics/addmetric', {
            data: {
                name: newMetric.name,
                type: newMetric.type,
                units: newMetric.units,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.metrics);
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

    const updateMetric = (updatedMetric: Metric) => {
        client('metrics/updatemetric', {
            data: {
                id: updatedMetric.id,
                name: updatedMetric.name,
                type: updatedMetric.type,
                units: updatedMetric.units,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.metrics);
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
                <h2>Add New Metric</h2>

                <ErrorMessage error={errorMessage} />

                <form
                    className="autowidth"
                    method="POST"
                    ref={theMetricForm}
                    onSubmit={async (e) => {
                        e.preventDefault();

                        if (validate()) {
                            const editedMetric: Metric = {
                                id,
                                name,
                                units,
                                type,
                            };

                            if (id > 0) {
                                await updateMetric(editedMetric);
                            } else {
                                await addNewMetric(editedMetric);
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

                        <div
                            className="form-field"
                            data-testid="units-div"
                            style={showUnits ? { display: 'block' } : { display: 'none' }}
                        >
                            <TextBox
                                id="units"
                                name="units"
                                label="Units"
                                value={units}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setUnits(e.target.value);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <SelectField
                                id="metrictype"
                                name="metrictype"
                                label="Type"
                                value={type}
                                valueList={[
                                    { value: 0, text: 'None' },
                                    { value: 1, text: 'Distance' },
                                    { value: 2, text: 'Weight' },
                                    { value: 3, text: 'Numeric' },
                                    { value: 4, text: 'Percentage' },
                                ]}
                                requiredField
                                includeBlank={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const typeVal = parseInt(e.target.value, 10);
                                    setType(typeVal);

                                    if (typeVal === 3) {
                                        setShowUnits(true);
                                    } else {
                                        setShowUnits(false);
                                        setUnits('');
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

MetricForm.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    metric: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        units: PropTypes.string.isRequired,
        type: PropTypes.number.isRequired,
        isSystem: PropTypes.bool,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { MetricForm };
