import React, { useState, useEffect } from 'react';
import {
    Typography,
    Alert,
    Card,
    CardHeader,
    CardBody,
} from '@material-tailwind/react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { useAuth } from '@/pages/auth/AuthContext'; 

export function Notifications() {
    const { user } = useAuth(); 
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user?.username) {
                const querySnapshot = await getDocs(
                    collection(db, `users/${user.username}/notifications`)
                );
                const fetchedNotifications = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(fetchedNotifications);
            }
        };
        fetchNotifications();
    }, [user]);

    const markAsRead = async (notificationId) => {
        if (user?.username) {
            const notificationRef = doc(db, `users/${user.username}/notifications`, notificationId);
            await updateDoc(notificationRef, { isRead: true });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
        }
    };

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
                                color={notification.isRead ? "blue" : "red"}
                                className="dark:bg-gray-700 dark:text-gray-100 cursor-pointer"
                                onClick={() => markAsRead(notification.id)}
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
