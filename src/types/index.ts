export type LocationType =
  | "Restaurant"
  | "Mall"
  | "Warehouse"
  | "Office"
  | "Store"
  | "Airport Kiosk"
  | "Distribution Center";

export type LocationStatus = "Active" | "Maintenance" | "Inactive";

export interface Location {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  city: string;
  region: string;
  status: LocationStatus;
  manager: string;
  health: number;
}

export type CameraStatus = "Active" | "Inactive" | "Disabled";

export type SceneType =
  | "dining"
  | "counter"
  | "kitchen"
  | "entrance"
  | "lobby"
  | "food-court"
  | "exit"
  | "atrium"
  | "corridor"
  | "escalator"
  | "warehouse-floor"
  | "loading-dock"
  | "kiosk"
  | "seating-area"
  | "office-corridor"
  | "parking"
  | "aisle"
  | "stockroom"
  | "patio";

export interface BoundingBox {
  id: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
  extendedWait: boolean;
  waitTime?: string;
}

export interface QueueAnalytics {
  queueLength: number;
  avgWaitTime: string;
  predictedWait: string;
}

export interface Camera {
  id: string;
  code: string;
  name: string;
  locationId: string;
  sceneType: SceneType;
  status: CameraStatus;
  brand: string;
  dvrCode: string;
  dvrBrand: string;
  image: string;
  boundingBoxes?: BoundingBox[];
  queueAnalytics?: QueueAnalytics;
}

export type AlertSeverity = "Critical" | "Warning" | "Info";
export type AlertStatus = "New" | "In Progress" | "Resolved";
export type AlertClipVariant = "queue-abandonment" | "dirty-table" | "none";

export interface Alert {
  id: string;
  time: string;
  timestamp: number;
  locationId: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  cameraId: string;
  clipVariant: AlertClipVariant;
  clipDescription?: string;
}

export interface Workflow {
  id: string;
  name: string;
  category: string;
  suitableFor: string[];
  description: string;
  alertTypes: string[];
  installed: boolean;
  enabled: boolean;
  rating: number;
  usersCount: number;
  icon: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface LocationComparisonPoint {
  locationId: string;
  value: number;
  color: string;
}
