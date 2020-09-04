import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Form } from '../Styles/Form';
import { GridForm } from '../Styles/GridForm';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
// eslint-disable-next-line no-unused-vars
import { Metric } from '../../lib/types/Metric';

const MetricForm = (props: { metricId: number, onSuccess: Function, onError: Function, onCancel: Function }) => {
    const {
        metricId, onSuccess, onError, onCancel,
    } = props;

    const [id, setId] = useState(metricId);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [units, setUnits] = useState('');
    const [type, setType] = useState(0);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getMetricById = useCallback(async () => {
        await client(`metrics/getmetric?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    setName(data.metric.Name);
                    setUnits(data.metric.Units);
                    setType(data.metric.Type);
                } else {
                    setErrorMessage(data.error);
                }

                console.log({ name, units, type });
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
    }, [id]);

    useEffect(() => {
        if (id !== metricId) {
            setId(metricId);
            if (metricId > 0) {
                getMetricById();
            }
        }
    }, [id, metricId, getMetricById]);

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
    };

    const addNewMetric = (metric: Metric) => {
        client('users/addcustommetric', {
            data: {
                name: metric.name,
                type: metric.type,
                units: metric.units,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.metrics);
                } else {
                    onError(data.error);
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    onError(error);
                } else if (typeof error.message === 'string') {
                    onError(error.message);
                } else {
                    onError('An error has occurred');
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
            <h2>Add New Metric</h2>

            <ErrorMessage error={errorMessage} />

            <Form
                className="autowidth"
                method="POST"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (validate()) {
                        const metric: Metric = {
                            id,
                            name,
                            units,
                            type,
                        };

                        if (id > 0) {
                            await addNewMetric(metric);
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
                        <TextBox
                            id="units"
                            name="units"
                            label="Units"
                            value={units}
                            onChange={(e: any) => {
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
                                { value: 5, text: 'String' },
                            ]}
                            requiredField
                            includeBlank={false}
                            onChange={(e: any) => {
                                setType(parseInt(e.target.value, 10));
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                            Add
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

MetricForm.propTypes = {
    metricId: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { MetricForm };
