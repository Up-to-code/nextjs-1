import { test, expect } from '@playwright/test';

test.describe('Products', () => {
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
        await page.goto('/products');
    });

    test('should display empty state or list', async ({ page }) => {
        // Wait for loading to finish
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Verify the products table is visible (it exists even if empty)
        await expect(page.locator('table').first()).toBeVisible();
    });

    test('should open add product page', async ({ page }) => {
        await page.click('text=إضافة منتج جديد');
        await expect(page).toHaveURL(/.*\/products\/new/);

        // Check form is loaded - use visible heading and input placeholders
        await expect(page.locator('h1:has-text("إضافة منتج جديد")')).toBeVisible();
        await expect(page.getByPlaceholder(/قميص/)).toBeVisible();
        await expect(page.locator('input[type="number"]').first()).toBeVisible();
    });
});
