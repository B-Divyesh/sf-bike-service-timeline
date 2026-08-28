export type Bike = {
  id: string;
  name: string;
  kind: string;
  color: string;
  odometer: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Component = {
  id: string;
  bikeId: string;
  name: string;
  installedDate: string;
  installedMileage: number | null;
  intervalMonths: number | null;
  intervalKm: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type ServiceEntry = {
  id: string;
  bikeId: string;
  componentId: string | null;
  date: string;
  odometer: number | null;
  kind: string;
  work: string;
  notes: string;
  cost: number | null;
  workshop: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
};

export type AppData = {
  bikes: Bike[];
  components: Component[];
  services: ServiceEntry[];
};

export type Backup = AppData & {
  schemaVersion: 1;
  product: 'bike-service-timeline';
  exportedAt: string;
};

export type DueState = {
  component: Component;
  bike: Bike;
  status: 'overdue' | 'soon' | 'current' | 'unscheduled';
  dueDate: string | null;
  dueMileage: number | null;
  reason: string;
};
