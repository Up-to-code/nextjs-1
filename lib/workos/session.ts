import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('wos-session');

    if (!sessionCookie) {
        console.log('❌ getCurrentUser: No wos-session cookie found');
        const allCookies = cookieStore.getAll().map(c => c.name).join(', ');
        console.log('Available cookies:', allCookies);
        return { user: null };
    }

    try {
        const { user } = (await workos.userManagement.loadSealedSession({
            sessionData: sessionCookie.value,
            cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
        })) as any;
        return { user };
    } catch (error) {
        console.error('❌ getCurrentUser: Failed to load sealed session:', error);
        return { user: null };
    }
}
