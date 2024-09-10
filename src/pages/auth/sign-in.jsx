import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Input, Button, Typography } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '@/configs/firebase';
import { getDoc, doc } from 'firebase/firestore';

export function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setErrorMessage('');
        try {
            const userDocRef = doc(db, 'users', username);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                alert('Username not found.');
                return;
            }

            const userData = userDoc.data();

            if (userData.isBlocked) {
                alert('This account is blocked.');
                return;
            }

            const email = userData.email;

            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard/home');
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError(
                'Failed to sign in. Please check your credentials and try again.',
            );

            console.log('Full error object:', error);

            switch (error.code) {
                case 'auth/invalid-credential':
                    setErrorMessage('Invalid credentials. Please try again.');
                    break;
                default:
                    setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <section className="m-8 flex flex-col items-center justify-center dark:bg-gray-900 min-h-screen">
        <div className="text-center mb-8">
            <img
                src="/img/pattern.png"
                alt="Logo"
                className="h-96 w-96 mx-auto object-cover mb-6"  
            />
            <Typography variant="h2" className="font-bold mb-4 dark:text-gray-100">
                Sign In
            </Typography>
            <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-lg font-normal dark:text-gray-300"
            >
                Enter your Username and Password to sign in.
            </Typography>
        </div>
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
            <form
                onSubmit={handleSignIn}
                className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
            >
                <div className="mb-1 flex flex-col gap-6">
                    {errorMessage && (
                        <Typography
                            variant="small"
                            color="red"
                            className="mb-4"
                        >
                            {errorMessage}
                        </Typography>
                    )}
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="-mb-3 font-medium dark:text-gray-200"
                    >
                        Username
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="!border-t-black dark:!border-t-blue-gray-200 focus:!border-t-black dark:focus:!border-t-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        labelProps={{
                            className:
                                'before:content-none after:content-none text-black dark:text-gray-100',  // Промяна на цвета на текста за light и dark mode
                        }}
                    />
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="-mb-3 font-medium dark:text-gray-200"
                    >
                        Password
                    </Typography>
                    <Input
                        type="password"
                        size="lg"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="!border-t-black dark:!border-t-blue-gray-200 focus:!border-t-black dark:focus:!border-t-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        labelProps={{
                            className:
                                'before:content-none after:content-none text-black dark:text-gray-100',  // Промяна на цвета на текста за light и dark mode
                        }}
                    />
                </div>
                {error && <Typography color="red">{error}</Typography>}
                <Button className="mt-6 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 text-white" fullWidth type="submit">
                    Sign In
                </Button>
            </form>
            <Typography
                variant="paragraph"
                className="text-center text-blue-gray-500 font-medium mt-4 dark:text-gray-200"
            >
                Do not have an account?
                <Link to="/auth/sign-up" className="text-gray-900 dark:text-gray-200 ml-1">
                    Register
                </Link>
            </Typography>
        </div>
    </section>
    

    );
}

export default SignIn;
