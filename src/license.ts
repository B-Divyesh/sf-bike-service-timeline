export type LicenseState = { unlocked: boolean; checking: boolean; notice: string };

const SLUG = 'bike-service-timeline';
const TOKEN_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

type CachedVerdict = { valid: boolean; checkedAt: number };

export function acceptReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export function initialLicenseState(): LicenseState {
  const token = localStorage.getItem(TOKEN_KEY);
  const cached = parseVerdict();
  return { unlocked: Boolean(token && cached?.valid), checking: Boolean(token), notice: '' };
}

function parseVerdict(): CachedVerdict | null {
  try { return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as CachedVerdict | null; } catch { return null; }
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { unlocked: false, checking: false, notice: '' };
  const cached = parseVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < 86400000) {
    return { unlocked: cached.valid, checking: false, notice: cached.valid ? '' : 'This license is no longer active.' };
  }
  if (!navigator.onLine && cached) return { unlocked: cached.valid, checking: false, notice: 'License status will refresh when you are online.' };
  if (!navigator.onLine) return { unlocked: false, checking: false, notice: 'Connect once to verify this license.' };
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { unlocked: result.valid, checking: false, notice: result.valid ? '' : 'This license is no longer active.' };
  } catch {
    return { unlocked: Boolean(cached?.valid), checking: false, notice: 'Could not refresh the license. Your free records still work.' };
  }
}
