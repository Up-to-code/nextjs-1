import { test, expect } from '@playwright/test';

test.describe('Dashboard Components', () => {
    const mockState = {
        org: {
            state: {
                organization: {
                    id: "org_123",
                    name: "Test Organization",
                    workosOrgId: "org_123"
                },
                isLoading: false
            },
            version: 0
        },
        user: {
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
        }
    };

    test('should display dashboard charts', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/dashboard');

        // Check for chart components
        await expect(page.locator('text=الإيرادات').first()).toBeVisible({ timeout: 10000 });
    });

    test('should display recent orders table', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/dashboard');

        // Check for recent orders section
        await expect(page.locator('text=أحدث الطلبات')).toBeVisible();
    });

    test('should display quick actions', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/dashboard');

        // Check for quick action buttons
        await expect(page.locator('text=إضافة منتج').first()).toBeVisible();
    });

    test('should navigate to products from dashboard', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/dashboard');

        // Click on "all products" or similar link
        const productsLink = page.locator('a[href="/products"]').first();
        await productsLink.click();
        await expect(page).toHaveURL(/.*\/products/);
    });
});
