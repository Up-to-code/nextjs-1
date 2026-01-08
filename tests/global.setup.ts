import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, context }) => {
    // 1. Set the bypass cookie
    await context.addCookies([
        {
            name: '__e2e_bypass',
            value: 'true',
            domain: 'localhost',
            path: '/',
        },
    ]);

    await page.goto('/');

    // 2. Inject Client-Side Mock State
    // Mock Org Store
    const mockOrgState = {
        state: {
            organization: {
                id: "org_123",
                name: "Test Organization",
                workosOrgId: "org_123"
            },
            isLoading: false
        },
        version: 0
    };

    // Mock User Store
    const mockUserState = {
        state: {
            user: {
                id: "user_123",
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                profilePictureUrl: null,
                emailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            isAuthenticated: true,
            isLoading: false
        },
        version: 0
    };

    await page.evaluate(({ mockOrg, mockUser }) => {
        localStorage.setItem('org-storage', JSON.stringify(mockOrg));
        localStorage.setItem('user-storage', JSON.stringify(mockUser));

        // Inject global permission mock for usePermission hook
        (window as any).__E2E_MOCK_PERMISSION__ = true;
    }, { mockOrg: mockOrgState, mockUser: mockUserState });

    // 3. Save storage state
    await page.context().storageState({ path: authFile });
});
