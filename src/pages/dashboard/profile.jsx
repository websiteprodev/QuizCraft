import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tooltip,
    Button,
    Input,
} from '@material-tailwind/react';
import {
    PencilIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { ProfileInfoCard } from '@/widgets/cards';
import { projectsData } from '@/data';
import {
    doc,
    updateDoc,
    query,
    where,
    getDocs,
    collection,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db, storage } from '@/configs/firebase';
import { useAuth } from '../auth/authContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function Profile() {
    const { user } = useAuth();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        photoURL: '',
        address: '',
        role: '',
    });

    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (user) {
            setUserData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
                photoURL: user.photoURL,
                role: user.role,
                phoneNumber: user.phoneNumber,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userDocRef = doc(db, 'users', user.username);
            let updatedPhotoURL = userData.photoURL;

            if (file) {
                const storageRef = ref(
                    storage,
                    `profileImages/${user.username}`,
                );
                await uploadBytes(storageRef, file);
                updatedPhotoURL = await getDownloadURL(storageRef);
            }

            const phoneQuery = query(
                collection(db, 'users'),
                where('phoneNumber', '==', userData.phoneNumber),
            );
            const phoneQuerySnapshot = await getDocs(phoneQuery);

            if (
                !phoneQuerySnapshot.empty &&
                phoneQuerySnapshot.docs[0].id !== user.username
            ) {
                alert('Phone number is already in use by another user.');
                throw new Error(
                    'Phone number is already in use by another user.',
                );
            }

            await updateDoc(userDocRef, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                address: userData.address,
                photoURL: updatedPhotoURL,
                phoneNumber: userData.phoneNumber,
            });

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
        }
    };

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 dark:border-gray-700 bg-yellow-50 dark:bg-gray-800">
                <CardBody className="p-4 dark:bg-gray-800">
                    <div className="mb-10 flex items-center gap-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={user.photoURL}
                                alt="profile pic"
                                size="xl"
                                variant="rounded"
                                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                            <div>
                                <Typography
                                    variant="h5"
                                    color="blue-gray"
                                    className="mb-1 dark:text-gray-100"
                                >
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-normal text-blue-gray-600 dark:text-gray-300"
                                >
                                    {user.role}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-6 px-4 lg:grid-cols-3 xl:grid-cols-3">
                        <ProfileInfoCard
                            title="Profile Information"
                            details={{
                                'First Name': `${user.firstName}`,
                                'Mobile': `${user.phoneNumber}`,
                                'Email': `${user.email}`,
                                'Location': `${user.address}`,
                                'Social': (
                                    <div className="flex items-center gap-4">
                                        <i className="fa-brands fa-facebook text-blue-700 dark:text-blue-500" />
                                        <i className="fa-brands fa-twitter text-blue-400 dark:text-blue-300" />
                                        <i className="fa-brands fa-instagram text-purple-500 dark:text-purple-400" />
                                    </div>
                                ),
                            }}
                            action={
                                <Tooltip content="Edit Profile">
                                    <PencilIcon className="h-5 w-5 cursor-pointer text-yellow-500 dark:text-yellow-300" />
                                </Tooltip>
                            }
                        />
                        <section className="col-span-2">
                            <div className="text-center mb-6 ">
                                <Typography variant="h2" className="font-bold text-yellow-500 dark:text-yellow-300">
                                    Edit Profile
                                </Typography>
                            </div>
                            <form onSubmit={handleSubmit} className="w-auto">
                                <div className="mb-4 gap-4 grid md:grid-cols-2 sm:grid-cols-1">
                                    {error && (
                                        <Typography color="red">
                                            {error}
                                        </Typography>
                                    )}
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            Username
                                        </Typography>
                                        <Input
                                            size="lg"
                                            name="username"
                                            value={user.username}
                                            disabled
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            First Name
                                        </Typography>
                                        <Input
                                            size="lg"
                                            name="firstName"
                                            value={userData.firstName}
                                            onChange={handleChange}
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            Last Name
                                        </Typography>
                                        <Input
                                            size="lg"
                                            name="lastName"
                                            value={userData.lastName}
                                            onChange={handleChange}
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            Email
                                        </Typography>
                                        <Input
                                            size="lg"
                                            name="email"
                                            value={userData.email}
                                            disabled
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            Address
                                        </Typography>
                                        <Input
                                            size="lg"
                                            name="address"
                                            value={userData.address}
                                            onChange={handleChange}
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            Phone Number
                                        </Typography>
                                        <Input
                                            size="lg"
                                            name="phoneNumber"
                                            value={userData.phoneNumber}
                                            onChange={handleChange}
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium dark:text-white"
                                        >
                                            Profile Picture
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="!border-t-yellow-500 dark:border-yellow-300 dark:bg-gray-700 dark:text-gray-200 focus:!border-t-yellow-700"
                                        />
                                    </div>
                                    {userData.photoURL && (
                                        <div className="mt-4 place-self-left w-full">
                                            <img
                                                src={userData.photoURL}
                                                alt="Profile"
                                                className="rounded-lg shadow-lg shadow-blue-gray-500/40 max-h-48"
                                            />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    className="mt-6"
                                    fullWidth
                                    type="submit"
                                    variant="gradient"
                                    color="yellow"
                                >
                                    Save Changes
                                </Button>
                            </form>
                        </section>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

export default Profile;
