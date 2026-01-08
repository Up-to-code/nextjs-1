'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import { AuthSync } from '@/components/auth/auth-sync';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider>
      <ConvexProvider client={convex}>
        <AuthSync>
          {children}
        </AuthSync>
      </ConvexProvider>
    </AuthKitProvider>
  );
}
