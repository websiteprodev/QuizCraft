import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Select,
    Option,
} from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../configs/firebase';
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [profileImage, setProfileImage] = useState(null); 
    const [address, setAddress] = useState('');
    const [role, setRole] = React.useState('react'); 
    const [errors, setErrors] = useState('react');
    const navigate = useNavigate();

    const validateInputs = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z]{1,30}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!nameRegex.test(firstName)) {
            newErrors.firstName =
                'First name must only contain letters and be between 1 and 30 characters ';
        }
        if (!nameRegex.test(lastName)) {
            newErrors.lastName =
                'Last names must only contain letters and be between 1 and 30 characters ';
        }
        if (username.length < 3 || username.length > 30) {
            newErrors.username =
                'Username must be between 3 and 30 characters.';
        }
        if (!phoneRegex.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format.';
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const usernameSnapshot = await getDocs(
                query(
                    collection(db, 'users'),
                    where('username', '==', username),
                ),
            );
            if (!usernameSnapshot.empty) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: 'Username is already taken.',
                }));
                return;
            }

            const phoneSnapshot = await getDocs(
                query(
                    collection(db, 'users'),
                    where('phoneNumber', '==', phoneNumber),
                ),
            );
            if (!phoneSnapshot.empty) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    phoneNumber: 'Phone number is already registered.',
                }));
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;

            let imageURL = '';
            if (profileImage) {
                const imageRef = ref(storage, `profileImages/${username}`);
                await uploadBytes(imageRef, profileImage);
                imageURL = await getDownloadURL(imageRef);
            }

            await setDoc(doc(db, 'users', username), {
                email,
                firstName,
                lastName,
                phoneNumber,
                photoURL: imageURL,
                address,
                role,
                uid: user.uid,
                isBlocked: false, 
            });

            navigate('/auth/sign-in');
        } catch (error) {
            console.error('Error signing up:', error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                general: error.message,
            }));
        }
    };

    return (
        <section className="m-8 flex">
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>
            <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        Join Us Today
                    </Typography>
                    <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="text-lg font-normal"
                    >
                        Enter your information to register.
                    </Typography>
                </div>
                <form
                    onSubmit={handleSignUp}
                    className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
                >
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Username
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={
                                errors.username
                                    ? '!border-red-500'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900'
                            }
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        {errors.username && (
                            <Typography
                                variant="small"
                                color="red"
                                className="mt-1"
                            >
                                {errors.username}
                            </Typography>
                        )}
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Your email
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={
                                errors.email
                                    ? '!border-red-500'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900'
                            }
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        {errors.email && (
                            <Typography
                                variant="small"
                                color="red"
                                className="mt-1"
                            >
                                {errors.email}
                            </Typography>
                        )}
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={
                                errors.password
                                    ? '!border-red-500'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900'
                            }
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        {errors.password && (
                            <Typography
                                variant="small"
                                color="red"
                                className="mt-1"
                            >
                                {errors.password}
                            </Typography>
                        )}
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            First Name
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={
                                errors.firstName
                                    ? '!border-red-500'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900'
                            }
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        {errors.firstName && (
                            <Typography
                                variant="small"
                                color="red"
                                className="mt-1"
                            >
                                {errors.firstName}
                            </Typography>
                        )}
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Last Name
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={
                                errors.lastName
                                    ? '!border-red-500'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900'
                            }
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        {errors.lastName && (
                            <Typography
                                variant="small"
                                color="red"
                                className="mt-1"
                            >
                                {errors.lastName}
                            </Typography>
                        )}
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Phone Number
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="10 digits only: ex. 0123456789"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={
                                errors.phoneNumber
                                    ? '!border-red-500'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900'
                            }
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        {errors.phoneNumber && (
                            <Typography
                                variant="small"
                                color="red"
                                className="mt-1"
                            >
                                {errors.phoneNumber}
                            </Typography>
                        )}
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Photo
                        </Typography>
                        <Input
                            type="file"
                            onChange={(e) => setProfileImage(e.target.value[0])}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Address
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className:
                                    'before:content-none after:content-none',
                            }}
                        />
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Role
                        </Typography>
                        <div className="w-72">
                            <Select
                                label="Role"
                                value={role}
                                onChange={(e) => setRole(e)}
                            >
                                <Option value="student">Student</Option>
                                <Option value="organizer">Organizer</Option>
                            </Select>
                        </div>
                    </div>
                    <Button className="mt-6" fullWidth type="submit">
                        Register Now
                    </Button>
                    <Typography
                        variant="paragraph"
                        className="text-center text-blue-gray-500 font-medium mt-4"
                    >
                        Already have an account?
                        <Link to="/auth/sign-in" className="text-gray-900 ml-1">
                            Sign in
                        </Link>
                    </Typography>
                </form>
            </div>
        </section>
    );
}

export default SignUp;
