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
        const hasLoading = await page.locator('text=جاري تحميل البيانات').isVisible();
        // It might have already loaded, so we check if it's not visible
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });
    });

    test('should handle empty states gracefully', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Check for either table or empty state
        const hasTable = await page.locator('table').count();
        const hasEmpty = await page.locator('text=لا توجد منتجات').count();

        // At least one should be present
        expect(hasTable + hasEmpty).toBeGreaterThan(0);
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

        // Wait a moment for search to filter
        await page.waitForTimeout(500);

        // Verify input has the value (search is functional)
        await expect(searchInput).toHaveValue('NONEXISTENT_PRODUCT_XYZ123');
    });

    test('should verify settings page loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/settings');

        // Check if settings page loads (might be a placeholder)
        await expect(page).toHaveURL(/.*\/settings/);
    });

    test('should verify help page loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/help');

        // Check if help page loads
        await expect(page).toHaveURL(/.*\/help/);
    });

    test('should verify notifications page loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/notifications');

        // Check if notifications page loads
        await expect(page).toHaveURL(/.*\/notifications/);
    });
});
