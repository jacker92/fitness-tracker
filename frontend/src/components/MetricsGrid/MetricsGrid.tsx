import React, { useState, useEffect, useContext } from 'react';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
// eslint-disable-next-line no-unused-vars
import { GridColumn } from '../../lib/types/GridColumn';
// eslint-disable-next-line no-unused-vars
import { UserTrackedMetric } from '../../lib/types/UserTrackedMetric';

const MetricsGrid = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);

    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        client('users/getusertrackedmetrics').then(
            (data) => {
                if (data.successful) {
                    const trackedMetrics: Array<UserTrackedMetric> = [];

                    data.metrics.forEach((m: any) => {
                        trackedMetrics.push({
                            ID: m.ID,
                            Name: m.Metric.Name,
                            isTracked: m.IsTracked,
                            canDelete: !m.Metric.IsSystem,
                            canEdit: !m.Metric.IsSystem,
                        });
                    });

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

    const toggleTracking = (metricId: number) => {

    };

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <Grid
                    columns={columns}
                    data={gridData}
                    keyColumn="ID"
                    noRowsMessage="No Metrics Defined"
                    onTrackChange={(metricId: number) => {
                        toggleTracking(metricId);
                    }}
                />
            )}
        </>
    );
};

export { MetricsGrid };
