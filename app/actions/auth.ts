'use server';

// import { signOut } from '@workos-inc/authkit-nextjs';
import { signOut } from '@/lib/auth-helper';

export async function signOutAction() {
    await signOut();
}
