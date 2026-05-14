import { test, expect } from '@playwright/test';

test.describe('RequestList — Phase 3: Request List View', () => {

  // SC2: Empty state when no requests exist
  test('SC2: shows "No requests yet." when backend returns empty array', async ({ page }) => {
    // Mock GET /api/requests to return empty array
    await page.route('**/api/requests', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="empty-state"], [data-testid="request-table"]');

    // Empty state must be shown
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-state"]')).toHaveText('No requests yet.');

    // Table must NOT be present
    await expect(page.locator('[data-testid="request-table"]')).not.toBeVisible();
  });

  // SC1: Table renders stored requests with Name/Title/Description columns
  test('SC1: table displays requests with Name, Title, Description columns', async ({ page }) => {
    // Mock GET /api/requests to return sample data
    await page.route('**/api/requests', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              name: 'Alice Johnson',
              title: 'Fix login button',
              description: 'The login button is broken on mobile',
              createdAt: '2026-05-08T14:00:00Z',
            },
            {
              id: 2,
              name: 'Bob Smith',
              title: 'Add dark mode',
              description: 'Please add a dark mode option',
              createdAt: '2026-05-08T15:00:00Z',
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Table must be visible
    await expect(page.locator('[data-testid="request-table"]')).toBeVisible({ timeout: 5000 });

    // Column headers: Name, Title, Description
    await expect(page.locator('[data-testid="request-table"] thead th').nth(0)).toHaveText('Name');
    await expect(page.locator('[data-testid="request-table"] thead th').nth(1)).toHaveText('Title');
    await expect(page.locator('[data-testid="request-table"] thead th').nth(2)).toHaveText('Description');

    // Data rows contain the submitted values
    await expect(page.locator('[data-testid="request-table"] tbody')).toContainText('Alice Johnson');
    await expect(page.locator('[data-testid="request-table"] tbody')).toContainText('Fix login button');
    await expect(page.locator('[data-testid="request-table"] tbody')).toContainText('Bob Smith');
    await expect(page.locator('[data-testid="request-table"] tbody')).toContainText('Add dark mode');

    // Empty state must NOT be shown when there is data
    await expect(page.locator('[data-testid="empty-state"]')).not.toBeVisible();
  });

  // SC3: Auto-refresh after form submission — table updates without page reload
  test('SC3: table auto-refreshes after successful form submission without page reload', async ({ page }) => {
    const uniqueName = `Test User ${Date.now()}`;
    let getCallCount = 0;

    // First GET returns empty, second GET (after POST) returns the new record
    await page.route('**/api/requests', async (route) => {
      if (route.request().method() === 'GET') {
        getCallCount++;
        if (getCallCount === 1) {
          // Initial load: empty
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        } else {
          // After form submit: return the new record
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 1,
                name: uniqueName,
                title: 'Auto-refresh Test Title',
                description: 'Testing auto-refresh behavior',
                createdAt: '2026-05-08T14:00:00Z',
              },
            ]),
          });
        }
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            name: uniqueName,
            title: 'Auto-refresh Test Title',
            description: 'Testing auto-refresh behavior',
            createdAt: '2026-05-08T14:00:00Z',
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Initial state: empty
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible({ timeout: 5000 });

    // Fill and submit form
    await page.fill('[data-testid="name-input"]', uniqueName);
    await page.fill('[data-testid="title-input"]', 'Auto-refresh Test Title');
    await page.fill('[data-testid="description-input"]', 'Testing auto-refresh behavior');
    await page.click('[data-testid="submit-button"]');

    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 5000 });

    // Table should appear with the new record — WITHOUT page.reload()
    await expect(page.locator('[data-testid="request-table"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="request-table"] tbody')).toContainText(uniqueName);

    // Confirm no page reload happened — success message still visible
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  // Error state test
  test('shows error state when GET /api/requests fails', async ({ page }) => {
    await page.route('**/api/requests', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ errorCode: 'INTERNAL_ERROR', message: 'Server error' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="error-state"], [data-testid="request-table"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="error-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-state"]')).toHaveText('Could not load requests.');
  });
});
