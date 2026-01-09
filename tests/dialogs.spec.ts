import { test, expect } from '@playwright/test';

test.describe('Modal Dialogs', () => {
    const mockState = {
        org: {
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

    test('should open invite member dialog', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/organization');

        // Click invite button
        await page.click('button:has-text("دعوة عضو")');

        // Check dialog opens
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await expect(page.locator('text=دعوة عضو جديد')).toBeVisible();
    });

    test('should have email input in invite dialog', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/organization');

        // Open invite dialog
        await page.click('button:has-text("دعوة عضو")');

        // Check for email input
        await expect(page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="بريد"]')).toBeVisible();
    });

    test('should close dialog on cancel', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/organization');

        // Open dialog
        await page.click('button:has-text("دعوة عضو")');
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Close dialog (click outside or close button)
        await page.keyboard.press('Escape');
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });
});
