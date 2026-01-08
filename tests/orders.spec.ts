import { test, expect } from '@playwright/test';

test.describe('Orders', () => {
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
        await page.goto('/orders');
    });

    test('should load orders dashboard', async ({ page }) => {
        // Verify Header
        await expect(page.locator('h2:has-text("الطلبات")')).toBeVisible();

        // Verify Stat Cards
        await expect(page.locator('text=إجمالي الطلبات')).toBeVisible();
        await expect(page.locator('text=قيد الانتظار')).toBeVisible();
        await expect(page.locator('text=مكتملة')).toBeVisible();
        await expect(page.locator('text=ملغاة')).toBeVisible();
    });

    test('should display orders list', async ({ page }) => {
        // Search Input - make specific to avoid ambiguity with global search
        await expect(page.locator('input[placeholder*="برقم الطلب"]')).toBeVisible();

        // Table Headers (checking content of table head)
        await expect(page.locator('th:has-text("رقم الطلب")')).toBeVisible();
        await expect(page.locator('th:has-text("العميل")')).toBeVisible();
        await expect(page.locator('th:has-text("الحالة")')).toBeVisible();
    });
});
