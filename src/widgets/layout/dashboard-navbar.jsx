import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Navbar,
    Typography,
    Button,
    IconButton,
    Breadcrumbs,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from '@material-tailwind/react';
import {
    UserCircleIcon,
    Cog6ToothIcon,
    BellIcon,
    ClockIcon,
    CreditCardIcon,
    Bars3Icon,
} from '@heroicons/react/24/solid';
import {
    useMaterialTailwindController,
    setOpenConfigurator,
    setOpenSidenav,
} from '@/context';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/configs/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/pages/auth/AuthContext';

export function DashboardNavbar() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { fixedNavbar, openSidenav } = controller;
    const { pathname } = useLocation();
    const [layout, page] = pathname.split('/').filter((el) => el !== '');
    const [currentUser, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem('darkMode') === 'true',
    );
    const navigate = useNavigate();
    const { user } = useAuth();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/auth/sign-in');
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);


    return (
        <Navbar
            color={fixedNavbar ? 'white' : 'transparent'}
            className={`rounded-xl transition-all ${fixedNavbar
                    ? 'sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5'
                    : 'px-0 py-1'
                }`}
            fullWidth
            blurred={fixedNavbar}
        >
            <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
                <div className="capitalize">
                    <Breadcrumbs
                        className={`bg-transparent p-0 transition-all ${fixedNavbar ? 'mt-1' : ''
                            }`}
                    >
                        <Link to={`/${layout}`}>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100 dark:text-[#e0e0e0]"
                            >
                                {layout === 'dashboard' ? 'Home' : layout}
                            </Typography>
                        </Link>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal dark:text-[#e0e0e0]"
                        >
                            {page || 'Home'}
                        </Typography>
                    </Breadcrumbs>
                    <Typography
                        variant="h6"
                        color="blue-gray"
                        className="dark:text-[#e0e0e0]"
                    >
                        {page === 'home' ? 'Home' : page || 'Home'}
                    </Typography>
                </div>
                <div className="flex items-center">
                    {user && (
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mr-4 dark:text-[#e0e0e0]"
                        >
                            Welcome, {user.firstName} {user.lastName}!
                        </Typography>
                    )}
                    <div className="mr-auto md:mr-4 md:w-56">
                        <Input
                            label="Search"
                            className="dark:text-gray-300 dark:bg-gray-800"
                        />
                    </div>

                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setDarkMode(!darkMode)}
                        className="hidden md:inline-flex items-center gap-1 px-4 normal-case dark:text-[#e0e0e0]"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>

                    {currentUser && currentUser.role === 'admin' && (
                        <Link to="/dashboard/admin">
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="hidden items-center gap-1 px-4 xl:flex normal-case dark:text-[#e0e0e0]"
                            >
                                Admin
                            </Button>
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="hidden items-center gap-1 px-4 xl:flex normal-case dark:text-[#e0e0e0]"
                                onClick={handleSignOut}
                            >
                                <UserCircleIcon className="h-5 w-5 text-blue-gray-500 dark:text-[#e0e0e0]" />
                                Sign Out
                            </Button>
                            <IconButton
                                variant="text"
                                color="blue-gray"
                                className="grid xl:hidden dark:text-[#e0e0e0]"
                                onClick={handleSignOut}
                            >
                                <UserCircleIcon className="h-5 w-5 text-blue-gray-500 dark:text-[#e0e0e0]" />
                            </IconButton>
                        </>
                    ) : (
                        <Link to="/auth/sign-in">
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="hidden items-center gap-1 px-4 xl:flex normal-case dark:text-[#e0e0e0]"
                            >
                                <UserCircleIcon className="h-5 w-5 text-blue-gray-500 dark:text-[#e0e0e0]" />
                                Sign In
                            </Button>
                            <IconButton
                                variant="text"
                                color="blue-gray"
                                className="grid xl:hidden dark:text-[#e0e0e0]"
                            >
                                <UserCircleIcon className="h-5 w-5 text-blue-gray-500 dark:text-[#e0e0e0]" />
                            </IconButton>
                        </Link>
                    )}
                </div>
            </div>
        </Navbar>
    );
}

DashboardNavbar.displayName = '/src/widgets/layout/dashboard-navbar.jsx';

export default DashboardNavbar;
