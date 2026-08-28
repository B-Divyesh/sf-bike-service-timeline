import { describe, expect, it } from 'vitest';
import type { AppData, Bike, Component, ServiceEntry } from '../src/types';
import { addMonths, computeDueStates, parseBackup, serviceCsv } from '../src/utils';

const bike: Bike = { id: 'bike-1', name: 'Green Commuter', kind: 'Commuter', color: '#176b57', odometer: 2650, notes: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' };
const component: Component = { id: 'component-1', bikeId: bike.id, name: 'Chain', installedDate: '2026-01-01', installedMileage: 1000, intervalMonths: 6, intervalKm: 1000, notes: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' };
const service: ServiceEntry = { id: 'service-1', bikeId: bike.id, componentId: component.id, date: '2026-02-01', odometer: 1800, kind: 'Cleaned', work: 'Cleaned, lubed "winter" chain', notes: 'Dry lube', cost: 8, workshop: 'Home', attachments: [], createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' };
const data: AppData = { bikes: [bike], components: [component], services: [service] };

describe('next service calculation', () => {
  it('uses the latest component service as the baseline for both triggers', () => {
    const [state] = computeDueStates(data, new Date('2026-03-01T12:00:00Z'));
    expect(state.status).toBe('soon');
    expect(state.dueDate).toBe('2026-08-01');
    expect(state.dueMileage).toBe(2800);
    expect(state.reason).toContain('2,800 km');
  });

  it('marks a component overdue when either owner-set trigger has passed', () => {
    expect(computeDueStates(data, new Date('2026-09-01T12:00:00Z'))[0].status).toBe('overdue');
  });

  it('@claim:date-distance-reminders clamps month ends and retains the latest known mileage', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    const withoutMileage = { ...service, id: 'service-2', date: '2026-03-01', odometer: null };
    expect(computeDueStates({ ...data, services: [service, withoutMileage] }, new Date('2026-03-02T12:00:00Z'))[0].dueMileage).toBe(2800);
  });
});

describe('portable exports', () => {
  it('escapes quoted CSV fields and names bike and component', () => {
    const csv = serviceCsv(data);
    expect(csv).toContain('"Green Commuter"');
    expect(csv).toContain('"Chain"');
    expect(csv).toContain('"Cleaned, lubed ""winter"" chain"');
  });

  it('rejects a foreign or malformed backup', () => {
    expect(() => parseBackup({ product: 'another-app', schemaVersion: 1, bikes: [], components: [], services: [] })).toThrow(/Bike Service Timeline/);
  });

  it('@claim:backup-validation rejects malformed nested records before storage', () => {
    expect(() => parseBackup({ product: 'bike-service-timeline', schemaVersion: 1, bikes: [bike], components: [{ ...component, installedDate: 'not-a-date' }], services: [] })).toThrow(/component 1/);
  });
});
