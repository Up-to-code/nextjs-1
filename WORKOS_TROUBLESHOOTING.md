# WorkOS AuthKit Troubleshooting Guide

## Common Errors and Solutions

### Error: "غير مصرح (جلسة غير صالحة)" / "Unauthorized (Invalid Session)"

**Symptoms:**
- Console error: `❌ WorkOS Update Failed: "غير مصرح (جلسة غير صالحة)"`
- Actions fail with unauthorized errors
- User appears logged out even when they're logged in

**Root Causes:**

1. **Using Custom Session Handler Instead of AuthKit SDK**
   - ❌ **Wrong:** Using custom `getCurrentUser()` with `loadSealedSession()`
   - ✅ **Correct:** Use `withAuth()` from `@workos-inc/authkit-nextjs`

2. **Session Cookie Issues**
   - Cookie expired or invalid
   - Cookie password mismatch
   - Cookie not being set correctly

3. **Environment Variables Missing**
   - `WORKOS_COOKIE_PASSWORD` not set or incorrect
   - `WORKOS_API_KEY` missing or invalid
   - `WORKOS_CLIENT_ID` missing

**Solutions:**

#### Solution 1: Use AuthKit's Built-in Session Management

Replace custom session handlers with AuthKit's `withAuth()`:

```typescript
// ❌ WRONG - Don't use custom session handler
import { getCurrentUser } from '@/lib/workos/session';
const { user } = await getCurrentUser();

// ✅ CORRECT - Use AuthKit's withAuth
import { withAuth } from '@workos-inc/authkit-nextjs';
const { user } = await withAuth({ ensureSignedIn: true });
```

#### Solution 2: Verify Environment Variables

Check your `.env.local` file:

```bash
# Required WorkOS variables
WORKOS_API_KEY='sk_example_123456789'
WORKOS_CLIENT_ID='client_123456789'
WORKOS_COOKIE_PASSWORD="<32+ character secure password>"
NEXT_PUBLIC_WORKOS_REDIRECT_URI="http://localhost:3000/callback"
```

**Generate a secure cookie password:**
```bash
openssl rand -base64 32
```

#### Solution 3: Clear Cookies and Re-authenticate

1. Clear browser cookies for your domain
2. Sign out completely
3. Sign in again
4. Verify session is working

#### Solution 4: Check Middleware Configuration

Ensure middleware is properly configured:

```typescript
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/login', '/register', '/callback'],
  },
});

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/callback',
    '/dashboard/:path*',
    // ... other protected routes
  ],
};
```

#### Solution 5: Verify Callback Route

Ensure callback route exists and is properly configured:

```typescript
// app/callback/route.ts
import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth();
```

---

### Error: "No wos-session cookie found"

**Symptoms:**
- Console log: `❌ getCurrentUser: No wos-session cookie found`
- User appears logged out

**Solutions:**

1. **Use AuthKit's Session Management**
   - Don't rely on custom cookie reading
   - Use `withAuth()` or `useAuth()` hooks

2. **Check Cookie Settings**
   - Ensure cookies are enabled in browser
   - Check if cookies are being blocked
   - Verify cookie domain matches your app domain

3. **Verify AuthKit Provider**
   - Ensure `AuthKitProvider` wraps your app in `layout.tsx`

---

### Error: "Failed to load sealed session"

**Symptoms:**
- Console error: `❌ getCurrentUser: Failed to load sealed session`
- Session validation fails

**Solutions:**

1. **Cookie Password Mismatch**
   - Ensure `WORKOS_COOKIE_PASSWORD` matches what was used when session was created
   - Regenerate password and re-authenticate users

2. **Session Expired**
   - Sessions expire after a certain time
   - User needs to sign in again

3. **Use AuthKit SDK Instead**
   - Don't manually load sealed sessions
   - Let AuthKit handle session management

---

## Migration Guide: From Custom Session to AuthKit

### Step 1: Replace Custom Session Calls

**Before:**
```typescript
// lib/workos/session.ts
import { getCurrentUser } from '@/lib/workos/session';
const { user } = await getCurrentUser();
```

