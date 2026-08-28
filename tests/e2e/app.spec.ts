import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates a bike, component, and service entry that survives reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Every bike has a story/);
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
  await page.getByRole('button', { name: 'Save service' }).click();
  await page.getByRole('button', { name: 'All history' }).click();
  await expect(page.getByRole('heading', { name: 'Aligned rear brake pads' })).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'All history' }).click();
  await expect(page.getByRole('heading', { name: 'Aligned rear brake pads' })).toBeVisible();
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
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON backup' }).click();
  const backup = await downloadPromise;
  const backupPath = await backup.path();
  expect(backupPath).toBeTruthy();

  await page.getByRole('button', { name: 'Bench' }).click();
  await page.getByRole('button', { name: 'Edit Backup Bike' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete bike' }).click();
  await expect(page.getByRole('button', { name: 'Add your first bike' })).toBeVisible();

  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  await page.getByLabel('Choose JSON backup').setInputFiles(backupPath!);
  await page.getByRole('button', { name: 'Restore selected backup' }).click();
  await page.getByRole('button', { name: 'Bench' }).click();
  await expect(page.getByRole('heading', { name: 'Backup Bike' })).toBeVisible();
});

test('has no serious accessibility violations in the empty state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One axe run covers the shared markup.');
  await page.goto('/');
  const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});
