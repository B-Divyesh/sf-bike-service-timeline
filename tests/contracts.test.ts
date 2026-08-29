import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

describe('factory contracts', () => {
  it('maps every registered claim to exactly one tagged test', () => {
    const claims = JSON.parse(read('.factory/claims.json')) as Array<{ id: string; claim: string; where: string; test: string; sandbox: string }>;
    const testSources = [read('tests/e2e/claims.spec.ts'), read('tests/utils.test.ts')].join('\n');
    expect(new Set(claims.map(item => item.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim).toBeTruthy();
      expect(claim.where).toBeTruthy();
      expect(claim.test).toBeTruthy();
      expect(claim.sandbox).toBeTruthy();
      const tag = '@' + 'claim:' + claim.id;
      expect(testSources.split(tag)).toHaveLength(2);
    }
  });

  it('ships the offline and static-host contract', () => {
    const manifest = JSON.parse(read('public/manifest.webmanifest'));
    expect(manifest).toMatchObject({ display: 'standalone', start_url: '/?source=installed&v=1' });
    expect(manifest.icons.some((icon: { sizes: string; purpose?: string }) => icon.sizes === '512x512' && icon.purpose?.includes('maskable'))).toBe(true);
    const config = JSON.parse(read('public/staticwebapp.config.json'));
    expect(config.responseOverrides['404'].rewrite).toBe('/404.html');
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Content-Security-Policy']).not.toContain('api.sociobot.in');
    expect(config.routes).not.toContainEqual(expect.objectContaining({ route: '/pass' }));
  });

  it('keeps the catalog description verb-first and at most 120 characters', () => {
    const description = read('.factory/catalog-description.txt').trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Track\b/);
  });
});

