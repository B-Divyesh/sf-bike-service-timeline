import type { AppData } from './types';

const stamp = '2026-08-01T10:00:00.000Z';

/** A deliberately useful, local-only sample workshop. Never copied into real storage. */
export const demoData = (): AppData => ({
  bikes: [
    { id: 'demo-road', name: 'Aster Road', kind: 'Road', color: '#254f70', odometer: 4280, notes: 'All-weather commuter.', createdAt: stamp, updatedAt: stamp },
    { id: 'demo-cargo', name: 'Maple Cargo', kind: 'Cargo', color: '#a94732', odometer: 1860, notes: 'School and market bike.', createdAt: stamp, updatedAt: stamp },
    { id: 'demo-trail', name: 'Pine Trail', kind: 'Mountain', color: '#176b57', odometer: 920, notes: 'Weekend trail bike.', createdAt: stamp, updatedAt: stamp },
  ],
  components: [
    { id: 'demo-chain', bikeId: 'demo-road', name: 'Chain', installedDate: '2026-02-28', installedMileage: 3280, intervalMonths: 6, intervalKm: 1000, notes: 'Waxed chain.', createdAt: stamp, updatedAt: stamp },
    { id: 'demo-brakes', bikeId: 'demo-cargo', name: 'Rear brake pads', installedDate: '2026-05-15', installedMileage: 1280, intervalMonths: 4, intervalKm: 700, notes: 'Check before wet season.', createdAt: stamp, updatedAt: stamp },
    { id: 'demo-fork', bikeId: 'demo-trail', name: 'Fork lower service', installedDate: '2026-04-03', installedMileage: 500, intervalMonths: 6, intervalKm: 500, notes: 'Owner reminder.', createdAt: stamp, updatedAt: stamp },
  ],
  services: [
    { id: 'demo-service-1', bikeId: 'demo-road', componentId: 'demo-chain', date: '2026-07-28', odometer: 4280, kind: 'Cleaned', work: 'Cleaned and rewaxed chain', notes: 'Measured at 0.5% wear.', cost: 12, workshop: 'Home', attachments: [], createdAt: stamp, updatedAt: stamp },
    { id: 'demo-service-2', bikeId: 'demo-cargo', componentId: 'demo-brakes', date: '2026-08-12', odometer: 1860, kind: 'Inspected', work: 'Checked rear brake pads', notes: 'Pad material still even.', cost: 0, workshop: 'Northside Cycles', attachments: [], createdAt: stamp, updatedAt: stamp },
    { id: 'demo-service-3', bikeId: 'demo-trail', componentId: 'demo-fork', date: '2026-06-05', odometer: 750, kind: 'Adjusted', work: 'Set fork pressure', notes: 'Set for local rocky loop.', cost: 0, workshop: 'Home', attachments: [], createdAt: stamp, updatedAt: stamp },
  ],
});
