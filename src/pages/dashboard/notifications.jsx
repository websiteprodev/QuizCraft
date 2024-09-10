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
    const alerts = ['blue', 'green', 'orange', 'red'];

    return (
        <div className="mx-auto my-12 flex max-w-screen-lg flex-col gap-8 dark:bg-gray-900">
            <Card className="p-6 dark:bg-gray-800 dark:text-yellow-100 shadow-lg border-2 border-yellow-400 dark:border-yellow-300 rounded-lg">
                <CardHeader
                    color="transparent"
                    floated={false}
                    shadow={false}
                    className="m-0 p-4 dark:bg-gray-800"
                >
                    <Typography
                        variant="h5"
                        className="text-yellow-800 dark:text-yellow-300 font-bold"
                    >
                        Alerts
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-6 p-6 dark:bg-gray-700">
                    {alerts.map((color) => (
                        <Alert
                            key={color}
                            open={showAlerts[color]}
                            color={color}
                            className={`rounded-lg shadow-md ${color}-background dark:${color}-background-dark text-white dark:text-yellow-100`}
                            onClose={() =>
                                setShowAlerts((current) => ({
                                    ...current,
                                    [color]: false,
                                }))
                            }
                        >
                            A simple {color} alert with an{' '}
                            <a href="#" className="underline text-yellow-600 dark:text-yellow-400">
                                example link
                            </a>. 
                            Give it a click if you like.
                        </Alert>
                    ))}
                </CardBody>
            </Card>
            <Card className="p-6 dark:bg-gray-800 dark:text-yellow-100 shadow-lg border-2 border-yellow-400 dark:border-yellow-300 rounded-lg">
                <CardHeader
                    color="transparent"
                    floated={false}
                    shadow={false}
                    className="m-0 p-4 dark:bg-gray-800"
                >
                    <Typography
                        variant="h5"
                        className="text-yellow-800 dark:text-yellow-300 font-bold"
                    >
                        Alerts with Icon
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-6 p-6 dark:bg-gray-700">
                    {alerts.map((color) => (
                        <Alert
                            key={color}
                            open={showAlertsWithIcon[color]}
                            color={color}
                            icon={
                                <InformationCircleIcon
                                    strokeWidth={2}
                                    className={`h-6 w-6 ${color}-text dark:${color}-text-dark`}
                                />
                            }
                            className={`rounded-lg shadow-md ${color}-background dark:${color}-background-dark text-white dark:text-yellow-100`}
                            onClose={() =>
                                setShowAlertsWithIcon((current) => ({
                                    ...current,
                                    [color]: false,
                                }))
                            }
                        >
                            A simple {color} alert with an{' '}
                            <a href="#" className="underline text-yellow-600 dark:text-yellow-400">
                                example link
                            </a>. 
                            Give it a click if you like.
                        </Alert>
                    ))}
                </CardBody>
            </Card>
        </div>
    );
}

export default Notifications;

