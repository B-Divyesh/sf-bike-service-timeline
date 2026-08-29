import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const productOrigin = 'http://127.0.0.1:4173';

async function downloadedText(download: import('@playwright/test').Download): Promise<string> {
  const path = await download.path();
  expect(path).toBeTruthy();
  return readFile(path!, 'utf8');
}

test('@claim:demo-isolation keeps sample records and license keys separate from real use', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== productOrigin) external.push(request.url());
  });
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:bike-service-timeline', 'real-token-must-stay-private');
    localStorage.setItem('sb_license_verdict:bike-service-timeline', '{"valid":true,"checkedAt":1}');
    const reads: string[] = [];
    const writes: string[] = [];
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    const originalRemove = Storage.prototype.removeItem;
    Storage.prototype.getItem = function (key: string) {
      if (key.startsWith('sb_license')) reads.push(key);
      return originalGet.call(this, key);
    };
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key.startsWith('sb_license')) writes.push(key);
      return originalSet.call(this, key, value);
    };
    Storage.prototype.removeItem = function (key: string) {
      if (key.startsWith('sb_license')) writes.push(key);
      return originalRemove.call(this, key);
    };
    Object.assign(window, { __licenseReads: reads, __licenseWrites: writes });
  });

  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await page.evaluate(() => ({
    reads: [...(window as unknown as { __licenseReads: string[] }).__licenseReads],
    writes: [...(window as unknown as { __licenseWrites: string[] }).__licenseWrites],
    token: localStorage.getItem('sb_license:bike-service-timeline'),
    verdict: localStorage.getItem('sb_license_verdict:bike-service-timeline'),
  }))).toEqual({
    reads: [],
    writes: [],
    token: 'real-token-must-stay-private',
    verdict: '{"valid":true,"checkedAt":1}',
  });
  expect(external).toEqual([]);

  await page.getByRole('button', { name: 'Add bike' }).click();
  await page.getByLabel('Bike name Required').fill('Demo-only bike');
  await page.getByRole('dialog').getByRole('button', { name: 'Add bike', exact: true }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('button', { name: 'Add your first bike' })).toBeVisible();
  await expect(page.getByText('Demo-only bike')).toHaveCount(0);

  await page.goto('/demo');
  await expect(page.getByText('Demo-only bike')).toHaveCount(0);
  await expect(page.locator('.bike-card')).toHaveCount(3);
  expect(external).toEqual([]);
});

test('@claim:demo-reset restores the shipped sample data', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add bike' }).click();
  await page.getByLabel('Bike name Required').fill('Temporary sample change');
  await page.getByRole('dialog').getByRole('button', { name: 'Add bike', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Temporary sample change')).toHaveCount(0);
  await expect(page.locator('.bike-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Aster Road' })).toBeVisible();
});

test('@claim:sample-content-and-onboarding shows three useful histories and starts a blank real record', async ({ page }) => {
  await page.goto('/demo');
  for (const bike of ['Aster Road', 'Maple Cargo', 'Pine Trail']) {
    await expect(page.getByRole('heading', { name: bike })).toBeVisible();
  }
  await expect(page.getByText('4,280 km')).toBeVisible();
  await expect(page.getByText('1,860 km')).toBeVisible();
  await expect(page.getByText('920 km')).toBeVisible();
  for (const component of ['Chain', 'Rear brake pads', 'Fork lower service']) {
    await expect(page.getByText(component, { exact: true }).first()).toBeVisible();
  }
  await expect(page.getByText('Due soon', { exact: true })).toBeVisible();
  for (const work of ['Cleaned and rewaxed chain', 'Checked rear brake pads', 'Set fork pressure']) {
    await expect(page.getByText(work, { exact: true }).first()).toBeVisible();
  }
  await page.getByRole('link', { name: 'All history' }).click();
  await expect(page.getByText('Mechanic wrote "recheck at 2,200 km", with even wear.')).toBeVisible();
  await expect(page.getByText('Repair shop: Northside Cycles')).toBeVisible();
  await expect(page.getByText('Cost: 12')).toBeVisible();
  await expect(page.getByRole('link', { name: /northside-brake-receipt\.pdf/ })).toBeVisible();

  await page.goto('/');
  await page.getByRole('button', { name: 'Add your first bike' }).click();
  await expect(page.getByLabel('Bike name Required')).toHaveValue('');
  await expect(page.getByLabel('Notes')).toHaveValue('');
});

test('@claim:offline-reload works after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Service status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aster Road' })).toBeVisible();
  await expect(page.getByText(/Offline — every change is still saved/)).toBeVisible();
});

test('@claim:csv-export exports every sample row in order with valid escaping', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.getByRole('link', { name: 'All history' }).click();
  await context.setOffline(true);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const file = await pending;
  expect(file.suggestedFilename()).toBe('bike-service-history.csv');
  const csv = await downloadedText(file);
  const lines = csv.split('\n');
  expect(lines[0]).toBe('"Date","Bike","Component","Service type","Work performed","Odometer (km)","Cost","Repair shop","Notes","Attachments"');
  expect(lines).toHaveLength(4);
  expect(lines[1]).toContain('"2026-08-12","Maple Cargo","Rear brake pads"');
  expect(lines[2]).toContain('"2026-07-28","Aster Road","Chain"');
  expect(lines[3]).toContain('"2026-06-05","Pine Trail","Fork lower service"');
  expect(lines[1]).toContain('"Mechanic wrote ""recheck at 2,200 km"", with even wear."');
  expect(lines[1]).toContain('"northside-brake-receipt.pdf"');
});

