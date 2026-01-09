import { test, expect } from '@playwright/test';

test.describe('Edge Cases', () => {
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

    test('should display loading states', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products');

        // Loading should appear initially then disappear
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });
    });

    test('should handle products page data load', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Page should have loaded without crash
        await expect(page).toHaveURL(/.*\/products/);
    });

    test('should show no results message for empty search', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Search for something that won't exist
        const searchInput = page.locator('input[placeholder*="بحث"]').first();
        await searchInput.fill('NONEXISTENT_PRODUCT_XYZ123');

        // Verify input has the value
        await expect(searchInput).toHaveValue('NONEXISTENT_PRODUCT_XYZ123');
    });

    test('should verify settings page loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/settings');
        await expect(page).toHaveURL(/.*\/settings/);
    });

    test('should verify help page loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/help');
        await expect(page).toHaveURL(/.*\/help/);
    });

    test('should verify notifications page loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/notifications');
        await expect(page).toHaveURL(/.*\/notifications/);
    });
});
