import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Switch,
    Tooltip,
    Button,
    Input,
} from '@material-tailwind/react';
import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
    PencilIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { ProfileInfoCard, MessageCard } from '@/widgets/cards';
import { platformSettingsData, conversationsData, projectsData } from '@/data';
import {
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    getDocs,
    collection,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db, storage } from '@/configs/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function Profile({}) {
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
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 dark:border-gray-700">
                <CardBody className="p-4 dark:bg-gray-800">
                    <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src="/img/bruce-mars.jpeg"
                                alt="bruce-mars"
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
                                    Richard Davis
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-normal text-blue-gray-600 dark:text-gray-300"
                                >
                                    CEO / Co-Founder
                                </Typography>
                            </div>
                        </div>
                        <div className="w-96">
                            <Tabs value="app">
                                <TabsHeader>
                                    <Tab value="app">
                                        <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5 dark:text-gray-100" />
                                        App
                                    </Tab>
                                    <Tab value="message">
                                        <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5 dark:text-gray-100" />
                                        Message
                                    </Tab>
                                    <Tab value="settings">
                                        <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5 dark:text-gray-100" />
                                        Settings
                                    </Tab>
                                </TabsHeader>
                            </Tabs>
                        </div>
                    </div>
                    <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-3 dark:text-gray-100"
                            >
                                Platform Settings
                            </Typography>
                            <div className="flex flex-col gap-12">
                                {platformSettingsData.map(
                                    ({ title, options }) => (
                                        <div key={title}>
                                            <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                                                {title}
                                            </Typography>
                                            <div className="flex flex-col gap-6">
                                                {options.map(
                                                    ({ checked, label }) => (
                                                        <Switch
                                                            key={label}
                                                            id={label}
                                                            label={label}
                                                            defaultChecked={
                                                                checked
                                                            }
                                                            labelProps={{
                                                                className:
                                                                    'text-sm font-normal text-blue-gray-500 dark:text-gray-300',
                                                            }}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                        <ProfileInfoCard
                            title="Profile Information"
                            description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                            details={{
                                'first name': 'Alec M. Thompson',
                                mobile: '(44) 123 1234 123',
                                email: 'alecthompson@mail.com',
                                location: 'USA',
                                social: (
                                    <div className="flex items-center gap-4">
                                        <i className="fa-brands fa-facebook text-blue-700 dark:text-blue-500" />
                                        <i className="fa-brands fa-twitter text-blue-400 dark:text-blue-300" />
                                        <i className="fa-brands fa-instagram text-purple-500 dark:text-purple-400" />
                                    </div>
                                ),
                            }}
                            action={
                                <Tooltip content="Edit Profile">
                                    <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500 dark:text-gray-300" />
                                </Tooltip>
                            }
                        />
                        <div>
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-3 dark:text-gray-100"
                            >
                                Platform Settings
                            </Typography>
                            <ul className="flex flex-col gap-6">
                                {conversationsData.map((props) => (
                                    <MessageCard
                                        key={props.name}
                                        {...props}
                                        action={
                                            <Button
                                                variant="text"
                                                size="sm"
                                                className="dark:text-gray-300"
                                            >
                                                reply
                                            </Button>
                                        }
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                    <section className="m-8 flex flex-col items-center justify-center">
                        <div className="text-center mb-6">
                            <Typography variant="h2" className="font-bold">
                                Edit Profile
                            </Typography>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="w-80 max-w-screen-lg lg:w-1/2"
                        >
                            <div className="mb-6 flex flex-col gap-6">
                                {error && (
                                    <Typography color="red">{error}</Typography>
                                )}
                                <div>
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
                                        value={user.username} // Display the document ID as the username
                                        disabled // Username is displayed but not editable
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                <div>
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
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                <div>
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
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                <div>
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
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                <div>
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
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                <div>
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
                                        onChange={handleChange} // Phone number is now editable
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                <div>
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
                                        className="!border-t-blue-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:!border-t-gray-900"
                                    />
                                </div>
                                {userData.photoURL && (
                                    <div className="mt-4">
                                        <img
                                            src={userData.photoURL}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full mx-auto"
                                        />
                                    </div>
                                )}
                            </div>
                            <Button className="mt-6" fullWidth type="submit">
                                Save Changes
                            </Button>
                        </form>
                    </section>
                    <div className="px-4 pb-4">
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-2 dark:text-gray-100"
                        >
                            Projects
                        </Typography>
                        <Typography
                            variant="small"
                            className="font-normal text-blue-gray-500 dark:text-gray-300"
                        >
                            Architects design houses
                        </Typography>
                        <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
                            {projectsData.map(
                                ({
                                    img,
                                    title,
                                    description,
                                    tag,
                                    route,
                                    members,
                                }) => (
                                    <Card
                                        key={title}
                                        color="transparent"
                                        shadow={false}
                                        className="dark:bg-gray-800"
                                    >
                                        <CardHeader
                                            floated={false}
                                            color="gray"
                                            className="mx-0 mt-0 mb-4 h-64 xl:h-40 dark:bg-gray-900"
                                        >
                                            <img
                                                src={img}
                                                alt={title}
                                                className="h-full w-full object-cover"
                                            />
                                        </CardHeader>
                                        <CardBody className="py-0 px-1">
                                            <Typography
                                                variant="small"
                                                className="font-normal text-blue-gray-500 dark:text-gray-300"
                                            >
                                                {tag}
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                color="blue-gray"
                                                className="mt-1 mb-2 dark:text-gray-100"
                                            >
                                                {title}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-normal text-blue-gray-500 dark:text-gray-300"
                                            >
                                                {description}
                                            </Typography>
                                        </CardBody>
                                        <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                                            <Link to={route}>
                                                <Button
                                                    variant="outlined"
                                                    size="sm"
                                                    className="dark:text-gray-300"
                                                >
                                                    view project
                                                </Button>
                                            </Link>
                                            <div>
                                                {members.map(
                                                    ({ img, name }, key) => (
                                                        <Tooltip
                                                            key={name}
                                                            content={name}
                                                        >
                                                            <Avatar
                                                                src={img}
                                                                alt={name}
                                                                size="xs"
                                                                variant="circular"
                                                                className={`cursor-pointer border-2 border-white ${
                                                                    key === 0
                                                                        ? ''
                                                                        : '-ml-2.5'
                                                                } dark:border-gray-700`}
                                                            />
                                                        </Tooltip>
                                                    ),
                                                )}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ),
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

export default Profile;
