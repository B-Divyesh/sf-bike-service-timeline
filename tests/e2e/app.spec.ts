import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates a bike, component, and service entry that survives reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Track service across all your bikes/);
  await page.getByRole('button', { name: 'Add your first bike' }).click();
  await page.getByLabel('Bike name Required').fill('Green Commuter');
  await page.getByLabel('Current odometer (km)').fill('2400');
  await page.getByRole('button', { name: 'Add bike', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Green Commuter' })).toBeVisible();

  await page.getByRole('button', { name: 'Add component' }).first().click();
  await page.getByLabel('Component Required').fill('Rear brake pads');
  await page.getByLabel('Mileage then (km)').fill('2200');
  await page.getByLabel('Distance (km)').fill('500');
  await page.getByRole('dialog').getByRole('button', { name: 'Add component', exact: true }).click();
  await expect(page.getByText('Rear brake pads')).toBeVisible();

  await page.getByRole('button', { name: 'Log service' }).first().click();
  await page.getByLabel('Component').selectOption({ label: 'Rear brake pads' });
  await page.getByLabel('Type Required').selectOption('Adjusted');
  await page.getByLabel('What was done? Required').fill('Aligned rear brake pads');
  await page.getByLabel('Details').fill('Checked toe-in and cable tension.');
  await page.getByLabel('Repair shop or mechanic').fill('Home stand');
  await page.getByLabel('Cost (your currency)').fill('18.50');
  await page.getByLabel('Receipts or photos').setInputFiles({
    name: 'brake-receipt.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+AvD3VwAAAABJRU5ErkJggg==', 'base64'),
  });
  await page.getByRole('button', { name: 'Save service' }).click();
  await page.getByRole('link', { name: 'All history' }).click();
  await expect(page.getByRole('heading', { name: 'Aligned rear brake pads' })).toBeVisible();
  await expect(page.getByText('Repair shop: Home stand')).toBeVisible();
  await expect(page.getByText('Cost: 18.5')).toBeVisible();
  await expect(page.getByAltText('Attached file: brake-receipt.png')).toBeVisible();

  await page.reload();
  await page.getByRole('link', { name: 'All history' }).click();
  await expect(page.getByRole('heading', { name: 'Aligned rear brake pads' })).toBeVisible();
  await expect(page.getByAltText('Attached file: brake-receipt.png')).toBeVisible();
  const accessibility = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('works offline after the app shell is cached', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByText(/Offline — every change is still saved/)).toBeVisible();
});

test('exports and restores a complete JSON backup', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'The restore flow is viewport-independent.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Add your first bike' }).click();
  await page.getByLabel('Bike name Required').fill('Backup Bike');
  await page.getByRole('button', { name: 'Add bike', exact: true }).click();
  await page.getByRole('link', { name: 'Back up and export', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON backup' }).click();
  const backup = await downloadPromise;
  const backupPath = await backup.path();
  expect(backupPath).toBeTruthy();

  await page.locator('.brand').click();
  await page.getByRole('button', { name: 'Edit Backup Bike' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete bike' }).click();
  await expect(page.getByRole('button', { name: 'Add your first bike' })).toBeVisible();

  await page.getByRole('link', { name: 'Back up and export', exact: true }).click();
  await page.getByLabel('Choose JSON backup').setInputFiles(backupPath!);
  await page.getByRole('button', { name: 'Restore selected backup' }).click();
  await page.locator('.brand').click();
  await expect(page.getByRole('heading', { name: 'Backup Bike' })).toBeVisible();
});

test('shares direct Demo and Privacy navigation on every route', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'The shared header contract is viewport-independent.');
  const routes = ['/', '/demo', '/history?demo=1', '/backup?demo=1', '/privacy/', '/terms/', '/404.html'];
  for (const path of routes) {
    await page.goto(path);
    const links = page.locator('header nav[aria-label="Primary navigation"] a');
    await expect(links).toHaveText(['Demo', 'All history', 'Back up and export', 'Privacy']);
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveAttribute('href', '/demo');
    await expect(links.nth(3)).toHaveAttribute('href', '/privacy/');
    await expect(page.locator('header nav').getByRole('link', { name: 'Bike overview' })).toHaveCount(0);
  }

  await page.goto('/privacy/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Service status' })).toBeVisible();
});

test('has no serious accessibility violations in the empty state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One axe run covers the shared markup.');
  await page.goto('/');
  const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('keeps dialog focus contained and returns focus when closed', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Keyboard behavior is viewport-independent.');
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Add your first bike' });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Bike name Required')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('sets complete metadata on app, legal, and 404 routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Metadata is viewport-independent.');
  const routes = [
    ['/', 'Bike Service Timeline — Track service across all bikes', 'https://bike-service-timeline.sociobot.in/'],
    ['/demo', 'Demo — Bike Service Timeline', 'https://bike-service-timeline.sociobot.in/demo'],
    ['/history?demo=1', 'Service history — Bike Service Timeline', 'https://bike-service-timeline.sociobot.in/history'],
    ['/backup?demo=1', 'Backup and export — Bike Service Timeline', 'https://bike-service-timeline.sociobot.in/backup'],
    ['/privacy/', 'Privacy — Bike Service Timeline', 'https://bike-service-timeline.sociobot.in/privacy/'],
    ['/terms/', 'Terms — Bike Service Timeline', 'https://bike-service-timeline.sociobot.in/terms/'],
    ['/404.html', 'Page not found — Bike Service Timeline', 'https://bike-service-timeline.sociobot.in/404.html'],
  ] as const;
  for (const [path, title, canonical] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /share-workshop\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    expect(await page.locator('h1').count()).toBe(1);
  }
});

test('has no serious accessibility violations on product, legal, and 404 routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One browser covers the shared responsive markup.');
  for (const path of ['/demo', '/history?demo=1', '/backup?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? '')), path).toEqual([]);
  }
});
