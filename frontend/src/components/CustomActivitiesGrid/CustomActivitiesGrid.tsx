import React, { useState, useEffect, useContext } from 'react';
import { Grid } from '../Grid/Grid';
import { client } from '../../lib/client';
import { AppContext } from '../AppContext/AppContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { CustomActivityForm } from '../CustomActivityForm/CustomActivityForm';
// eslint-disable-next-line no-unused-vars
import { GridColumn } from '../../lib/types/GridColumn';
// eslint-disable-next-line no-unused-vars
import { ActivityDataRow } from '../../lib/types/ActivityDataRow';
// eslint-disable-next-line no-unused-vars
import { Activity } from '../../lib/types/Activity';

const CustomActivitiesGrid = () => {
    const newActivity: Activity = {
        id: 0, name: '', estimatedCaloriesBurnedPerMinute: 0, type: 0, isSystem: false,
    };

    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [gridData, setGridData] = useState([]);
    const [activity, setActivity] = useState(newActivity);
    const [addFormVisible, setAddFormVisible] = useState(false);

    const { currentUser } = useContext(AppContext);

    const transformData = (activities: any) => {
        const customActivities: Array<ActivityDataRow> = [];

        activities.forEach((a: any) => {
            customActivities.push({
                id: a.id,
                name: a.name,
                canDelete: !a.isSystem,
                canEdit: !a.isSystem,
            });
        });

        return customActivities;
    };

    useEffect(() => {
        client('users/getusercustomactivities').then(
            (data) => {
                if (data.successful) {
                    const customActivities: Array<ActivityDataRow> = transformData(data.activities);

                    setGridData(customActivities);
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

    const getActivityById = async (id: number) => {
        await client(`activities/getactivity?id=${id}`).then(
            (data) => {
                if (data.successful) {
                    const selActivity: Activity = {
                        id: data.activity.id,
                        name: data.activity.name,
                        estimatedCaloriesBurnedPerMinute: data.activity.estimatedCaloriesBurnedPerMinute,
                        type: data.activity.type,
                        isSystem: false,
                    };
                    setActivity(selActivity);
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

    const deleteActivity = async (id: number) => {
        await client('activities/deleteactivity', {
            data: {
                id,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    const customActivities: Array<ActivityDataRow> = transformData(data.activities);

                    setGridData(customActivities);
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
            Width: '70%',
            ColumnId: 'name',
            Key: 'NAME',
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
                        <CustomActivityForm
                            activity={activity}
                            onSuccess={(activities: any) => {
                                setAddFormVisible(false);
                                const customActivities: Array<ActivityDataRow> = transformData(activities);
                                setGridData(customActivities);
                            }}
                            onCancel={() => {
                                setAddFormVisible(false);
                            }}
                        />
                    </ModalWindow>
                    <Grid
                        columns={columns}
                        data={gridData}
                        keyColumn="id"
                        IDColumn="id"
                        noRowsMessage="No Custom Activities Defined"
                        onAdd={() => {
                            setActivity(newActivity);
                            setAddFormVisible(true);
                        }}
                        onEdit={async (id: number) => {
                            await getActivityById(id);
                            setAddFormVisible(true);
                        }}
                        onDelete={async (id: number) => {
                            // eslint-disable-next-line max-len, no-alert
                            if (window.confirm('Are you sure you want to delete this activity? All entries associated with it will be deleted as well.')) {
                                await deleteActivity(id);
                            }
                        }}
                    />
                </>
            )}
        </>
    );
};

export { CustomActivitiesGrid };