import { test, expect } from '@playwright/test';

test.describe('Form Interactions', () => {
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

    test('should fill product form fields', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products/new');

        // Fill product name
        const nameInput = page.getByPlaceholder(/قميص/);
        await nameInput.fill('Test Product');
        await expect(nameInput).toHaveValue('Test Product');

        // Fill price
        const priceInput = page.locator('input[type="number"]').first();
        await priceInput.fill('99.99');
        await expect(priceInput).toHaveValue('99.99');
    });

    test('should verify organization form loads', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/organization');

        // Verify form elements exist
        await expect(page.locator('input[value="Test Organization"]')).toBeVisible();
        await expect(page.locator('button:has-text("حفظ التغييرات")')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products/new');

        // Try to save without filling required fields
        const saveButton = page.locator('button:has-text("حفظ المنتج")');
        await saveButton.click();

        // Should stay on the same page (validation prevents submission)
        await expect(page).toHaveURL(/.*\/products\/new/);
    });

    test('should handle numeric inputs', async ({ page }) => {
        await page.addInitScript(({ mockState }) => {
            (window as any).__E2E_MOCK_PERMISSION__ = true;
            localStorage.setItem('org-storage', JSON.stringify(mockState.org));
            localStorage.setItem('user-storage', JSON.stringify(mockState.user));
        }, { mockState });

        await page.goto('/products/new');

        // Test price input accepts decimals
        const priceInput = page.locator('input[type="number"]').first();
        await priceInput.fill('123.45');
        await expect(priceInput).toHaveValue('123.45');

        // Test stock input accepts integers
        const stockInputs = page.locator('input[type="number"]');
        const stockInput = stockInputs.nth(1); // Second number input is stock
        await stockInput.fill('100');
        await expect(stockInput).toHaveValue('100');
    });
});
