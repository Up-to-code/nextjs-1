# Antig - WorkOS AuthKit Documentation for LLM

Complete authentication integration guide using WorkOS AuthKit for the Antig furniture management platform.

Reference: [WorkOS AuthKit Documentation](https://workos.com/docs/authkit/nextjs/2-add-authkit-to-your-app/sign-in-endpoint)

---

## 🚀 WORKOS AUTHKIT SETUP & INSTALLATION

### Prerequisites

Before getting started, you'll need:
- A WorkOS account
- Your WorkOS API Key and Client ID
- AuthKit activated in your WorkOS Dashboard

### Install Dependencies

For a Next.js integration, use the `authkit-nextjs` library:

```bash
npm install @workos-inc/authkit-nextjs
```

### Configure WorkOS Dashboard

#### 1. Configure Redirect URI

A redirect URI is a callback endpoint that WorkOS will redirect to after a user has authenticated. Set this in the _Redirects_ section of the WorkOS Dashboard.

**Example Redirect URIs:**
- Development: `http://localhost:3000/callback`
- Production: `https://yourdomain.com/callback`

**Sign-out Redirect:**
Configure where users should be redirected after signing out (e.g., `http://localhost:3000` or `https://yourdomain.com`)

#### 2. Configure Sign-in Endpoint

Configure your application's sign-in endpoint from the _Redirects_ section. This endpoint redirects users to AuthKit for authentication.

**Example Sign-in Endpoint:**
- Development: `http://localhost:3000/login`
- Production: `https://yourdomain.com/login`

#### 3. Environment Variables

Set the following environment variables in your `.env.local`:

```bash
# WorkOS Configuration
WORKOS_API_KEY='sk_example_123456789'
WORKOS_CLIENT_ID='client_123456789'
WORKOS_COOKIE_PASSWORD="<your secure password>"  # Must be at least 32 characters

# Public redirect URI (accessible in edge functions)
NEXT_PUBLIC_WORKOS_REDIRECT_URI="http://localhost:3000/callback"
```

**Generate Secure Cookie Password:**
```bash
# Using openssl
openssl rand -base64 32

# Or use 1Password generator
```

The `NEXT_PUBLIC_WORKOS_REDIRECT_URI` uses the `NEXT_PUBLIC` prefix so the variable is accessible in edge functions and middleware configurations.

---

## 📦 INTEGRATING AUTHKIT INTO YOUR APP

### 1. Provider Setup

Wrap your app layout with `AuthKitProvider`:

```typescript
// app/layout.tsx
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthKitProvider>{children}</AuthKitProvider>
      </body>
    </html>
  );
}
```

### 2. Middleware Configuration

Next.js middleware is required to determine which routes require authentication. You can choose between:

- **Complete middleware** - Handles all auth logic automatically
- **Composable middleware** - Custom control over route protection

#### Option A: Complete Middleware (Recommended)

**Page-Based Auth Mode:**

```typescript
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

// Match against pages that require authentication
// Leave this out if you want authentication on every page
export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/orders/:path*'],
};
```

**Middleware Auth Mode (Protect All Routes):**

```typescript
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// In middleware auth mode, each page is protected by default
// Exceptions are configured via the `unauthenticatedPaths` option
export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/login', '/register'],
  },
});

// Match against pages that require authentication
export const config = {
  matcher: ['/', '/dashboard/:path*', '/account/:path*'],
};
```

In this example:
- `/`, `/login`, `/register` can be viewed by unauthenticated users
- `/dashboard` and `/account` pages require authentication

#### Option B: Composable Middleware (Custom Control)

```typescript
// middleware.ts
import { authkit } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export default async function middleware(request: Request) {
  // Perform logic before or after AuthKit
  
  // Auth object contains the session, response headers and an authorization
  // URL in the case that the session isn't valid
  const {
    session,
    headers: authkitHeaders,
    authorizationUrl,
  } = await authkit(request, {
    debug: true,
  });

  const { pathname } = new URL(request.url);

  // Control what to do when there's no session on a protected route
  if (pathname.startsWith('/dashboard') && !session.user) {
    console.log('No session on protected path');

    // Preserve AuthKit headers on redirects (e.g., cookies)
    const response = NextResponse.redirect(authorizationUrl);
    for (const [key, value] of authkitHeaders) {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.append(key, value);
      } else {
        response.headers.set(key, value);
      }
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### 3. Callback Route

Create a callback route to handle the OAuth callback:

```typescript
// app/callback/route.ts
import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth();
```

This route handles the OAuth callback, exchanges the authorization code for a session, and redirects users appropriately.

### 4. Sign-in Endpoint

Create a sign-in endpoint that redirects users to WorkOS AuthKit:

```typescript
// app/login/route.ts
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnPathname = searchParams.get('returnPathname') || '/dashboard';

  const { url } = await getSignInUrl({
    returnPathname,
  });

  redirect(url);
}
```

Or create a sign-in page:

```typescript
// app/(auth)/login/page.tsx
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { returnPathname?: string };
}) {
  const returnPathname = searchParams.returnPathname || '/dashboard';

  const { url } = await getSignInUrl({
    returnPathname,
  });

  redirect(url);
}
```

### 5. Sign-up Endpoint

Create a sign-up endpoint:

```typescript
// app/register/route.ts
import { getSignUpUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnPathname = searchParams.get('returnPathname') || '/dashboard';

  const { url } = await getSignUpUrl({
    returnPathname,
  });

  redirect(url);
}
```

Or create a sign-up page:

```typescript
// app/(auth)/register/page.tsx
import { getSignUpUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { returnPathname?: string };
}) {
  const returnPathname = searchParams.returnPathname || '/dashboard';

  const { url } = await getSignUpUrl({
    returnPathname,
  });

  redirect(url);
}
```

---

## 🔐 ACCESSING AUTHENTICATION DATA

### Server Components

Use `withAuth` to get the current user in server components:

```typescript
// app/(dashboard)/dashboard/page.tsx
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function DashboardPage() {
  // Retrieves the user from the session or returns null if no user is signed in
  const { user } = await withAuth();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <p>مرحباً بك{user.firstName && `, ${user.firstName}`}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Client Components

Use `useAuth` hook to get the current user in client components:

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';

export default function DashboardPage() {
  // Retrieves the user from the session or returns null if no user is signed in
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <p>مرحباً بك{user.firstName && `, ${user.firstName}`}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

---

## 🛡️ PROTECTED ROUTES

### Server Component Protection

Use `ensureSignedIn` option to automatically redirect unauthenticated users:

```typescript
// app/(dashboard)/dashboard/page.tsx
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function ProtectedPage() {
  // If the user isn't signed in, they will be automatically redirected to AuthKit
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <p>مرحباً بك{user.firstName && `, ${user.firstName}`}</p>
    </div>
  );
}
```

### Client Component Protection

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';

export default function ProtectedPage() {
  // If the user isn't signed in, they will be automatically redirected to AuthKit
  const { user, loading } = useAuth({ ensureSignedIn: true });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <p>مرحباً بك{user.firstName && `, ${user.firstName}`}</p>
    </div>
  );
}
```

---

## 🚪 SIGN OUT

Create a sign-out action:

```typescript
// app/actions/auth.ts
'use server';

import { signOut } from '@workos-inc/authkit-nextjs';

export async function signOutAction() {
  await signOut();
}
```

Use in a component:

```typescript
// components/layout/DashboardHeader.tsx
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { signOutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div>
        <h2>مرحباً بك{user?.firstName && `, ${user.firstName}`}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      
      <form action={signOutAction}>
        <Button type="submit" variant="ghost">
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </form>
    </header>
  );
}
```

Or use directly in a server component:

```typescript
// app/(dashboard)/dashboard/page.tsx
import { withAuth, signOut } from '@workos-inc/authkit-nextjs';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <p>مرحباً بك{user.firstName && `, ${user.firstName}`}</p>
      
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button type="submit">تسجيل الخروج</Button>
      </form>
    </div>
  );
}
```

---

## 📋 COMPLETE AUTHENTICATION FLOW EXAMPLE

### Landing Page with Auth Links

```typescript
// app/page.tsx
import Link from 'next/link';
import { withAuth, getSignUpUrl, getSignInUrl } from '@workos-inc/authkit-nextjs';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  // Retrieves the user from the session or returns null if no user is signed in
  const { user } = await withAuth();

  // Get the URL to redirect the user to AuthKit to sign up
  const signUpUrl = await getSignUpUrl();
  const signInUrl = await getSignInUrl();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-bold">أثاث بلس</h1>
        <p className="text-lg text-gray-600">منصة إدارة الأثاث الشاملة</p>
        
        <div className="flex gap-4 mt-8">
          <Link href={signInUrl}>
            <Button>تسجيل الدخول</Button>
          </Link>
          <Link href={signUpUrl}>
            <Button variant="outline">إنشاء حساب</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">مرحباً بك{user.firstName && `, ${user.firstName}`}</h1>
      <p className="text-lg text-gray-600">{user.email}</p>
      
      <Link href="/dashboard" className="mt-8">
        <Button>الانتقال إلى لوحة التحكم</Button>
      </Link>
    </div>
  );
}
```

### Protected Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
import { withAuth } from '@workos-inc/authkit-nextjs';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Automatically redirects to login if not authenticated
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <div className="flex h-screen">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 🔄 AUTHENTICATION METHODS

WorkOS AuthKit supports multiple authentication methods. Configure these in your WorkOS Dashboard:

### Available Methods

1. **Email + Password** - Traditional email/password authentication
2. **Social Login** - OAuth with Google, GitHub, Microsoft, etc.
3. **Magic Link** - Passwordless authentication via email
4. **Passkeys** - Modern passwordless authentication
5. **Single Sign-On (SSO)** - Enterprise SSO with SAML/OIDC
6. **Multi-Factor Auth (MFA)** - Two-factor authentication

### User Object Properties

The user object from `withAuth()` or `useAuth()` contains:

```typescript
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties may be available based on configuration
  organizationId?: string;
  organization?: Organization;
  // ... custom metadata
}
```

---

## 🎯 INTEGRATION WITH EXISTING AUTH PAGES

### Update Login Page

```typescript
// app/(auth)/login/page.tsx
import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { returnPathname?: string };
}) {
  // If already signed in, redirect to dashboard
  const { user } = await withAuth();
  if (user) {
    redirect('/dashboard');
  }

  const returnPathname = searchParams.returnPathname || '/dashboard';
  const { url: signInUrl } = await getSignInUrl({ returnPathname });
  const { url: signUpUrl } = await getSignUpUrl({ returnPathname: '/register' });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
          <p className="text-gray-600 mt-2">
            أهلاً بك مجدداً في منصة <span className="font-bold">أثاث بلس</span>
          </p>
        </div>

        <div className="space-y-4">
          <Link href={signInUrl} className="block">
            <Button className="w-full h-12">تسجيل الدخول</Button>
          </Link>

          <div className="text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link href={signUpUrl} className="font-bold text-primary hover:underline">
              أنشئ حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Update Register Page

```typescript
// app/(auth)/register/page.tsx
import { getSignUpUrl, withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { returnPathname?: string };
}) {
  // If already signed in, redirect to dashboard
  const { user } = await withAuth();
  if (user) {
    redirect('/dashboard');
  }

  const returnPathname = searchParams.returnPathname || '/dashboard';
  const { url: signUpUrl } = await getSignUpUrl({ returnPathname });
  const { url: signInUrl } = await getSignInUrl({ returnPathname: '/login' });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-gray-600 mt-2">
            انضم إلى منصة <span className="font-bold">أثاث بلس</span>
          </p>
        </div>

        <div className="space-y-4">
          <Link href={signUpUrl} className="block">
            <Button className="w-full h-12">إنشاء حساب</Button>
          </Link>

          <div className="text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href={signInUrl} className="font-bold text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔗 INTEGRATION WITH CONVEX BACKEND

### Create User in Convex After Auth

You can create a Convex user record after WorkOS authentication:

```typescript
// app/callback/route.ts
import { handleAuth } from '@workos-inc/authkit-nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export const GET = handleAuth();
```

Or use a server action to sync users:

```typescript
// app/actions/sync-user.ts
'use server';

import { withAuth } from '@workos-inc/authkit-nextjs';
import { api } from '@/../convex/_generated/api';
import { Id } from '@/../convex/_generated/dataModel';

export async function syncUserWithConvex() {
  const { user } = await withAuth({ ensureSignedIn: true });
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Call Convex mutation to create/update user
  // This would typically be done via API route or directly in Convex
  
  return { success: true };
}
```

---

## 📝 MIDDLEWARE CONFIGURATION FOR ANTIG

Recommended middleware configuration for the Antig project:

```typescript
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// Protect dashboard routes, allow public access to landing and auth pages
export default authkitMiddleware({
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
```

---

## ✅ VALIDATION CHECKLIST

After implementing WorkOS AuthKit:

- [ ] WorkOS Dashboard configured with redirect URIs
- [ ] Environment variables set correctly
- [ ] `AuthKitProvider` wraps app layout
- [ ] Middleware configured for route protection
- [ ] Callback route created (`/callback`)
- [ ] Sign-in endpoint/page created
- [ ] Sign-up endpoint/page created
- [ ] Sign-out functionality working
- [ ] Protected routes require authentication
- [ ] User data accessible in components
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Test sign-out flow
- [ ] Test protected route access
- [ ] Test unauthenticated redirects

---

## 📚 ADDITIONAL RESOURCES

- [WorkOS AuthKit Documentation](https://workos.com/docs/authkit/nextjs/2-add-authkit-to-your-app/sign-in-endpoint)
- [WorkOS Dashboard](https://dashboard.workos.com/)
- [WorkOS API Reference](https://workos.com/docs/reference)
- [WorkOS Example Apps](https://github.com/workos/workos-examples)

---

## 🎯 SUMMARY

WorkOS AuthKit provides:

✅ **Hosted Authentication** - No need to build auth UI
✅ **Multiple Auth Methods** - Email/password, social, magic links, SSO
✅ **Easy Integration** - Simple Next.js SDK
✅ **Secure by Default** - Built-in security best practices
✅ **TypeScript Support** - Full type safety
✅ **Session Management** - Automatic session handling
✅ **Route Protection** - Easy middleware integration

**Key Files Structure:**
```
app/
├── layout.tsx              # AuthKitProvider wrapper
├── callback/
│   └── route.ts           # OAuth callback handler
├── login/
│   └── page.tsx           # Sign-in page
├── register/
│   └── page.tsx           # Sign-up page
├── (dashboard)/
│   └── layout.tsx         # Protected routes
└── actions/
    └── auth.ts            # Sign-out action

middleware.ts               # Route protection
```

**Key Environment Variables:**
```bash
WORKOS_API_KEY
WORKOS_CLIENT_ID
WORKOS_COOKIE_PASSWORD
NEXT_PUBLIC_WORKOS_REDIRECT_URI
```

---

**This documentation provides everything needed for an LLM to implement WorkOS AuthKit authentication in the Antig platform, replacing or complementing Clerk authentication.**
