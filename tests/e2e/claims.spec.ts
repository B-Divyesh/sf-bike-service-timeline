import { expect, test } from '@playwright/test';

test('@claim:demo-isolation opens realistic sample data and never writes the real store', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aster Road' })).toBeVisible();
  await page.getByRole('button', { name: 'Add bike' }).click();
  await page.getByLabel('Bike name Required').fill('Demo-only bike');
  await page.getByRole('dialog').getByRole('button', { name: 'Add bike', exact: true }).click();
  await page.goto('/');
  await expect(page.getByRole('main').getByRole('button', { name: 'Add your first bike' })).toBeVisible();
  await expect(page.getByText('Demo-only bike')).toHaveCount(0);
});

test('@claim:demo-reset restores the shipped sample', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add bike' }).click();
  await page.getByLabel('Bike name Required').fill('Temporary sample change');
  await page.getByRole('dialog').getByRole('button', { name: 'Add bike', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Temporary sample change')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Aster Road' })).toBeVisible();
});

test('@claim:offline-reload works after first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aster Road' })).toBeVisible();
});

test('@claim:csv-export exports the service rows from sample data', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'All history' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('bike-service-history.csv');
  expect(file.suggestedFilename()).toBe('bike-service-history.csv');
});

test('@claim:backup-export downloads a complete JSON backup', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Back up and export' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON backup' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('bike-service-timeline-backup.json');
  expect(file.suggestedFilename()).toBe('bike-service-timeline-backup.json');
});

test('@claim:local-records do not send sample records to another origin', async ({ page }) => {
  const external: string[] = [];
  const productOrigin = 'http://127.0.0.1:4173';
  page.on('request', request => { if (new URL(request.url()).origin !== productOrigin) external.push(request.url()); });
  await page.goto('/demo');
  await page.getByRole('link', { name: 'All history' }).click();
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect(external).toEqual([]);
});

test('@claim:routed-history changes URL, title, and returns with browser navigation', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'All history' }).click();
  await expect(page).toHaveURL(/\/history\?demo=1$/);
  await expect(page).toHaveTitle('Service history — Bike Service Timeline');
  await page.goBack();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { name: /items need a look|Everything in one place/ })).toBeVisible();
});

test('@claim:mobile-targets keeps legal and navigation links touch sized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const name of ['Bike overview', 'All history', 'Back up and export', 'Privacy', 'Terms']) {
    const box = await page.getByRole('link', { name, exact: true }).first().boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});