**After:**
```typescript
// Use AuthKit directly
import { withAuth } from '@workos-inc/authkit-nextjs';
const { user } = await withAuth({ ensureSignedIn: true });
```

### Step 2: Update Server Actions

**Before:**
```typescript
'use server';
import { getCurrentUser } from '@/lib/workos/session';

export async function myAction() {
  const { user } = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  // ... rest of action
}
```

**After:**
```typescript
'use server';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function myAction() {
  const { user } = await withAuth({ ensureSignedIn: true });
  // User is guaranteed to exist, or user is redirected
  // ... rest of action
}
```

### Step 3: Update Client Components

**Before:**
```typescript
'use client';
// Custom hook or context

export function MyComponent() {
  const user = useUser(); // Custom hook
  // ...
}
```

**After:**
```typescript
'use client';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

export function MyComponent() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  // ...
}
```

---

## Debugging Checklist

When experiencing session issues:

- [ ] Verify `WORKOS_API_KEY` is set correctly
- [ ] Verify `WORKOS_CLIENT_ID` is set correctly
- [ ] Verify `WORKOS_COOKIE_PASSWORD` is at least 32 characters
- [ ] Verify `NEXT_PUBLIC_WORKOS_REDIRECT_URI` matches WorkOS Dashboard
- [ ] Check WorkOS Dashboard redirect URI configuration
- [ ] Verify `AuthKitProvider` wraps app in `layout.tsx`
- [ ] Verify middleware is configured correctly
- [ ] Verify callback route exists (`/callback`)
- [ ] Clear browser cookies and re-authenticate
- [ ] Check browser console for cookie errors
- [ ] Verify user is signed in via WorkOS Dashboard
- [ ] Check if using `withAuth()` instead of custom session handler

---

## Testing Session Flow

1. **Sign In Flow:**
   ```
   User → /login → WorkOS AuthKit → /callback → /dashboard
   ```

2. **Protected Route Access:**
   ```
   User → /dashboard → Middleware checks session → Allow/Redirect
   ```

3. **Server Action:**
   ```
   Client → Server Action → withAuth() → Get user → Execute action
   ```

---

## Common Patterns

### Pattern 1: Server Action with Auth

```typescript
'use server';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function protectedAction(data: any) {
  // Automatically redirects if not signed in
  const { user } = await withAuth({ ensureSignedIn: true });
  
  // User is guaranteed to exist here
  console.log('User:', user.email);
  
  // Your action logic
  return { success: true };
}
```

### Pattern 2: Server Component with Optional Auth

```typescript
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function Page() {
  // Returns null if not signed in (no redirect)
  const { user } = await withAuth();
  
  if (!user) {
    return <div>Please sign in</div>;
  }
  
  return <div>Welcome, {user.email}</div>;
}
```

### Pattern 3: Client Component with Auth

```typescript
'use client';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

export function ClientComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.email}</div>;
}
```

---

## Environment Variables Reference

```bash
# Required
WORKOS_API_KEY='sk_example_123456789'
WORKOS_CLIENT_ID='client_123456789'
WORKOS_COOKIE_PASSWORD="<32+ character password>"

# Required (public)
NEXT_PUBLIC_WORKOS_REDIRECT_URI="http://localhost:3000/callback"
```

---

## Additional Resources

- [WorkOS AuthKit Documentation](https://workos.com/docs/authkit/nextjs)
- [WorkOS Dashboard](https://dashboard.workos.com/)
- [WorkOS Support](https://workos.com/support)

---

## Quick Fix Summary

**If you see "غير مصرح (جلسة غير صالحة)":**

1. ✅ Replace `getCurrentUser()` with `withAuth()`
2. ✅ Verify environment variables
3. ✅ Clear cookies and re-authenticate
4. ✅ Check middleware configuration
5. ✅ Verify callback route exists

**Most Common Fix:**
```typescript
// Replace this:
import { getCurrentUser } from '@/lib/workos/session';
const { user } = await getCurrentUser();

// With this:
import { withAuth } from '@workos-inc/authkit-nextjs';
const { user } = await withAuth({ ensureSignedIn: true });
```
