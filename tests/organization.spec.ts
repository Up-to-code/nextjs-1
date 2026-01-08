import { test, expect } from '@playwright/test';

test.describe('Organization', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;

            // Mock org and user stores to ensure hydration
            const mockOrgState = {
                state: {
                    organization: {
                        id: "org_123",
                        name: "Test Organization",
                        workosOrgId: "org_123",
                        email: "org@test.com"
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
        await page.goto('/organization');
    });

    test('should load organization settings', async ({ page }) => {
        // Verify Header
        await expect(page.locator('h1:has-text("إعدادات المنشأة")')).toBeVisible();

        // Verify Form Inputs
        // Use more stable selectors if possible, e.g., by value if we know it
        await expect(page.locator('input[value="Test Organization"]')).toBeVisible();
        await expect(page.locator('input[value="org@test.com"]')).toBeVisible();
    });

    test('should display members list', async ({ page }) => {
        // Verify Members List Section Heading
        // Based on analysis, the heading is "فريق العمل"
        await expect(page.locator('h3:has-text("فريق العمل")')).toBeVisible();

        // Verify Table Headers
        await expect(page.locator('th:has-text("العضو")')).toBeVisible();
        await expect(page.locator('th:has-text("الدور")')).toBeVisible();

        // Check for invite button (based on analysis it is "دعوة عضو")
        await expect(page.locator('button:has-text("دعوة عضو")')).toBeVisible();
    });
});
