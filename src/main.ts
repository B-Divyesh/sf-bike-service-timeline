import './styles.css';
import { clearDemoData, isDemoMode, loadData, mergeData, putRecord, removeRecord, replaceData } from './db';
import { demoData } from './demo';
import { acceptReturnedLicense, checkoutUrl, clearLicense, initialLicenseState, storeLicense, verifyLicense, type LicenseState } from './license';
import { registerServiceWorker } from './sw-register';
import type { AppData, Attachment, Bike, Component, ServiceEntry } from './types';
import { computeDueStates, createBackup, escapeHtml as e, formatDate, formatDistance, parseBackup, serviceCsv, today } from './utils';

type View = 'bench' | 'timeline' | 'backup' | 'pass';

const app = document.querySelector<HTMLDivElement>('#app')!;
const dialogRoot = document.querySelector<HTMLDivElement>('#dialog-root')!;
const liveRegion = document.querySelector<HTMLDivElement>('#live-region')!;
let data: AppData = { bikes: [], components: [], services: [] };
let view: View = routeToView(location.pathname);
let selectedBike = 'all';
let searchTerm = '';
let online = navigator.onLine;
let license: LicenseState;

try {
  acceptReturnedLicense();
  license = initialLicenseState();
} catch {
  license = { unlocked: false, checking: false, notice: '' };
}

void initialise();

async function initialise(): Promise<void> {
  try {
    data = await loadData();
    if (isDemoMode() && !data.bikes.length) { await replaceData(demoData()); data = await loadData(); }
    readRouteAction();
    renderRoute(true);
    license = await verifyLicense();
    renderRoute(true);
  } catch (error) {
    renderFatal(error instanceof Error ? error.message : 'Your records could not be opened.');
  }

  window.addEventListener('online', () => { online = true; announce('Back online. Your records stayed on this device.'); render(); void refreshLicense(); });
  window.addEventListener('offline', () => { online = false; announce('You are offline. You can keep working.'); render(); });
  window.addEventListener('popstate', () => { view = routeToView(location.pathname); renderRoute(true); });
  registerServiceWorker((registration) => showUpdate(registration));
}

function routeToView(path: string): View {
  if (path === '/history') return 'timeline';
  if (path === '/backup') return 'backup';
  if (path === '/pass') return 'pass';
  return 'bench';
}

function viewPath(target: View): string {
  const demoQuery = isDemoMode() ? '?demo=1' : '';
  if (target === 'timeline') return `/history${demoQuery}`;
  if (target === 'backup') return `/backup${demoQuery}`;
  if (target === 'pass') return `/pass${demoQuery}`;
  return isDemoMode() ? '/demo' : '/';
}

function routeTitle(): string {
  if (isDemoMode() && view === 'bench') return 'Demo — Bike Service Timeline';
  return ({ bench: 'Bike Service Timeline — Track service across bikes', timeline: 'Service history — Bike Service Timeline', backup: 'Back up and export — Bike Service Timeline', pass: 'Workshop Pass — Bike Service Timeline' } as Record<View, string>)[view];
}

function navigate(target: View): void {
  view = target;
  history.pushState({}, '', viewPath(target));
  renderRoute();
}

function renderRoute(fromPop = false): void {
  render();
  document.title = routeTitle();
  const path = location.pathname === '/demo' ? '/demo' : viewPath(view).split('?')[0];
  const canonical = `https://bike-service-timeline.sociobot.in${path}`;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
  const main = document.querySelector<HTMLElement>('#main');
  if (!fromPop) window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  main?.setAttribute('tabindex', '-1');
  requestAnimationFrame(() => { main?.focus({ preventScroll: true }); announce(`${document.querySelector('h1')?.textContent ?? 'Page'} loaded.`); });
}

function readRouteAction(): void {
  const url = new URL(location.href);
  if (url.searchParams.get('action') === 'service') {
    url.searchParams.delete('action');
    history.replaceState({}, '', `${url.pathname}${url.search}`);
    queueMicrotask(() => data.bikes.length ? openServiceDialog() : openBikeDialog());
  }
}

async function refreshLicense(force = false): Promise<void> {
  license = { ...license, checking: true };
  render();
  license = await verifyLicense(force);
  render();
}

function renderFatal(message: string): void {
  app.innerHTML = `<main id="main" class="fatal-sheet"><h1>The workshop would not open</h1><p>${e(message)}</p><p>Your browser may be blocking local storage. Allow site data for this app, then reload.</p><button class="button primary" id="reload">Reload app</button></main>`;
  document.querySelector('#reload')?.addEventListener('click', () => location.reload());
}

