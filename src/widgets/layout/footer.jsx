import PropTypes from 'prop-types';
import { Typography } from '@material-tailwind/react';
import { HeartIcon } from '@heroicons/react/24/solid';

export function Footer({ brandName, brandLink, routes }) {
    const year = new Date().getFullYear();

    return (
        <footer className="py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
            <div className="container mx-auto flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <Typography
                    variant="small"
                    className="font-normal"
                >
                    &copy; {year}, made with{' '}
                    <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" />{' '}
                    by{' '}
                    <a
                        href={brandLink}
                        target="_blank"
                        className="transition-colors hover:text-blue-300 font-bold"
                    >
                        {brandName}
                    </a>{' '}
                    for a better web.
                </Typography>
                <ul className="flex items-center gap-4">
                    {routes.map(({ name, path }) => (
                        <li key={name}>
                            <Typography
                                as="a"
                                href={path}
                                target="_blank"
                                variant="small"
                                className="py-0.5 px-1 font-normal transition-colors hover:text-blue-300"
                            >
                                {name}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
с    
}

Footer.defaultProps = {
    brandName: 'VPST',
    brandLink: 'https://www.creative-tim.com',
    routes: [
        { name: 'VPST', path: 'https://www.creative-tim.com' },
        { name: 'About Us', path: 'https://www.creative-tim.com/presentation' },
        { name: 'Blog', path: 'https://www.creative-tim.com/blog' },
        { name: 'License', path: 'https://www.creative-tim.com/license' },
    ],
};

Footer.propTypes = {
    brandName: PropTypes.string,
    brandLink: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = '/src/widgets/layout/footer.jsx';

export default Footer;
