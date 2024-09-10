import PropTypes from 'prop-types';
import { Typography } from '@material-tailwind/react';
import { HeartIcon } from '@heroicons/react/24/solid';

export function Footer({ brandName, brandLink, routes }) {
    const year = new Date().getFullYear();

    return (
        <footer className="py-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <Typography variant="small" className="font-normal text-center">
                    &copy; {year}, made with{' '}
                    <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{' '}
                    <a
                        href={brandLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 transition-colors"
                    >
                        {brandName}
                    </a>{' '}
                    for a better web.
                </Typography>
                <ul className="flex flex-wrap items-center gap-4">
                    {routes.map(({ name, path }) => (
                        <li key={name}>
                            <Typography
                                as="a"
                                href={path}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="small"
                                className="font-normal text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {name}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
}

Footer.defaultProps = {
    brandName: 'VPST',
    routes: [
        { name: 'VPST', },
        { name: 'About Us', },
        { name: 'Blog',  },
        { name: 'License',},
    ],
};

Footer.propTypes = {
    brandName: PropTypes.string,
    brandLink: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = '/src/widgets/layout/footer.jsx';

export default Footer;
