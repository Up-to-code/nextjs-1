import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

const authMiddleware = authkitMiddleware({
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

export default function middleware(request: NextRequest, event: NextFetchEvent) {
    // E2E Test Bypass
    if (process.env.NODE_ENV === 'development' && request.cookies.get('__e2e_bypass')) {
        return NextResponse.next();
    }
    return authMiddleware(request, event);
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/callback',
        '/dashboard',
        '/dashboard/:path*',
        '/products',
        '/products/:path*',
        '/categories/:path*',
        '/orders/:path*',
        '/analytics',
        '/analytics/:path*',
        '/employees/:path*',
        '/organization',
        '/organization/:path*',
        '/settings/:path*',
        '/notifications/:path*',
        '/help/:path*',
    ],
};
