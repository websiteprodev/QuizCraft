import React from 'react';
import {
    Typography,
    Alert,
    Card,
    CardHeader,
    CardBody,
} from '@material-tailwind/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export function Notifications() {
    const [showAlerts, setShowAlerts] = React.useState({
        blue: true,
        green: true,
        orange: true,
        red: true,
    });
    const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
        blue: true,
        green: true,
        orange: true,
        red: true,
    });
    const alerts = ['gray', 'green', 'orange', 'red'];

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8 dark:bg-gray-900">
            <Card className="dark:bg-gray-800 dark:text-gray-100">
                <CardHeader
                    color="transparent"
                    floated={false}
                    shadow={false}
                    className="m-0 p-4 dark:bg-gray-800"
                >
                    <Typography variant="h5" color="blue-gray" className="dark:text-gray-100">
                        Alerts
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4 p-4 dark:bg-gray-800">
                    {alerts.map((color) => (
                        <Alert
                            key={color}
                            open={showAlerts[color]}
                            color={color}
                            className="dark:bg-gray-700 dark:text-gray-100"
                            onClose={() =>
                                setShowAlerts((current) => ({
                                    ...current,
                                    [color]: false,
                                }))
                            }
                        >
                            A simple {color} alert with an{' '}
                            <a href="#" className="underline dark:text-blue-400">example link</a>. 
                            Give it a click if you like.
                        </Alert>
                    ))}
                </CardBody>
            </Card>
            <Card className="dark:bg-gray-800 dark:text-gray-100">
                <CardHeader
                    color="transparent"
                    floated={false}
                    shadow={false}
                    className="m-0 p-4 dark:bg-gray-800"
                >
                    <Typography variant="h5" color="blue-gray" className="dark:text-gray-100">
                        Alerts with Icon
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4 p-4 dark:bg-gray-800">
                    {alerts.map((color) => (
                        <Alert
                            key={color}
                            open={showAlertsWithIcon[color]}
                            color={color}
                            icon={
                                <InformationCircleIcon
                                    strokeWidth={2}
                                    className="h-6 w-6 dark:text-gray-100"
                                />
                            }
                            className="dark:bg-gray-700 dark:text-gray-100"
                            onClose={() =>
                                setShowAlertsWithIcon((current) => ({
                                    ...current,
                                    [color]: false,
                                }))
                            }
                        >
                            A simple {color} alert with an{' '}
                            <a href="#" className="underline dark:text-blue-400">example link</a>. 
                            Give it a click if you like.
                        </Alert>
                    ))}
                </CardBody>
            </Card>
        </div>
    );
}

export default Notifications;
