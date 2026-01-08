import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure mocks are valid for every navigation
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
        await page.goto('/dashboard');
    });

    test('should load dashboard with stats', async ({ page }) => {
        // Verify title
        await expect(page).toHaveTitle(/أثاث بلس/);

        // Check for Stat Cards
        await expect(page.locator('text=إجمالي المبيعات')).toBeVisible();
        await expect(page.locator('text=الطلبـات')).toBeVisible();

        // Check for "Recent Orders" section
        await expect(page.locator('h3:has-text("أحدث الطلبات")')).toBeVisible();
    });

    test('should navigate to products page', async ({ page }) => {
        // Click on Products link in sidebar or navigation
        // Assuming there is a nav link. If not accessible, we can visit URL.
        await page.goto('/products');

        await expect(page.locator('h2:has-text("المنتجات")')).toBeVisible();
        // Check if "Add Product" button is visible
        await expect(page.locator('button:has-text("إضافة منتج جديد")')).toBeVisible();
    });
});
