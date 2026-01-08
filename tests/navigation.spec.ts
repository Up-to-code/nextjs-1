import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;

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
        await page.goto('/dashboard');
    });

    test('should navigate through sidebar links', async ({ page }) => {
        // Navigate to Products
        await page.click('a:has-text("المنتجات")');
        await expect(page).toHaveURL(/\/products/);
        await expect(page.locator('h2:has-text("المنتجات")')).toBeVisible();

        // Navigate to Orders
        await page.click('a:has-text("الطلبات")');
        await expect(page).toHaveURL(/\/orders/);
        await expect(page.locator('h2:has-text("الطلبات")')).toBeVisible();

        // Navigate to Analytics
        await page.click('a:has-text("التحليلات")');
        await expect(page).toHaveURL(/\/analytics/);
        await expect(page.locator('h2:has-text("التقارير والتحليلات")')).toBeVisible();

        // Navigate to Categories
        await page.click('a:has-text("التصنيفات")');
        await expect(page).toHaveURL(/\/categories/);
        await expect(page.locator('h2:has-text("التصنيفات")')).toBeVisible();

        // Navigate back to Dashboard
        await page.click('a:has-text("لوحة التحكم")');
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should navigate to organization settings', async ({ page }) => {
        // Click on organization link in sidebar
        await page.click('a:has-text("منشأتي")');
        await expect(page).toHaveURL(/\/organization/);
        await expect(page.locator('h1:has-text("إعدادات المنشأة")')).toBeVisible();
    });

    test('should navigate to product details when clicking product', async ({ page }) => {
        // Go to products page
        await page.goto('/products');
        await expect(page.locator('text=جاري تحميل البيانات')).not.toBeVisible({ timeout: 10000 });

        // Check if there are any products to click
        const productRows = await page.locator('table tbody tr').count();
        if (productRows > 0 && !await page.locator('text=لا توجد منتجات').isVisible()) {
            // Click first product row's action button or view link if available
            const viewButtons = await page.locator('button:has-text("عرض"), a[href*="/products/"]').count();
            if (viewButtons > 0) {
                await page.locator('button:has-text("عرض"), a[href*="/products/"]').first().click();
                // URL should change to product detail
                await page.waitForURL(/\/products\/.+/);
            }
        }
    });
});
