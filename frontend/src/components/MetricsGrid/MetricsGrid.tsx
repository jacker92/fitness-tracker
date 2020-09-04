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

const MetricsGrid = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [metricId, setMetricId] = useState(0);
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
                        height={490}
                        visible={addFormVisible}
                    >
                        <MetricForm
                            metricId={metricId}
                            onSuccess={(metrics: any) => {
                                setAddFormVisible(false);
                                const trackedMetrics: Array<UserTrackedMetric> = transformData(metrics);
                                setGridData(trackedMetrics);
                            }}
                            onError={(error: string) => {
                                setErrorMessage(error);
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
                            setMetricId(0);
                            setAddFormVisible(true);
                        }}
                        onEdit={(id: number) => {
                            setMetricId(id);
                            setAddFormVisible(true);
                        }}
                    />
                </>
            )}
        </>
    );
};

export { MetricsGrid };
