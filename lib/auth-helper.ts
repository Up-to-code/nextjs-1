import { cookies } from 'next/headers';

// Mock User Data for E2E
const MOCK_USER = {
    user: {
        id: "user_123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        profilePictureUrl: null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
};

export async function getUser() {
    // Check for E2E bypass cookie
    const cookieStore = await cookies();
    if (process.env.NODE_ENV === 'development' && cookieStore.get('__e2e_bypass')) {
        return MOCK_USER;
    }

    // Default to real AuthKit
    // @ts-ignore
    const { getUser: workosGetUser } = await import('@workos-inc/authkit-nextjs');
    return workosGetUser();
}

export async function withAuth(options: { ensureSignedIn?: boolean } = {}) {
    // Check for E2E bypass cookie
    const cookieStore = await cookies();
    if (process.env.NODE_ENV === 'development' && cookieStore.get('__e2e_bypass')) {
        return MOCK_USER; // Returns { user: ... }
    }

    // Default to real AuthKit
    // @ts-ignore
    const { withAuth: workosWithAuth } = await import('@workos-inc/authkit-nextjs');
    return workosWithAuth(options);
}

export async function signOut() {
    const cookieStore = await cookies();
    if (process.env.NODE_ENV === 'development' && cookieStore.get('__e2e_bypass')) {
        return; // No-op in mock mode
    }

    // @ts-ignore
    const { signOut: workosSignOut } = await import('@workos-inc/authkit-nextjs');
    return workosSignOut();
}
