import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Form } from '../Styles/Form';
import { GridForm } from '../Styles/GridForm';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
// eslint-disable-next-line no-unused-vars
import { Metric } from '../../lib/types/Metric';

const AddMetricForm = (props: { onSuccess: Function, onError: Function, onCancel: Function, visible: boolean }) => {
    const {
        onSuccess, onError, onCancel, visible,
    } = props;

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [units, setUnits] = useState('');
    const [type, setType] = useState(0);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [formVisible, setFormVisible] = useState(visible);

    useEffect(() => {
        setFormVisible(visible);
    }, [visible]);

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
        <GridForm style={formVisible ? { display: 'block' } : { display: 'none' }}>
            <h2>Add New Metric</h2>
            <Form
                className="autowidth"
                method="POST"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (validate()) {
                        const metric: Metric = {
                            name,
                            units,
                            type,
                        };

                        await addNewMetric(metric);
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

AddMetricForm.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
};

export { AddMetricForm };
