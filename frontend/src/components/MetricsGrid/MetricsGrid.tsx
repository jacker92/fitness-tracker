import React, { useState, useEffect, useContext } from 'react';
import { GridColumn } from '../../types/GridColumn';
import { MetricRow } from '../../types/MetricRow';
import { UserTrackedMetric } from '../../types/UserTrackedMetric';
import { Metric } from '../../types/Metric';
import { client } from '../../lib/client';
import { Grid } from '../Grid/Grid';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { MetricForm } from '../MetricForm/MetricForm';
import { Confirm } from '../Confirm/Confirm';

const MetricsGrid: React.FC = () => {
    const newMetric: Metric = {
        id: 0, name: '', units: '', type: 0,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [metric, setMetric] = useState(newMetric);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('Are you sure you want to delete this metric?');
    const [metricToDeleteId, setMetricToDeleteId] = useState(null);

    const { currentUser } = useContext(AppContext);

    const transformData = (metrics: Array<UserTrackedMetric>) => {
        const trackedMetrics: Array<MetricRow> = [];

        metrics.forEach((m: UserTrackedMetric) => {
            trackedMetrics.push({
                id: m.metricId,
                name: m.metric.name,
                isTracked: m.isTracked,
                canDelete: !m.metric.isSystem,
                canEdit: !m.metric.isSystem,
            });
        });

        return trackedMetrics;
    };

    useEffect(() => {
        client('users/getusertrackedmetrics').then(
            (data) => {
                if (data.successful) {
                    const trackedMetrics: Array<MetricRow> = transformData(data.metrics);

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
                        id: data.metric.id,
                        name: data.metric.name,
                        units: data.metric.units,
                        type: data.metric.type,
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
                metricId: id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const trackedMetrics: Array<MetricRow> = transformData(data.metrics);

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
                    const trackedMetrics: Array<MetricRow> = transformData(data.metrics);

                    setGridData(trackedMetrics);
                } else {
                    setErrorMessage(data.error);
                }

                setMetricToDeleteId(null);
                setConfirmVisible(false);
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }

                setMetricToDeleteId(null);
                setConfirmVisible(false);
            },
        );
    };

    const columns: Array<GridColumn> = [
        {
            Heading: 'Name',
            Width: '55%',
            ColumnId: 'name',
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
                    <MetricForm
                        metric={metric}
                        visible={formVisible}
                        onSuccess={(metrics: Array<UserTrackedMetric>) => {
                            setFormVisible(false);

                            const trackedMetrics: Array<MetricRow> = transformData(metrics);
                            setGridData(trackedMetrics);
                        }}
                        onCancel={() => {
                            setFormVisible(false);
                        }}
                    />

                    <Confirm
                        text={confirmText}
                        visible={confirmVisible}
                        onCancel={() => {
                            setMetricToDeleteId(null);
                            setConfirmVisible(false);
                        }}
                        onConfirm={async () => {
                            await deleteMetric(metricToDeleteId);
                        }}
                    />

                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        noRowsMessage="No Metrics Defined"
                        nameColumn="name"
                        onTrackChange={(id: number) => {
                            toggleTracking(id);
                        }}
                        onAdd={() => {
                            setMetric(newMetric);
                            setFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getMetricById(id);
                            setFormVisible(true);
                        }}
                        onDelete={async (id: number, metricName: string) => {
                            setMetricToDeleteId(id);
                            setConfirmText(`Are you sure you want to delete ${metricName}?`);
                            setConfirmVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

export { MetricsGrid };
