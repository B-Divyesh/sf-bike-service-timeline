import type { AppData, Backup, Component, DueState, ServiceEntry } from './types';

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
  const result = new Date(`${date}T12:00:00`);
  result.setMonth(result.getMonth() + months);
  return result.toISOString().slice(0, 10);
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
    const baselineDate = last?.date || component.installedDate;
    const baselineMileage = last?.odometer ?? component.installedMileage;
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
  return candidate as Backup;
}

export function lastServiceFor(component: Component, services: ServiceEntry[]): ServiceEntry | undefined {
  return services.filter((entry) => entry.componentId === component.id).sort((a, b) => b.date.localeCompare(a.date))[0];
}
