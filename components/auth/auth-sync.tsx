'use client';

import { useAuthSync } from '@/lib/hooks/use-user';
import { useOrgSync } from '@/lib/hooks/use-org';

/**
 * Component that syncs WorkOS auth state with Zustand stores
 * Syncs both user and organization data
 */
export function AuthSync({ children }: { children: React.ReactNode }) {
    useAuthSync();
    useOrgSync();
    return <>{children}</>;
}
