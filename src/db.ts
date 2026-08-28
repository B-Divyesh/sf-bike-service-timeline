import type { AppData, Bike, Component, ServiceEntry } from './types';

const REAL_DB_NAME = 'bike-service-timeline';
const DB_VERSION = 1;
const STORES = ['bikes', 'components', 'services'] as const;
type StoreName = typeof STORES[number];

function databaseName(): string { return location.pathname === '/demo' || new URL(location.href).searchParams.get('demo') === '1' ? 'demo:bike-service-timeline' : REAL_DB_NAME; }

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(), DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of STORES) if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Your private records could not be opened on this device.'));
    request.onblocked = () => reject(new Error('Close other open copies of the app, then reload.'));
  });
}

export function isDemoMode(): boolean { return databaseName().startsWith('demo:'); }

export async function clearDemoData(): Promise<void> {
  if (!isDemoMode()) return;
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName());
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('The sample data could not be reset.'));
    request.onblocked = () => reject(new Error('Close other sample tabs, then try reset again.'));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('The record could not be saved.'));
  });
}

export async function loadData(): Promise<AppData> {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(STORES, 'readonly');
    const [bikes, components, services] = await Promise.all([
      requestResult(transaction.objectStore('bikes').getAll()) as Promise<Bike[]>,
      requestResult(transaction.objectStore('components').getAll()) as Promise<Component[]>,
      requestResult(transaction.objectStore('services').getAll()) as Promise<ServiceEntry[]>,
    ]);
    return { bikes, components, services };
  } finally {
    db.close();
  }
}

export async function putRecord<T extends { id: string }>(store: StoreName, record: T): Promise<void> {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(store, 'readwrite');
    transaction.objectStore(store).put(record);
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('The record could not be saved.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('The save was cancelled.'));
    });
  } finally {
    db.close();
  }
}

export async function removeRecord(store: StoreName, id: string): Promise<void> {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(store, 'readwrite');
    transaction.objectStore(store).delete(id);
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('The record could not be deleted.'));
    });
  } finally {
    db.close();
  }
}

export async function replaceData(data: AppData): Promise<void> {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(STORES, 'readwrite');
    for (const name of STORES) transaction.objectStore(name).clear();
    for (const bike of data.bikes) transaction.objectStore('bikes').put(bike);
    for (const component of data.components) transaction.objectStore('components').put(component);
    for (const service of data.services) transaction.objectStore('services').put(service);
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('The backup could not be restored.'));
    });
  } finally {
    db.close();
  }
}

export async function mergeData(incoming: AppData): Promise<void> {
  const current = await loadData();
  const newest = <T extends { id: string; updatedAt: string }>(oldItems: T[], newItems: T[]) => {
    const records = new Map(oldItems.map((item) => [item.id, item]));
    for (const item of newItems) if (!records.has(item.id) || records.get(item.id)!.updatedAt < item.updatedAt) records.set(item.id, item);
    return [...records.values()];
  };
  await replaceData({
    bikes: newest(current.bikes, incoming.bikes),
    components: newest(current.components, incoming.components),
    services: newest(current.services, incoming.services),
  });
}
