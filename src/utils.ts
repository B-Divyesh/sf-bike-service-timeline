import type { AppData, Backup, Bike, Component, DueState, ServiceEntry } from './types';

export const today = () => new Date().toISOString().slice(0, 10);

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export function formatDistance(value: number): string {
  return `${new Intl.NumberFormat().format(value)} km`;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function addMonths(date: string, months: number): string {
  const source = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(source.getTime()) || !Number.isInteger(months)) throw new Error('Choose a valid calendar date and interval.');
  const year = source.getUTCFullYear();
  const month = source.getUTCMonth() + months;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, targetMonth, Math.min(source.getUTCDate(), lastDay))).toISOString().slice(0, 10);
}

export function computeDueStates(data: AppData, now = new Date()): DueState[] {
  const states: DueState[] = [];
  for (const component of data.components) {
    const bike = data.bikes.find((item) => item.id === component.bikeId);
    if (!bike) continue;
    const services = data.services
      .filter((entry) => entry.componentId === component.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    const last = services[0];
    const mileageService = services.find((entry) => entry.odometer !== null);
    const baselineDate = last?.date || component.installedDate;
    const baselineMileage = mileageService?.odometer ?? component.installedMileage;
    const dueDate = component.intervalMonths && baselineDate ? addMonths(baselineDate, component.intervalMonths) : null;
    const dueMileage = component.intervalKm && baselineMileage !== null ? baselineMileage + component.intervalKm : null;
    if (!dueDate && dueMileage === null) {
      states.push({ component, bike, status: 'unscheduled', dueDate, dueMileage, reason: 'No interval set' });
      continue;
    }
    const daysUntil = dueDate ? Math.ceil((new Date(`${dueDate}T12:00:00`).getTime() - now.getTime()) / 86400000) : Infinity;
    const kmUntil = dueMileage !== null ? dueMileage - bike.odometer : Infinity;
    const overdue = daysUntil < 0 || kmUntil < 0;
    const soon = daysUntil <= 30 || kmUntil <= 200;
    const reasonParts = [];
    if (dueDate) reasonParts.push(`${overdue && daysUntil < 0 ? 'was due' : 'due'} ${formatDate(dueDate)}`);
    if (dueMileage !== null) reasonParts.push(`${overdue && kmUntil < 0 ? 'was due' : 'due'} at ${formatDistance(dueMileage)}`);
    states.push({ component, bike, status: overdue ? 'overdue' : soon ? 'soon' : 'current', dueDate, dueMileage, reason: reasonParts.join(' or ') });
  }
  return states;
}

export function serviceCsv(data: AppData): string {
  const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Date', 'Bike', 'Component', 'Service type', 'Work performed', 'Odometer (km)', 'Cost', 'Workshop', 'Notes', 'Attachments'];
  const rows = [...data.services].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => {
    const bike = data.bikes.find((item) => item.id === entry.bikeId)?.name ?? 'Deleted bike';
    const component = data.components.find((item) => item.id === entry.componentId)?.name ?? '';
    return [entry.date, bike, component, entry.kind, entry.work, entry.odometer ?? '', entry.cost ?? '', entry.workshop, entry.notes, entry.attachments.map((item) => item.name).join('; ')];
  });
  return [header, ...rows].map((row) => row.map(quote).join(',')).join('\n');
}

export function createBackup(data: AppData): Backup {
  return { product: 'bike-service-timeline', schemaVersion: 1, exportedAt: new Date().toISOString(), ...data };
}

export function parseBackup(value: unknown): Backup {
  if (!value || typeof value !== 'object') throw new Error('That file does not contain a backup.');
  const candidate = value as Partial<Backup>;
  if (candidate.product !== 'bike-service-timeline' || candidate.schemaVersion !== 1) throw new Error('Choose a Bike Service Timeline v1 JSON backup.');
  if (!Array.isArray(candidate.bikes) || !Array.isArray(candidate.components) || !Array.isArray(candidate.services)) throw new Error('The backup is incomplete.');
  const validDate = (item: unknown) => {
    if (typeof item !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item)) return false;
    const parsed = new Date(`${item}T12:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === item;
  };
  const timestamp = (item: unknown) => typeof item === 'string' && !Number.isNaN(new Date(item).getTime());
  const text = (item: unknown, limit: number) => typeof item === 'string' && item.length <= limit;
  const amount = (item: unknown, nullable = false) => (nullable && item === null) || (typeof item === 'number' && Number.isFinite(item) && item >= 0);
  const ids = new Set<string>();
  const invalid = (message: string): never => { throw new Error(`Backup validation failed: ${message}`); };
  for (const [index, bike] of candidate.bikes.entries()) {
    if (!bike || typeof bike !== 'object') invalid(`bike ${index + 1} is not a record.`);
    const item = bike as Bike;
    if (!text(item.id, 100) || ids.has(item.id) || !text(item.name, 60) || !item.name || !text(item.kind, 40) || !/^#[0-9a-f]{6}$/i.test(item.color) || !amount(item.odometer) || !text(item.notes, 500) || !timestamp(item.createdAt) || !timestamp(item.updatedAt)) invalid(`bike ${index + 1} has an invalid field.`);
    ids.add(item.id);
  }
  const componentIds = new Set<string>();
  for (const [index, component] of candidate.components.entries()) {
    if (!component || typeof component !== 'object') invalid(`component ${index + 1} is not a record.`);
    const item = component as Component;
    if (!text(item.id, 100) || componentIds.has(item.id) || !ids.has(item.bikeId) || !text(item.name, 80) || !item.name || !validDate(item.installedDate) || !amount(item.installedMileage, true) || !(item.intervalKm === null || (Number.isInteger(item.intervalKm) && item.intervalKm >= 1)) || !(item.intervalMonths === null || (Number.isInteger(item.intervalMonths) && item.intervalMonths >= 1 && item.intervalMonths <= 240)) || !text(item.notes, 500) || !timestamp(item.createdAt) || !timestamp(item.updatedAt)) invalid(`component ${index + 1} has an invalid field or bike reference.`);
    componentIds.add(item.id);
  }
  const serviceIds = new Set<string>();
  for (const [index, service] of candidate.services.entries()) {
    if (!service || typeof service !== 'object') invalid(`service entry ${index + 1} is not a record.`);
    const item = service as ServiceEntry;
    if (!text(item.id, 100) || serviceIds.has(item.id) || !ids.has(item.bikeId) || !(item.componentId === null || componentIds.has(item.componentId)) || !validDate(item.date) || !amount(item.odometer, true) || !text(item.kind, 40) || !text(item.work, 100) || !item.work || !text(item.notes, 1500) || !amount(item.cost, true) || !text(item.workshop, 100) || !Array.isArray(item.attachments) || !timestamp(item.createdAt) || !timestamp(item.updatedAt)) invalid(`service entry ${index + 1} has an invalid field or reference.`);
    for (const attachment of item.attachments) if (!attachment || !text(attachment.id, 100) || !text(attachment.name, 255) || !text(attachment.type, 100) || !amount(attachment.size) || !text(attachment.dataUrl, 12_000_000) || !attachment.dataUrl.startsWith('data:')) invalid(`attachment in service entry ${index + 1} is invalid.`);
    serviceIds.add(item.id);
  }
  return candidate as Backup;
}

export function lastServiceFor(component: Component, services: ServiceEntry[]): ServiceEntry | undefined {
  return services.filter((entry) => entry.componentId === component.id).sort((a, b) => b.date.localeCompare(a.date))[0];
}
