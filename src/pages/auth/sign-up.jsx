import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
    Card,
    Input,
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
    const [profileImage, setProfileImage] = useState(null); 
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('student'); 
    const [errors, setErrors] = useState({});
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
        <section className="m-8 flex items-center justify-center h-screen dark:bg-gray-900">
        {/* Лявата част с логото */}
        <div className="w-full h-full flex items-center justify-center">
            <img
                src="/img/pattern.png"
                className="w-128 h-auto object-cover"  // Размерът на логото е увеличен, а пропорциите са запазени
                alt="Logo"
            />
        </div>
    
        {/* Дясната част с формата за регистрация */}
        <div className="w-full lg:w-7/8 flex flex-col items-center justify-center">
            <div className="text-center">
                <Typography variant="h2" className="font-bold mb-4 dark:text-yellow-400 text-black">
                    Join Us Today
                </Typography>
                <Typography
                    variant="paragraph"
                    className="text-lg font-normal dark:text-yellow-400 text-black"
                >
                    Enter your information to register.
                </Typography>
            </div>
            <form
                onSubmit={handleSignUp}
                className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
            >
                <div className="mb-1 flex flex-col gap-6">
                    <Input
                        size="lg"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={
                            errors.username
                                ? 'border-red-500'
                                : 'dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black'
                        }
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
                    
                    <Input
                        size="lg"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={
                            errors.email
                                ? 'border-red-500'
                                : 'dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black'
                        }
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
                    
                    <Input
                        type="password"
                        size="lg"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={
                            errors.password
                                ? 'border-red-500'
                                : 'dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black'
                        }
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
                    
                    <Input
                        size="lg"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={
                            errors.firstName
                                ? 'border-red-500'
                                : 'dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black'
                        }
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
                    
                    <Input
                        size="lg"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={
                            errors.lastName
                                ? 'border-red-500'
                                : 'dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black'
                        }
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
                    
                    <Input
                        size="lg"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={
                            errors.phoneNumber
                                ? 'border-red-500'
                                : 'dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black'
                        }
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
                    
                    <Input
                        type="file"
                        label="Photo"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black"
                    />
                    
                    <Input
                        size="lg"
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black"
                    />
                    
                    <Select
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e)}
                        className="dark:bg-gray-800 dark:border-yellow-400 dark:text-yellow-400 text-black"
                    >
                        <Option value="student">Student</Option>
                        <Option value="organizer">Organizer</Option>
                    </Select>
                </div>
                <Button className="mt-6 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 text-white" fullWidth type="submit">
                    Register Now
                </Button>
                <Typography
                    variant="paragraph"
                    className="text-center text-blue-gray-500 font-medium mt-4 dark:text-yellow-400 text-black"
                >
                    Already have an account?
                    <Link to="/auth/sign-in" className="text-black dark:text-yellow-400 ml-1">
                        Sign in
                    </Link>
                </Typography>
            </form>
        </div>
    </section>
     
    );
}

export default SignUp;