function render(): void {
  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="/">
        <img src="/icon.svg" width="42" height="42" alt="" />
        <span><strong>Bike Service</strong><small>Timeline</small></span>
      </a>
      <nav aria-label="Primary navigation">
        ${navLink('bench', 'Bike overview')}
        ${navLink('timeline', 'All history')}
        ${navLink('backup', 'Back up and export')}
        ${navLink('pass', license.unlocked ? 'Pass active' : 'Workshop Pass')}
      </nav>
      <button class="button primary header-action" data-action="${data.bikes.length ? 'service' : 'bike'}">${data.bikes.length ? 'Log service' : 'Add a bike'}</button>
    </header>
    ${isDemoMode() ? '<div class="demo-banner" role="status">Demo — sample data, nothing is saved <span><button class="link-button" data-action="reset-demo">Reset demo</button><a class="link-button" href="/">Start for real</a></span></div>' : ''}
    ${!online ? '<div class="offline-banner" role="status"><span aria-hidden="true">●</span> Offline — every change is still saved on this device.</div>' : ''}
    ${license.notice ? `<div class="license-notice" role="status">${e(license.notice)} ${license.unlocked ? '' : `<a href="${checkoutUrl}">View the pass</a>`}</div>` : ''}
    ${renderMain()}
    <footer>
      <div><strong>Bike Service Timeline</strong><p>Service history for people who maintain more than one bike.</p></div>
      <div class="footer-links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><button class="link-button" data-action="backup">Export backup</button></div>
      <p class="factory-note">Built by Param Factory · build ${import.meta.env.VITE_BUILD_ID ?? 'a4a2a1e'}</p>
      <p class="art-note">Paper-workshop illustration created with AI assistance for this product.</p>
    </footer>`;
  bindMainEvents();
}

function navLink(target: View, label: string): string {
  return `<a class="nav-button ${view === target ? 'active' : ''}" href="${viewPath(target)}" data-view="${target}" ${view === target ? 'aria-current="page"' : ''}>${label}</a>`;
}

function renderMain(): string {
  if (view === 'timeline') return renderTimeline();
  if (view === 'backup') return renderBackup();
  if (view === 'pass') return renderPass();
  return renderBench();
}

function renderBench(): string {
  if (!data.bikes.length) {
    return `<main id="main" class="empty-main">
      <section class="empty-copy">
        <span class="eyebrow">Private service history for all your bikes</span>
        <h1>Track service across all your bikes</h1>
        <p class="lede">For people who maintain several bikes and need one history plus a clear view of what is due next.</p>
        <div class="action-row"><a class="button primary" href="/demo">Try it with sample data</a><button class="button secondary" data-action="bike">Add your first bike</button></div>
        <p class="action-help">The sample opens three local bike histories. Adding a bike opens a blank record.</p>
        <ul class="trust-list" aria-label="Product facts"><li>Stored in this browser</li><li>Works offline after the first visit</li><li>Export JSON or CSV</li></ul>
      </section>
      <figure class="hero-figure">
        <picture><source srcset="/assets/hero-workshop.avif" type="image/avif" /><source srcset="/assets/hero-workshop.webp" type="image/webp" /><img src="/assets/hero-workshop.jpg" width="1024" height="683" fetchpriority="high" decoding="async" alt="Layered paper workshop with road, cargo, and mountain bikes connected by blank service tags" /></picture>
        <figcaption>One quiet workshop for every bicycle you keep.</figcaption>
      </figure>
      <section class="landing-details" aria-label="How Bike Service Timeline works">
        <div><h2>See the service view before adding records</h2><p>Sample road, cargo, and mountain bikes show due reminders and service history.</p></div>
        <div class="how-it-works"><h2>How it works</h2><ol><li><strong>Add bikes</strong><span>Keep odometers and notes together.</span></li><li><strong>Log service</strong><span>Record work, cost, and repair shop details.</span></li><li><strong>Check what is due</strong><span>Use your own date and distance reminders.</span></li></ol></div>
        <div><h2>Privacy and limits</h2><p>Records stay in this browser unless you export them. Reminders are personal planning aids, not safety advice.</p></div>
        <div><h2>Workshop Pass</h2><p>Free: two bikes. US$19 once: unlimited bikes and receipt or photo attachments.</p><a href="/pass">See Workshop Pass details</a></div>
      </section>
    </main>`;
  }

  const due = computeDueStates(data);
  const attention = due.filter((item) => item.status === 'overdue' || item.status === 'soon');
  const recent = [...data.services].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  return `<main id="main" class="page-shell">
    <section class="page-heading bench-heading">
      <div><span class="eyebrow">Your workshop today</span><h1>${attention.length ? `${attention.length} ${attention.length === 1 ? 'item needs' : 'items need'} a look` : 'Everything in one place'}</h1><p>${attention.length ? 'Intervals are owner-set reminders, not a safety assessment.' : 'Add service work as it happens; your next-service view updates automatically.'}</p></div>
      <div class="heading-actions"><button class="button primary" data-action="service">Log service</button><button class="button secondary" data-action="bike">Add bike</button></div>
    </section>
    <section aria-labelledby="bikes-title" class="section-block">
      <div class="section-heading"><div><span class="kicker">The rack</span><h2 id="bikes-title">Your bikes</h2></div><span class="count-tag">${data.bikes.length} ${data.bikes.length === 1 ? 'bike' : 'bikes'}</span></div>
      <div class="bike-grid">${data.bikes.map(renderBikeCard).join('')}</div>
    </section>
    <div class="bench-columns">
      <section aria-labelledby="next-title" class="section-block due-panel">
        <div class="section-heading"><div><span class="kicker">On the bench</span><h2 id="next-title">Next service</h2></div><button class="link-button" data-view="timeline">See history</button></div>
        ${renderDueList(due)}
      </section>
      <section aria-labelledby="recent-title" class="section-block recent-panel">
        <div class="section-heading"><div><span class="kicker">Paper trail</span><h2 id="recent-title">Recent work</h2></div></div>
        ${recent.length ? `<ol class="mini-timeline">${recent.map(renderMiniEntry).join('')}</ol>` : `<div class="quiet-empty"><span class="empty-icon" aria-hidden="true">✓</span><p>No service entries yet.</p><button class="link-button" data-action="service">Log the first one</button></div>`}
      </section>
    </div>
  </main>`;
}

function renderBikeCard(bike: Bike): string {
  const components = data.components.filter((item) => item.bikeId === bike.id);
  const services = data.services.filter((item) => item.bikeId === bike.id);
  const due = computeDueStates({ bikes: [bike], components, services });
  const attention = due.filter((item) => item.status === 'overdue' || item.status === 'soon').length;
  return `<article class="bike-card" style="--bike-color:${e(bike.color)}">
    <div class="bike-card-top"><span class="bike-swatch" aria-hidden="true"></span><span class="status-chip ${attention ? 'warn' : 'good'}">${attention ? `${attention} due` : 'Up to date'}</span></div>
    <h3>${e(bike.name)}</h3><p>${e(bike.kind)} · <span class="numeric">${formatDistance(bike.odometer)}</span></p>
    <dl><div><dt>Components</dt><dd>${components.length}</dd></div><div><dt>Service entries</dt><dd>${services.length}</dd></div></dl>
    <div class="card-actions"><button class="link-button" data-action="component" data-bike="${bike.id}">Add component</button><button class="icon-button" data-action="edit-bike" data-id="${bike.id}" aria-label="Edit ${e(bike.name)}">•••</button></div>
  </article>`;
}

function renderDueList(due: ReturnType<typeof computeDueStates>): string {
  if (!data.components.length) return `<div class="quiet-empty"><span class="empty-icon" aria-hidden="true">＋</span><p>Add a component to set your own date or distance reminder.</p><button class="link-button" data-action="component">Add a component</button></div>`;
  const ordered = [...due].sort((a, b) => ({ overdue: 0, soon: 1, current: 2, unscheduled: 3 }[a.status] - { overdue: 0, soon: 1, current: 2, unscheduled: 3 }[b.status]));
  return `<ul class="due-list">${ordered.slice(0, 6).map((item) => `<li>
    <span class="due-mark ${item.status}" aria-hidden="true">${item.status === 'overdue' ? '!' : item.status === 'soon' ? '↗' : item.status === 'current' ? '✓' : '–'}</span>
    <div><strong>${e(item.component.name)}</strong><span>${e(item.bike.name)} · ${e(item.reason)}</span></div>
    <span class="status-word ${item.status}">${item.status === 'soon' ? 'Due soon' : item.status}</span><button class="icon-button" data-action="edit-component" data-id="${item.component.id}" aria-label="Edit ${e(item.component.name)}">•••</button>
  </li>`).join('')}</ul>`;
}

function renderMiniEntry(entry: ServiceEntry): string {
  const bike = data.bikes.find((item) => item.id === entry.bikeId);
  const component = data.components.find((item) => item.id === entry.componentId);
  return `<li><time datetime="${entry.date}">${formatDate(entry.date)}</time><span class="timeline-dot" aria-hidden="true"></span><div><strong>${e(entry.work)}</strong><span>${e(bike?.name ?? 'Deleted bike')}${component ? ` · ${e(component.name)}` : ''}</span></div></li>`;
}

function renderTimeline(): string {
  const entries = [...data.services]
    .filter((entry) => selectedBike === 'all' || entry.bikeId === selectedBike)
    .filter((entry) => {
      const bike = data.bikes.find((item) => item.id === entry.bikeId)?.name ?? '';
      const component = data.components.find((item) => item.id === entry.componentId)?.name ?? '';
      return `${entry.work} ${entry.notes} ${entry.workshop} ${entry.kind} ${bike} ${component}`.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  return `<main id="main" class="page-shell timeline-page">
    <section class="page-heading"><div><span class="eyebrow">Every bike · one chronology</span><h1>All service history</h1><p>Search the entire ownership record without opening bikes one by one.</p></div><div class="heading-actions"><button class="button primary" data-action="service" ${data.bikes.length ? '' : 'disabled'}>Log service</button><button class="button secondary" data-action="csv">Export CSV</button><button class="button secondary print-button" data-action="print">Print</button></div></section>
    <section class="timeline-controls" aria-label="Timeline filters">
      <label class="search-field"><span>Search records</span><input id="timeline-search" type="search" value="${e(searchTerm)}" placeholder="Chain, brake, workshop…" /></label>
      <label><span>Bike</span><select id="bike-filter"><option value="all">All bikes</option>${data.bikes.map((bike) => `<option value="${bike.id}" ${selectedBike === bike.id ? 'selected' : ''}>${e(bike.name)}</option>`).join('')}</select></label>
      <span class="result-count" aria-live="polite">${entries.length} ${entries.length === 1 ? 'record' : 'records'}</span>
    </section>
    ${entries.length ? `<ol class="full-timeline">${entries.map(renderTimelineEntry).join('')}</ol>` : renderTimelineEmpty()}
  </main>`;
}

function renderTimelineEntry(entry: ServiceEntry): string {
  const bike = data.bikes.find((item) => item.id === entry.bikeId);
  const component = data.components.find((item) => item.id === entry.componentId);
  return `<li class="timeline-entry">
    <div class="date-tab"><time datetime="${entry.date}">${formatDate(entry.date)}</time></div>
    <span class="entry-pin" aria-hidden="true"></span>
    <article>
      <div class="entry-top"><div><span class="service-kind">${e(entry.kind)}</span><h2>${e(entry.work)}</h2></div><button class="icon-button" data-action="delete-service" data-id="${entry.id}" aria-label="Delete service entry ${e(entry.work)}">×</button></div>
      <p class="entry-context"><strong>${e(bike?.name ?? 'Deleted bike')}</strong>${component ? ` <span aria-hidden="true">›</span> ${e(component.name)}` : ''}${entry.odometer !== null ? ` · <span class="numeric">${formatDistance(entry.odometer)}</span>` : ''}</p>
      ${entry.notes ? `<p>${e(entry.notes)}</p>` : ''}
      <div class="entry-meta">${entry.workshop ? `<span>Workshop: ${e(entry.workshop)}</span>` : ''}${entry.cost !== null ? `<span>Cost: <span class="numeric">${e(entry.cost.toLocaleString())}</span></span>` : ''}</div>
      ${entry.attachments.length ? `<div class="attachments" aria-label="Attachments">${entry.attachments.map((file) => file.type.startsWith('image/') ? `<a href="${file.dataUrl}" download="${e(file.name)}"><img src="${file.dataUrl}" width="72" height="72" loading="lazy" alt="Attached file: ${e(file.name)}" /></a>` : `<a class="file-chip" href="${file.dataUrl}" download="${e(file.name)}">↧ ${e(file.name)}</a>`).join('')}</div>` : ''}
    </article>
  </li>`;
}

function renderTimelineEmpty(): string {
  const filtered = data.services.length > 0;
  return `<section class="timeline-empty"><span class="empty-icon" aria-hidden="true">${filtered ? '⌕' : '✓'}</span><h2>${filtered ? 'No records match' : 'The paper trail starts here'}</h2><p>${filtered ? 'Try another bike or a broader search.' : 'Log a tune-up, replacement, inspection, or small repair. It will appear here in date order.'}</p>${filtered ? '<button class="button secondary" data-action="clear-filters">Clear filters</button>' : data.bikes.length ? '<button class="button primary" data-action="service">Log first service</button>' : '<button class="button primary" data-action="bike">Add a bike</button>'}</section>`;
}

function renderBackup(): string {
  return `<main id="main" class="page-shell narrow-page">
    <section class="page-heading"><div><span class="eyebrow">Portable by design</span><h1>Backup & export</h1><p>These records live only in this browser. Keep a JSON backup somewhere you control.</p></div></section>
    <section class="backup-grid">
      <article class="paper-panel"><span class="panel-number">01</span><h2>Complete backup</h2><p>Includes bikes, components, service notes, and attached receipts or photos. Use it to move devices or recover everything.</p><button class="button primary" data-action="json">Download JSON backup</button><p class="microcopy">${data.bikes.length} bikes · ${data.components.length} components · ${data.services.length} entries</p></article>
      <article class="paper-panel"><span class="panel-number">02</span><h2>Spreadsheet export</h2><p>A readable chronological CSV for a mechanic, insurer, buyer, or your own archive. Attachments stay in the JSON backup.</p><button class="button secondary" data-action="csv">Export service CSV</button><button class="button secondary" data-action="print">Print timeline</button></article>
      <article class="paper-panel restore-panel"><span class="panel-number">03</span><h2>Restore a backup</h2><p>Choose a Bike Service Timeline JSON file. Merge keeps the newest version of each matching record; replace clears this device first.</p><label class="file-drop"><span>Choose JSON backup</span><input id="backup-file" type="file" accept="application/json,.json" /></label><fieldset><legend>How to restore</legend><label><input type="radio" name="restore-mode" value="merge" checked /> Merge with this device</label><label><input type="radio" name="restore-mode" value="replace" /> Replace this device</label></fieldset><button class="button primary" id="restore-button" disabled>Restore selected backup</button><p id="restore-error" class="form-error" role="alert"></p></article>
    </section>
    <aside class="privacy-strip"><span aria-hidden="true">⌂</span><div><strong>No account, no sync, no tracking.</strong><p>Export files go directly from this browser to your device. Nothing is uploaded to us.</p></div></aside>
  </main>`;
}

function renderPass(): string {
  return `<main id="main" class="page-shell pass-page">
    <section class="pass-hero"><div><span class="eyebrow">One-time unlock · records remain yours</span><h1>${license.unlocked ? 'Your Workshop Pass is active' : 'Room for the whole workshop'}</h1><p class="lede">The free bench covers two bikes, unlimited components, service entries, reminders, CSV, print, and complete backups. Workshop Pass adds unlimited bikes and receipt/photo attachments.</p>${license.unlocked ? `<div class="active-license"><span aria-hidden="true">✓</span><div><strong>Unlocked on this device</strong><p>Unlimited bikes and attachments are ready, including offline.</p></div></div>` : `<div class="price-lockup"><strong>US$19</strong><span>one-time purchase</span></div><a class="button primary buy-button" href="${checkoutUrl}">Buy Workshop Pass</a>`}</div><div class="cutaway-card" aria-hidden="true"><div class="paper-bike">●—△—●</div><div class="paper-tag">∞ bikes</div><div class="paper-tag second">receipts</div></div></section>
    <section class="pass-details" aria-labelledby="included-title"><h2 id="included-title">What the pass unlocks</h2><ul><li><span aria-hidden="true">∞</span><div><strong>Unlimited bikes</strong><p>Keep retired, loaned, and current bikes in one ownership story.</p></div></li><li><span aria-hidden="true">▧</span><div><strong>Photos & receipts</strong><p>Attach JPEG, PNG, WebP, or PDF files to service entries.</p></div></li><li><span aria-hidden="true">⌂</span><div><strong>Offline forever</strong><p>The unlock and your existing records remain useful without a subscription.</p></div></li></ul></section>
    <section class="restore-license"><div><h2>Already bought it?</h2><p>Paste the license from your receipt to restore the pass on this device.</p></div><form id="license-form"><label><span>License token</span><input name="license" autocomplete="off" required placeholder="Paste your license token" /></label><button class="button secondary" type="submit">Verify license</button></form>${license.checking ? '<p role="status">Checking your license…</p>' : ''}${license.unlocked ? '<button class="link-button danger-link" data-action="remove-license">Remove license from this device</button>' : ''}</section>
    <p class="merchant-note">Sociobot/Dodo is the merchant of record and handles payment and refunds. A refunded purchase revokes the license. By purchasing, you agree to the <a href="/terms/">terms</a> and acknowledge the <a href="/privacy/">privacy notice</a>.</p>
  </main>`;
}

function bindMainEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-view]').forEach((element) => element.addEventListener('click', (event) => { event.preventDefault(); navigate(element.dataset.view as View); }));
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', () => handleAction(element.dataset.action ?? '', element.dataset)));
  document.querySelector<HTMLInputElement>('#timeline-search')?.addEventListener('input', (event) => { searchTerm = (event.target as HTMLInputElement).value; renderTimelineOnly(); });
  document.querySelector<HTMLSelectElement>('#bike-filter')?.addEventListener('change', (event) => { selectedBike = (event.target as HTMLSelectElement).value; render(); });
  bindRestore();
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const token = new FormData(event.currentTarget as HTMLFormElement).get('license')?.toString().trim();
    if (!token) return;
    storeLicense(token);
    announce('License saved. Verifying now.');
    void refreshLicense(true);
  });
}

function renderTimelineOnly(): void {
  const cursor = (document.querySelector('#timeline-search') as HTMLInputElement | null)?.selectionStart ?? searchTerm.length;
  render();
  const input = document.querySelector<HTMLInputElement>('#timeline-search');
  input?.focus();
  input?.setSelectionRange(cursor, cursor);
}

function handleAction(action: string, dataset: DOMStringMap): void {
  if (action === 'bike') return openBikeDialog();
  if (action === 'edit-bike') return openBikeDialog(dataset.id);
  if (action === 'component') return openComponentDialog(dataset.bike);
  if (action === 'edit-component') return openComponentDialog(undefined, dataset.id);
  if (action === 'service') return data.bikes.length ? openServiceDialog() : openBikeDialog();
  if (action === 'delete-service' && dataset.id) return void deleteService(dataset.id);
  if (action === 'csv') return download('bike-service-history.csv', serviceCsv(data), 'text/csv;charset=utf-8');
  if (action === 'json' || action === 'backup') return action === 'backup' ? goToBackup() : download('bike-service-timeline-backup.json', JSON.stringify(createBackup(data), null, 2), 'application/json');
  if (action === 'print') { if (view !== 'timeline') navigate('timeline'); setTimeout(() => window.print(), 50); return; }
  if (action === 'clear-filters') { selectedBike = 'all'; searchTerm = ''; render(); return; }
  if (action === 'import-focus') { goToBackup(); setTimeout(() => document.querySelector<HTMLInputElement>('#backup-file')?.focus(), 20); return; }
  if (action === 'remove-license') { clearLicense(); license = initialLicenseState(); announce('License removed from this device.'); render(); }
  if (action === 'reset-demo') return void resetDemo();
}

function goToBackup(): void { navigate('backup'); }

async function resetDemo(): Promise<void> {
  await clearDemoData();
  await replaceData(demoData());
  data = await loadData();
  view = 'bench';
  renderRoute();
  announce('Sample data reset. Nothing was saved to your real records.');
}

function bindRestore(): void {
  const file = document.querySelector<HTMLInputElement>('#backup-file');
  const button = document.querySelector<HTMLButtonElement>('#restore-button');
  if (!file || !button) return;
  file.addEventListener('change', () => { button.disabled = !file.files?.length; document.querySelector('#restore-error')!.textContent = ''; });
  button.addEventListener('click', async () => {
    const selected = file.files?.[0];
    if (!selected) return;
    const error = document.querySelector<HTMLParagraphElement>('#restore-error')!;
    try {
      const backup = parseBackup(JSON.parse(await selected.text()));
      const mode = document.querySelector<HTMLInputElement>('input[name="restore-mode"]:checked')?.value ?? 'merge';
      if (mode === 'replace' && !confirm(`Replace everything on this device with “${selected.name}”? This cannot be undone unless you export first.`)) return;
      button.disabled = true;
      button.textContent = 'Restoring…';
      if (mode === 'replace') await replaceData(backup); else await mergeData(backup);
      data = await loadData();
      announce(`Backup restored. ${data.bikes.length} bikes and ${data.services.length} service entries are ready.`);
      render();
    } catch (reason) {
      error.textContent = reason instanceof Error ? reason.message : 'That backup could not be restored.';
      button.disabled = false;
      button.textContent = 'Restore selected backup';
    }
  });
}

function openBikeDialog(id?: string): void {
  const existing = data.bikes.find((item) => item.id === id);
  if (!existing && data.bikes.length >= 2 && !license.unlocked && !isDemoMode()) { navigate('pass'); announce('The free bench holds two bikes. Workshop Pass unlocks unlimited bikes.'); return; }
  const dialog = createDialog(existing ? `Edit ${existing.name}` : 'Add a bike', `
    <form id="bike-form" class="record-form">
      <label><span>Bike name <em>Required</em></span><input name="name" required maxlength="60" value="${e(existing?.name)}" placeholder="e.g. Blue Commuter" /></label>
      <div class="form-row"><label><span>Bike type <em>Required</em></span><select name="kind" required>${['Road', 'Mountain', 'Commuter', 'Cargo', 'Gravel', 'BMX', 'Folding', 'Other'].map((kind) => `<option ${existing?.kind === kind ? 'selected' : ''}>${kind}</option>`).join('')}</select></label><label><span>Current odometer (km)</span><input name="odometer" type="number" min="0" step="1" value="${existing?.odometer ?? 0}" /></label></div>
      <label><span>Frame tag colour</span><input name="color" type="color" value="${e(existing?.color ?? '#176b57')}" /></label>
      <label><span>Notes</span><textarea name="notes" rows="3" maxlength="500" placeholder="Frame number, setup, or anything worth remembering">${e(existing?.notes)}</textarea></label>
      <div class="dialog-actions">${existing ? '<button type="button" class="button danger" id="delete-bike">Delete bike</button>' : ''}<span></span><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary" type="submit">${existing ? 'Save bike' : 'Add bike'}</button></div>
    </form>`);
  const form = dialog.querySelector<HTMLFormElement>('#bike-form')!;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const timestamp = new Date().toISOString();
    const bike: Bike = { id: existing?.id ?? crypto.randomUUID(), name: value(values, 'name'), kind: value(values, 'kind'), color: value(values, 'color'), odometer: numberValue(values, 'odometer') ?? 0, notes: value(values, 'notes'), createdAt: existing?.createdAt ?? timestamp, updatedAt: timestamp };
    await saveWithFeedback('bikes', bike, dialog, existing ? 'Bike updated.' : 'Bike added. Add components to get useful reminders.');
  });
  dialog.querySelector('#delete-bike')?.addEventListener('click', () => void deleteBike(existing!, dialog));
}

function openComponentDialog(preselectedBike?: string, id?: string): void {
  if (!data.bikes.length) return openBikeDialog();
  const existing = data.components.find((item) => item.id === id);
  const selectedBikeId = existing?.bikeId ?? preselectedBike;
  const dialog = createDialog(existing ? `Edit ${existing.name}` : 'Add a component', `
    <form id="component-form" class="record-form">
      <p class="form-intro">Add only the parts you want to follow. Both reminder fields are optional and always editable.</p>
      <div class="form-row"><label><span>Bike <em>Required</em></span><select name="bikeId" required>${data.bikes.map((bike) => `<option value="${bike.id}" ${selectedBikeId === bike.id ? 'selected' : ''}>${e(bike.name)}</option>`).join('')}</select></label><label><span>Component <em>Required</em></span><input name="name" required maxlength="80" value="${e(existing?.name)}" placeholder="e.g. Rear brake pads" /></label></div>
      <div class="form-row"><label><span>Installed or baseline date</span><input name="installedDate" type="date" value="${e(existing?.installedDate ?? today())}" required /></label><label><span>Mileage then (km)</span><input name="installedMileage" type="number" min="0" step="1" value="${existing?.installedMileage ?? ''}" /></label></div>
      <fieldset class="interval-fieldset"><legend>Remind me after</legend><div class="form-row"><label><span>Distance (km)</span><input name="intervalKm" type="number" min="1" step="1" value="${existing?.intervalKm ?? ''}" placeholder="e.g. 1000" /></label><label><span>Time (months)</span><input name="intervalMonths" type="number" min="1" max="240" step="1" value="${existing?.intervalMonths ?? ''}" placeholder="e.g. 6" /></label></div><p>Whichever interval comes first. This is a personal reminder—not a safety inspection or manufacturer recommendation.</p></fieldset>
      <label><span>Notes</span><textarea name="notes" rows="3" maxlength="500" placeholder="Brand, model, size, or setup">${e(existing?.notes)}</textarea></label>
      <div class="dialog-actions">${existing ? '<button type="button" class="button danger" id="delete-component">Delete component</button>' : '<span></span>'}<span></span><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary" type="submit">${existing ? 'Save component' : 'Add component'}</button></div>
    </form>`);
  const form = dialog.querySelector<HTMLFormElement>('#component-form')!;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(form); const timestamp = new Date().toISOString();
    const component: Component = { id: existing?.id ?? crypto.randomUUID(), bikeId: value(values, 'bikeId'), name: value(values, 'name'), installedDate: value(values, 'installedDate'), installedMileage: numberValue(values, 'installedMileage'), intervalKm: numberValue(values, 'intervalKm'), intervalMonths: numberValue(values, 'intervalMonths'), notes: value(values, 'notes'), createdAt: existing?.createdAt ?? timestamp, updatedAt: timestamp };
    await saveWithFeedback('components', component, dialog, existing ? 'Component updated.' : 'Component added. Its next service is now on the bench.');
  });
  dialog.querySelector('#delete-component')?.addEventListener('click', () => void deleteComponent(existing!, dialog));
}

function openServiceDialog(): void {
  if (!data.bikes.length) return openBikeDialog();
  const attachmentField = license.unlocked ? `<label><span>Receipts or photos</span><input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple /><small>JPEG, PNG, WebP, or PDF. Up to 4 MB each and 8 MB total.</small></label>` : `<div class="locked-field"><span aria-hidden="true">▧</span><div><strong>Receipts & photos need Workshop Pass</strong><p>Text records and every export remain free.</p></div><button type="button" class="link-button" id="view-pass">View pass</button></div>`;
  const dialog = createDialog('Log service', `
    <form id="service-form" class="record-form">
      <div class="form-row"><label><span>Bike <em>Required</em></span><select name="bikeId" id="service-bike" required>${data.bikes.map((bike) => `<option value="${bike.id}">${e(bike.name)}</option>`).join('')}</select></label><label><span>Component</span><select name="componentId" id="service-component"><option value="">Whole bike / other</option>${componentOptions(data.bikes[0]?.id)}</select></label></div>
      <div class="form-row"><label><span>Service date <em>Required</em></span><input name="date" type="date" required max="${today()}" value="${today()}" /></label><label><span>Odometer (km)</span><input name="odometer" type="number" min="0" step="1" value="${data.bikes[0]?.odometer || ''}" /></label></div>
      <div class="form-row"><label><span>Type <em>Required</em></span><select name="kind" required>${['Inspected', 'Cleaned', 'Adjusted', 'Replaced', 'Repaired', 'Installed', 'Other'].map((kind) => `<option>${kind}</option>`).join('')}</select></label><label><span>What was done? <em>Required</em></span><input name="work" required maxlength="100" placeholder="e.g. Replaced rear pads" /></label></div>
      <label><span>Details</span><textarea name="notes" rows="4" maxlength="1500" placeholder="Parts used, measurements, or what to check next time"></textarea></label>
      <div class="form-row"><label><span>Workshop or mechanic</span><input name="workshop" maxlength="100" placeholder="Optional" /></label><label><span>Cost (your currency)</span><input name="cost" type="number" min="0" step="0.01" /></label></div>
      ${attachmentField}
      <div class="dialog-actions"><span></span><span></span><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary" type="submit">Save service</button></div>
      <p class="form-error" role="alert" id="service-error"></p>
    </form>`);
  const form = dialog.querySelector<HTMLFormElement>('#service-form')!;
  const bikeSelect = dialog.querySelector<HTMLSelectElement>('#service-bike')!;
  const componentSelect = dialog.querySelector<HTMLSelectElement>('#service-component')!;
  bikeSelect.addEventListener('change', () => { componentSelect.innerHTML = `<option value="">Whole bike / other</option>${componentOptions(bikeSelect.value)}`; const bike = data.bikes.find((item) => item.id === bikeSelect.value); const odometer = form.elements.namedItem('odometer') as HTMLInputElement; odometer.value = bike?.odometer ? String(bike.odometer) : ''; });
  dialog.querySelector('#view-pass')?.addEventListener('click', () => { dialog.close(); view = 'pass'; render(); });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = dialog.querySelector<HTMLParagraphElement>('#service-error')!;
    try {
      const values = new FormData(form); const timestamp = new Date().toISOString();
      const files = license.unlocked ? [...((form.elements.namedItem('attachments') as HTMLInputElement | null)?.files ?? [])] : [];
      const attachments = await readAttachments(files);
      const entry: ServiceEntry = { id: crypto.randomUUID(), bikeId: value(values, 'bikeId'), componentId: value(values, 'componentId') || null, date: value(values, 'date'), odometer: numberValue(values, 'odometer'), kind: value(values, 'kind'), work: value(values, 'work'), notes: value(values, 'notes'), cost: numberValue(values, 'cost'), workshop: value(values, 'workshop'), attachments, createdAt: timestamp, updatedAt: timestamp };
      await putRecord('services', entry);
      const bike = data.bikes.find((item) => item.id === entry.bikeId);
      if (bike && entry.odometer !== null && entry.odometer > bike.odometer) await putRecord('bikes', { ...bike, odometer: entry.odometer, updatedAt: timestamp });
      data = await loadData(); dialog.close(); announce('Service saved to the timeline.'); render();
    } catch (reason) { error.textContent = reason instanceof Error ? reason.message : 'The service entry could not be saved.'; }
  });
}

function componentOptions(bikeId: string): string {
  return data.components.filter((item) => item.bikeId === bikeId).sort((a, b) => a.name.localeCompare(b.name)).map((item) => `<option value="${item.id}">${e(item.name)}</option>`).join('');
}

function createDialog(title: string, content: string): HTMLDialogElement {
  const previousFocus = document.activeElement as HTMLElement | null;
  dialogRoot.innerHTML = `<dialog class="record-dialog" aria-labelledby="dialog-title"><div class="dialog-header"><div><span class="kicker">Workshop record</span><h2 id="dialog-title">${e(title)}</h2></div><button class="icon-button close-button" data-close aria-label="Close dialog">×</button></div>${content}</dialog>`;
  const dialog = dialogRoot.querySelector<HTMLDialogElement>('dialog')!;
  dialog.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => { dialogRoot.innerHTML = ''; previousFocus?.focus(); }, { once: true });
  dialog.showModal();
  return dialog;
}

async function saveWithFeedback(store: 'bikes' | 'components', record: Bike | Component, dialog: HTMLDialogElement, message: string): Promise<void> {
  try { await putRecord(store, record); data = await loadData(); dialog.close(); announce(message); render(); }
  catch (reason) { announce(reason instanceof Error ? reason.message : 'The record could not be saved.'); }
}

async function deleteBike(bike: Bike, dialog: HTMLDialogElement): Promise<void> {
  const componentCount = data.components.filter((item) => item.bikeId === bike.id).length;
  const serviceCount = data.services.filter((item) => item.bikeId === bike.id).length;
  if (!confirm(`Delete “${bike.name}”, ${componentCount} components, and ${serviceCount} service entries? Export a backup first if you may need them.`)) return;
  for (const service of data.services.filter((item) => item.bikeId === bike.id)) await removeRecord('services', service.id);
  for (const component of data.components.filter((item) => item.bikeId === bike.id)) await removeRecord('components', component.id);
  await removeRecord('bikes', bike.id); data = await loadData(); dialog.close(); announce(`${bike.name} and its history were deleted.`); render();
}

async function deleteService(id: string): Promise<void> {
  const entry = data.services.find((item) => item.id === id); if (!entry) return;
  if (!confirm(`Delete “${entry.work}” from ${formatDate(entry.date)}? This cannot be undone.`)) return;
  await removeRecord('services', id); data = await loadData(); announce('Service entry deleted.'); render();
}

async function deleteComponent(component: Component, dialog: HTMLDialogElement): Promise<void> {
  const linked = data.services.filter((item) => item.componentId === component.id);
  if (!confirm(`Delete “${component.name}”? Its ${linked.length} service ${linked.length === 1 ? 'entry' : 'entries'} will stay in the timeline as whole-bike work.`)) return;
  const timestamp = new Date().toISOString();
  for (const service of linked) await putRecord('services', { ...service, componentId: null, updatedAt: timestamp });
  await removeRecord('components', component.id); data = await loadData(); dialog.close(); announce(`${component.name} was deleted. Its service history was kept.`); render();
}

async function readAttachments(files: File[]): Promise<Attachment[]> {
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
  if (files.some((file) => !allowed.has(file.type))) throw new Error('Attach only JPEG, PNG, WebP, or PDF files.');
  if (files.some((file) => file.size > 4 * 1024 * 1024)) throw new Error('Each attachment must be 4 MB or smaller.');
  if (files.reduce((sum, file) => sum + file.size, 0) > 8 * 1024 * 1024) throw new Error('Attachments for one entry must total 8 MB or less.');
  return Promise.all(files.map((file) => new Promise<Attachment>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, dataUrl: String(reader.result) });
    reader.onerror = () => reject(new Error(`${file.name} could not be read.`));
    reader.readAsDataURL(file);
  })));
}

function value(values: FormData, key: string): string { return values.get(key)?.toString().trim() ?? ''; }
function numberValue(values: FormData, key: string): number | null { const raw = value(values, key); return raw === '' ? null : Number(raw); }

function download(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); announce(`${name} downloaded.`);
}

function announce(message: string): void { liveRegion.textContent = ''; requestAnimationFrame(() => { liveRegion.textContent = message; }); }

function showUpdate(registration: ServiceWorkerRegistration): void {
  const toast = document.createElement('div'); toast.className = 'update-toast'; toast.setAttribute('role', 'status'); toast.innerHTML = `<span>A fresh app version is ready.</span><button class="button small">Update now</button>`;
  toast.querySelector('button')?.addEventListener('click', () => { registration.waiting?.postMessage({ type: 'SKIP_WAITING' }); navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true }); });
  document.body.append(toast);
}
