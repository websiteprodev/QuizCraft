import { Routes, Route } from 'react-router-dom';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { IconButton } from '@material-tailwind/react';
import {
    Sidenav,
    DashboardNavbar,
    Configurator,
    Footer,
} from '@/widgets/layout';
import routes from '@/routes';
import { useMaterialTailwindController, setOpenConfigurator } from '@/context';
import { useAuth } from '@/pages/auth/AuthContext';
import React from 'react';

export function Home({ children }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavType } = controller;
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-blue-gray-50/50 ">
            {user && (
                <Sidenav
                    routes={routes}
                    brandImg={
                        sidenavType === 'dark'
                            ? '/img/logo-ct.png'
                            : '/img/logo-ct-dark.png'
                    }
                />
            )}
            <div className={`p-4 ${user ? 'xl:ml-80' : ''}`}>
                <DashboardNavbar />
                <Configurator />
                <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
                <Routes>
                    {routes.map(
                        ({ layout, pages }) =>
                            layout === 'dashboard' &&
                            pages.map(({ path, element }) => (
                                <Route exact path={path} element={element} />
                            )),
                    )}
                </Routes>
                <div className="text-blue-gray-600 dark:text-gray-300">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

Home.displayName = '/src/layout/home.jsx';

export default Home;
