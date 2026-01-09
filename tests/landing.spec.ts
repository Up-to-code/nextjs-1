import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test('should load landing page', async ({ page }) => {
        await page.goto('/');

        // Check for main heading
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
        await page.goto('/');

        // Check hero content
        await expect(page.locator('text=منظومة متكاملة')).toBeVisible();
    });

    test('should display features section', async ({ page }) => {
        await page.goto('/');

        // Check for features
        await expect(page.locator('text=تحليلات متقدمة')).toBeVisible();
        await expect(page.locator('text=إدارة الطلبات')).toBeVisible();
    });

    test('should have login and register links', async ({ page }) => {
        await page.goto('/');

        // Check for auth links
        await expect(page.locator('a[href="/login"]').first()).toBeVisible();
        await expect(page.locator('a[href="/register"]').first()).toBeVisible();
    });

    test('should have working login link', async ({ page }) => {
        await page.goto('/');

        // Check login link exists and is clickable
        const loginLink = page.locator('a[href="/login"]').first();
        await expect(loginLink).toBeVisible();
        await expect(loginLink).toBeEnabled();
    });

    test('should have working register link', async ({ page }) => {
        await page.goto('/');

        // Check register link exists
        const registerLink = page.locator('a[href="/register"]').first();
        await expect(registerLink).toBeVisible();
        await expect(registerLink).toBeEnabled();
    });

    test('should display footer', async ({ page }) => {
        await page.goto('/');

        // Check for footer
        await expect(page.locator('footer')).toBeVisible();
        await expect(page.locator('text=هاوسز إيليت')).toBeVisible();
    });

    test('should display stats section', async ({ page }) => {
        await page.goto('/');

        // Check for stats
        await expect(page.locator('text=شريك نشط')).toBeVisible();
        await expect(page.locator('text=منتج متاح')).toBeVisible();
    });
});
