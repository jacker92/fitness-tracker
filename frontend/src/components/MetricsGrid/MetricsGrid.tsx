import React, { useState, useEffect, useContext } from 'react';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { MetricForm } from '../MetricForm/MetricForm';
import { ModalWindow } from '../ModalWindow/ModalWindow';
// eslint-disable-next-line no-unused-vars
import { GridColumn } from '../../lib/types/GridColumn';
// eslint-disable-next-line no-unused-vars
import { UserTrackedMetric } from '../../lib/types/UserTrackedMetric';
// eslint-disable-next-line no-unused-vars
import { Metric } from '../../lib/types/Metric';

const MetricsGrid = () => {
    const newMetric: Metric = {
        id: 0, name: '', units: '', type: 0,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [metric, setMetric] = useState(newMetric);
    const [addFormVisible, setAddFormVisible] = useState(false);

    const { currentUser } = useContext(AppContext);

    const transformData = (metrics: any) => {
        const trackedMetrics: Array<UserTrackedMetric> = [];

        metrics.forEach((m: any) => {
            trackedMetrics.push({
                ID: m.MetricID,
                Name: m.Metric.Name,
                isTracked: m.IsTracked,
                canDelete: !m.Metric.IsSystem,
                canEdit: !m.Metric.IsSystem,
            });
        });

        return trackedMetrics;
    };

    useEffect(() => {
        client('users/getusertrackedmetrics').then(
            (data) => {
                if (data.successful) {
                    const trackedMetrics: Array<UserTrackedMetric> = transformData(data.metrics);

                    setGridData(trackedMetrics);
                    setStatus('loaded');
                } else {
                    setErrorMessage(data.error);
                    setStatus('errored');
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
                setStatus('errored');
            },
        );
    }, [currentUser.id]);

    const getMetricById = async (id: number) => {
        await client(`metrics/getmetric?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selMetric: Metric = {
                        id: data.metric.ID,
                        name: data.metric.Name,
                        units: data.metric.Units,
                        type: data.metric.Type,
                    };
                    setMetric(selMetric);
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

    const toggleTracking = (id: number) => {
        client('users/toggleusertrackedmetric', {
            data: {
                userTrackedMetricId: id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const trackedMetrics: Array<UserTrackedMetric> = transformData(data.metrics);

                    setGridData(trackedMetrics);
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

    const deleteMetric = async (id: number) => {
        await client('metrics/deletemetric', {
            data: {
                id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const trackedMetrics: Array<UserTrackedMetric> = transformData(data.metrics);

                    setGridData(trackedMetrics);
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
            Width: '55%',
            ColumnId: 'Name',
            Key: 'NAME',
        },
        {
            Heading: ' ',
            Width: '15%',
            ColumnId: 'track',
            Key: 'TRACK',
        },
        {
            Heading: ' ',
            Width: '15%',
            ColumnId: 'Edit',
            Key: 'EDIT',
        },
        {
            Heading: ' ',
            Width: '15%',
            ColumnId: 'Delete',
            Key: 'DELETE',
        },
    ];

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <>
                    <ModalWindow
                        width={460}
                        height="auto"
                        visible={addFormVisible}
                    >
                        <MetricForm
                            metric={metric}
                            onSuccess={(metrics: any) => {
                                setAddFormVisible(false);
                                const trackedMetrics: Array<UserTrackedMetric> = transformData(metrics);
                                setGridData(trackedMetrics);
                            }}
                            onCancel={() => {
                                setAddFormVisible(false);
                            }}
                        />
                    </ModalWindow>
                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="ID"
                        noRowsMessage="No Metrics Defined"
                        onTrackChange={(id: number) => {
                            toggleTracking(id);
                        }}
                        onAdd={() => {
                            setMetric(newMetric);
                            setAddFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getMetricById(id);
                            setAddFormVisible(true);
                        }}
                        onDelete={async (id: number) => {
                            // eslint-disable-next-line no-alert
                            if (window.confirm('Are you sure you want to delete this metric? All entries associated with it will be deleted as well. Untracking it will allow you to keep your data while hiding it.')) {
                                await deleteMetric(id);
                            }
                        }}
                    />
                </>
            )}
        </>
    );
};

export { MetricsGrid };