test('@claim:json-export downloads every sample record and required field', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.getByRole('link', { name: 'Back up and export' }).click();
  await context.setOffline(true);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON backup' }).click();
  const file = await pending;
  expect(file.suggestedFilename()).toBe('bike-service-timeline-backup.json');
  const backup = JSON.parse(await downloadedText(file));
  expect(backup).toMatchObject({ product: 'bike-service-timeline', schemaVersion: 1 });
  expect(new Date(backup.exportedAt).toISOString()).toBe(backup.exportedAt);
  expect(backup.bikes.map((item: { id: string }) => item.id).sort()).toEqual(['demo-cargo', 'demo-road', 'demo-trail']);
  expect(backup.components.map((item: { id: string }) => item.id).sort()).toEqual(['demo-brakes', 'demo-chain', 'demo-fork']);
  expect(backup.services.map((item: { id: string }) => item.id).sort()).toEqual(['demo-service-1', 'demo-service-2', 'demo-service-3']);
  for (const bike of backup.bikes) expect(Object.keys(bike).sort()).toEqual(['color', 'createdAt', 'id', 'kind', 'name', 'notes', 'odometer', 'updatedAt']);
  for (const component of backup.components) expect(Object.keys(component).sort()).toEqual(['bikeId', 'createdAt', 'id', 'installedDate', 'installedMileage', 'intervalKm', 'intervalMonths', 'name', 'notes', 'updatedAt']);
  for (const service of backup.services) expect(Object.keys(service).sort()).toEqual(['attachments', 'bikeId', 'componentId', 'cost', 'createdAt', 'date', 'id', 'kind', 'notes', 'odometer', 'updatedAt', 'work', 'workshop']);
  expect(backup.services.find((item: { id: string }) => item.id === 'demo-service-2').attachments[0]).toMatchObject({ id: 'demo-receipt', name: 'northside-brake-receipt.pdf', type: 'application/pdf', size: 407 });
});

test('@claim:local-records keeps the complete demo flow on the product origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add bike' }).click();
  await page.getByLabel('Bike name Required').fill('Privacy check bike');
  await page.getByLabel('Notes').fill('This text must stay local.');
  await page.getByRole('dialog').getByRole('button', { name: 'Add bike', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Privacy check bike' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Privacy check bike' })).toBeVisible();
  await page.getByRole('link', { name: 'Back up and export' }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON backup' }).click();
  await pending;
  await page.getByRole('link', { name: 'Bike overview' }).click();
  await page.getByRole('button', { name: 'Edit Privacy check bike' }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete bike' }).click();
  expect(requests.filter(url => new URL(url).origin !== productOrigin)).toEqual([]);
  expect(await page.locator('script[src]').evaluateAll(elements => elements.map(element => (element as HTMLScriptElement).src).filter(src => new URL(src).origin !== location.origin))).toEqual([]);
});

test('@claim:no-third-party-runtime loads scripts and app files only from this site', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  for (const path of ['/demo', '/history?demo=1', '/backup?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('script[src]').evaluateAll(elements => elements.map(element => (element as HTMLScriptElement).src).filter(src => new URL(src).origin !== location.origin))).toEqual([]);
  }
  expect(requests.filter(url => new URL(url).origin !== productOrigin)).toEqual([]);
});

test('@claim:routed-history supports direct URLs, titles, focus, reload, back, and forward', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'All history' }).click();
  await expect(page).toHaveURL(/\/history\?demo=1$/);
  await expect(page).toHaveTitle('Service history — Bike Service Timeline');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bike-service-timeline.sociobot.in/history');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'All service history' })).toBeVisible();
  await page.getByRole('link', { name: 'Back up and export' }).click();
  await expect(page).toHaveURL(/\/backup\?demo=1$/);
  await expect(page).toHaveTitle('Backup and export — Bike Service Timeline');
  await expect(page.getByRole('heading', { name: 'Backup and export' })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/history\?demo=1$/);
  await expect(page.getByRole('heading', { name: 'All service history' })).toBeFocused();
  await page.goForward();
  await expect(page).toHaveURL(/\/backup\?demo=1$/);
});

test('@claim:history-search-order searches every bike in reverse date order', async ({ page }) => {
  await page.goto('/history?demo=1');
  const entries = page.locator('.full-timeline > li');
  await expect(entries).toHaveCount(3);
  await expect(entries.locator('h2')).toHaveText(['Checked rear brake pads', 'Cleaned and rewaxed chain', 'Set fork pressure']);
  await page.getByLabel('Search records').fill('cargo');
  await expect(entries).toHaveCount(1);
  await expect(entries.getByRole('heading')).toHaveText('Checked rear brake pads');
  await page.getByLabel('Search records').fill('home');
  await expect(entries).toHaveCount(2);
});

test('@claim:print-history opens the printable service history', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { __printCalls: 0 });
    window.print = () => { (window as unknown as { __printCalls: number }).__printCalls += 1; };
  });
  await page.goto('/history?demo=1');
  await page.getByRole('button', { name: 'Print history' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __printCalls: number }).__printCalls)).toBe(1);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.full-timeline')).toBeVisible();
  await expect(page.locator('.site-header nav')).toBeHidden();
});

test('@claim:mobile-targets keeps phone layouts usable and navigation targets at least 44 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/demo', '/history?demo=1', '/backup?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const smallTargets = await page.locator('header a, footer a, .demo-banner button').evaluateAll(elements => elements
      .filter(element => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map(element => {
        const box = element.getBoundingClientRect();
        return { text: element.textContent?.trim(), width: box.width, height: box.height };
      })
      .filter(box => box.width < 44 || box.height < 44));
    expect(smallTargets).toEqual([]);
  }
});
