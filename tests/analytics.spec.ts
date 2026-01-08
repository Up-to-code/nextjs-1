import { test, expect } from '@playwright/test';

test.describe('Analytics', () => {
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
        await page.goto('/analytics');
    });

    test('should load analytics dashboard', async ({ page }) => {
        // Verify Header
        await expect(page.locator('h2:has-text("التقارير والتحليلات")')).toBeVisible();

        // Verify date picker is present
        await expect(page.locator('button:has-text("تصدير البيانات")')).toBeVisible();
    });

    test('should display analytics stat cards', async ({ page }) => {
        // Verify all stat cards
        await expect(page.locator('text=متوسط قيمة الطلب')).toBeVisible();
        await expect(page.locator('text=معدل التحويل')).toBeVisible();
        await expect(page.locator('text=الزوار الجدد')).toBeVisible();
        await expect(page.locator('text=صافي الأرباح')).toBeVisible();
    });

    test('should display charts and tables', async ({ page }) => {
        // Check for chart section headings - use h3 to be specific
        await expect(page.locator('h3:has-text("الإيرادات")')).toBeVisible();
        await expect(page.locator('h3:has-text("المبيعات")')).toBeVisible();

        // Check for products section (simplified check)
        await expect(page.locator('h3').filter({ hasText: 'منتجات' })).toBeVisible();
    });
});
