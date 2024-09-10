import React, { useState, useEffect } from 'react';
import {
    Typography,
    Alert,
    Card,
    CardHeader,
    CardBody,
} from '@material-tailwind/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/configs/firebase';

export function Notifications() {
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        const fetchNotifications = async () => {
            const querySnapshot = await getDocs(collection(db, 'notifications'));
            const fetchedNotifications = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotifications(fetchedNotifications);
        };
        fetchNotifications();
    }, []);

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
                        Notifications
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4 p-4 dark:bg-gray-800">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Alert
                                key={notification.id}
                                color="blue"
                                className="dark:bg-gray-700 dark:text-gray-100"
                            >
                                {notification.createdBy} created a new quiz: {notification.quizTitle}
                            </Alert>
                        ))
                    ) : (
                        <Typography
                            variant="paragraph"
                            className="text-gray-600 dark:text-gray-400"
                        >
                            No notifications yet.
                        </Typography>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default Notifications;
