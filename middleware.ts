import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
    redirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || 'http://localhost:3000/callback',
    middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: [
            '/',
            '/login',
            '/register',
            '/callback',
        ],
    },
});

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/callback',
        '/dashboard/:path*',
        '/products/:path*',
        '/categories/:path*',
        '/orders/:path*',
        '/analytics/:path*',
        '/employees/:path*',
        '/organization/:path*',
        '/settings/:path*',
        '/notifications/:path*',
        '/help/:path*',
    ],
};
