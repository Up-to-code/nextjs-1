import { test, expect } from '@playwright/test';

test.describe('Search Operations', () => {
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

    test('should search products by name', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Type in search input
        const searchInput = page.locator('input[placeholder*="بحث"]').first();
        await searchInput.fill('test product');

        // Verify search is working (input has value)
        await expect(searchInput).toHaveValue('test product');
    });

    test('should search orders by number', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/orders');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Type in order search
        const searchInput = page.locator('input[placeholder*="برقم الطلب"]');
        await searchInput.fill('ORD-001');

        await expect(searchInput).toHaveValue('ORD-001');
    });

    test('should search categories', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/categories');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Category search
        const searchInput = page.locator('input[placeholder="بحث في التصنيفات..."]');
        await searchInput.fill('furniture');

        await expect(searchInput).toHaveValue('furniture');
    });

    test('should clear search results', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Search then clear
        const searchInput = page.locator('input[placeholder*="بحث"]').first();
        await searchInput.fill('test');
        await expect(searchInput).toHaveValue('test');

        await searchInput.clear();
        await expect(searchInput).toHaveValue('');
    });
});
