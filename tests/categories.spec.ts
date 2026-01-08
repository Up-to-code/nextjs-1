import { test, expect } from '@playwright/test';

test.describe('Categories', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;

            // Mock org and user stores
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

            localStorage.setItem('org-storage', JSON.stringify(mockOrgState));
            localStorage.setItem('user-storage', JSON.stringify(mockUserState));
        });
        await page.goto('/categories');
    });

    test('should load categories page', async ({ page }) => {
        // Verify Header
        await expect(page.locator('h2:has-text("التصنيفات")')).toBeVisible();
        await expect(page.locator('p:has-text("إدارة تصنيفات المنتجات")')).toBeVisible();
    });

    test('should display add category button', async ({ page }) => {
        // Check for Add Category button
        await expect(page.locator('button:has-text("إضافة تصنيف")')).toBeVisible();
    });

    test('should display categories list', async ({ page }) => {
        // Wait for data to load
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Check for table or empty state
        const hasTable = await page.locator('table').count();
        const hasEmptyState = await page.locator('text=لا توجد تصنيفات').count();

        expect(hasTable + hasEmptyState).toBeGreaterThan(0);
    });

    test('should have search functionality', async ({ page }) => {
        // Check for specific search input to avoid strict mode violation
        await expect(page.locator('input[placeholder="بحث في التصنيفات..."]')).toBeVisible();
    });
});
