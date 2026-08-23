// @ts-check
/**
 * Central mock data module for VisionAI.
 *
 * No backend exists yet- every record here is hand-authored mock data.
 * Cross-references between locations/cameras/alerts use foreign keys
 * (locationId / cameraId), never free-text name matching, and every
 * cross-page count (active alerts, workflow "X/Y enabled", camera totals)
 * is derived from these arrays at module load rather than duplicated as a
 * separate hardcoded number. See src/types/index.ts for the shapes.
 *
 * @typedef {import("@/types").Location} Location
 * @typedef {import("@/types").Camera} Camera
 * @typedef {import("@/types").Alert} Alert
 * @typedef {import("@/types").Workflow} Workflow
 * @typedef {import("@/types").BoundingBox} BoundingBox
 * @typedef {import("@/types").QueueAnalytics} QueueAnalytics
 * @typedef {import("@/types").SeriesPoint} SeriesPoint
 * @typedef {import("@/types").LocationComparisonPoint} LocationComparisonPoint
 */

/** @type {Location[]} */
export const locations = [
  { id: "loc-dtw-01", code: "LOC-DTW-01", name: "Downtown Restaurant", type: "Restaurant", city: "Chicago", region: "North America", status: "Active", manager: "Sarah Mitchell", health: 95 },
  { id: "loc-mll-02", code: "LOC-MLL-02", name: "Mall Food Court", type: "Mall", city: "Dallas", region: "North America", status: "Active", manager: "James Carter", health: 88 },
  { id: "loc-whs-03", code: "LOC-WHS-03", name: "Northside Warehouse", type: "Warehouse", city: "Newark", region: "North America", status: "Active", manager: "Maria Lopez", health: 91 },
  { id: "loc-off-04", code: "LOC-OFF-04", name: "Regional HQ Office", type: "Office", city: "San Francisco", region: "North America", status: "Active", manager: "David Chen", health: 98 },
  { id: "loc-str-05", code: "LOC-STR-05", name: "Main Street Store", type: "Store", city: "Austin", region: "North America", status: "Active", manager: "Emily Rodriguez", health: 87 },
  { id: "loc-dst-06", code: "LOC-DST-06", name: "Airport Kiosk", type: "Airport Kiosk", city: "Dubai", region: "GCC", status: "Active", manager: "Ahmed Al-Rashid", health: 82 },
  { id: "loc-whs-07", code: "LOC-WHS-07", name: "Gulf Distribution Center", type: "Distribution Center", city: "Riyadh", region: "GCC", status: "Maintenance", manager: "Fatima Hassan", health: 74 },
  { id: "loc-str-08", code: "LOC-STR-08", name: "Suburban Retail Unit", type: "Store", city: "Phoenix", region: "North America", status: "Active", manager: "Michael Torres", health: 90 },
  { id: "loc-mll-09", code: "LOC-MLL-09", name: "Westfield Mall Unit", type: "Mall", city: "London", region: "Europe", status: "Inactive", manager: "Olivia Bennett", health: 0 },
  { id: "loc-whs-10", code: "LOC-WHS-10", name: "Cold Storage Facility", type: "Warehouse", city: "Rotterdam", region: "Europe", status: "Active", manager: "Pieter van Dijk", health: 93 },
];

const locationById = new Map(locations.map((l) => [l.id, l]));

// ---------------------------------------------------------------------------
// Cameras
// ---------------------------------------------------------------------------

const CAMERA_BRANDS = ["Hikvision", "Axis", "Dahua", "Hanwha", "Bosch", "Uniview"];
const DVR_BRANDS = ["Hikvision NVR", "Axis Companion", "Dahua Lite", "Milestone XProtect"];
/** Scene types where the AI overlays queue-analytics + bounding boxes. */
const QUEUE_SCENE_TYPES = new Set(["dining", "counter", "entrance", "food-court", "exit", "kiosk", "seating-area"]);

/** @param {number} n */
function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * Bounding-box positions (percent of frame), hand-placed against each
 * curated photo's *actual* people- not a generic template reused across
 * every photo regardless of content. Box count per scene type equals the
 * number of clearly visible people in that specific photo, so a camera
 * never draws a "Person 04" tag over empty floor.
 * @type {Record<string, { left: number, top: number, width: number, height: number }[]>}
 */
const SCENE_BOX_LAYOUTS = {
  // dining.jpg: restaurant storefront at night, two diners visible through
  // the windows (a seated guest at left, a guest at the counter at right).
  dining: [
    { left: 47, top: 32, width: 13, height: 27 },
    { left: 75, top: 27, width: 13, height: 32 },
  ],
  // counter.jpg: barista behind the counter, one seated customer at right.
  counter: [
    { left: 36, top: 36, width: 13, height: 41 },
    { left: 83, top: 46, width: 11, height: 37 },
  ],
  // entrance.jpg: three people walking toward the building entrance.
  entrance: [
    { left: 13, top: 71, width: 8, height: 21 },
    { left: 44, top: 73, width: 8, height: 19 },
    { left: 64, top: 72, width: 8, height: 20 },
  ],
  // food-court.jpg: crowd at tables and the order counter.
  "food-court": [
    { left: 6, top: 45, width: 11, height: 41 },
    { left: 48, top: 42, width: 13, height: 49 },
    { left: 66, top: 44, width: 11, height: 43 },
    { left: 80, top: 40, width: 11, height: 41 },
  ],
  // kiosk.jpg: line of customers queued at the counter.
  kiosk: [
    { left: 56, top: 52, width: 8, height: 27 },
    { left: 64, top: 52, width: 8, height: 27 },
    { left: 72, top: 50, width: 8, height: 29 },
    { left: 80, top: 48, width: 8, height: 31 },
  ],
  // seating-area.jpg: busy food court, several people seated at tables.
  "seating-area": [
    { left: 6, top: 60, width: 12, height: 36 },
    { left: 26, top: 58, width: 11, height: 38 },
    { left: 38, top: 63, width: 10, height: 34 },
    { left: 67, top: 56, width: 11, height: 36 },
  ],
  // exit.jpg: barista, two seated guests, one guest at the far table.
  exit: [
    { left: 4, top: 55, width: 9, height: 31 },
    { left: 16, top: 60, width: 9, height: 29 },
    { left: 49, top: 56, width: 10, height: 36 },
    { left: 85, top: 53, width: 9, height: 31 },
  ],
};

/** Wait-time / queue-stat variations, cycled by seed independently of box position. */
const QUEUE_STATS = [
  { waitTimes: ["00:12", "00:35", "01:08", "03:28"], extendedIdx: 3, queueLength: 4, avgWaitTime: "01:24", predictedWait: "03:10" },
  { waitTimes: ["00:22", "01:45", "04:02"], extendedIdx: 2, queueLength: 3, avgWaitTime: "02:03", predictedWait: "04:40" },
  { waitTimes: ["00:41", "01:15"], extendedIdx: -1, queueLength: 2, avgWaitTime: "00:58", predictedWait: "01:50" },
  { waitTimes: ["00:18", "00:52", "02:31", "05:14", "00:09"], extendedIdx: 3, queueLength: 5, avgWaitTime: "01:45", predictedWait: "03:55" },
];

/**
 * Deterministic bounding-box + queue-analytics generator. Box positions
 * are fixed per sceneType (matching that photo's real people); only the
 * wait-time values and queue stats vary per camera instance.
 * @param {string} sceneType
 * @param {number} seed
 * @returns {{ boundingBoxes: BoundingBox[], queueAnalytics: QueueAnalytics } | null}
 */
function makeQueueScene(sceneType, seed) {
  const layout = SCENE_BOX_LAYOUTS[sceneType];
  if (!layout) return null;
  const stats = QUEUE_STATS[seed % QUEUE_STATS.length];

  const boundingBoxes = layout.map((pos, i) => ({
    id: `Person ${pad(i + 1)}`,
    label: `Person ${pad(i + 1)}`,
    top: pos.top,
    left: pos.left,
    width: pos.width,
    height: pos.height,
    waitTime: stats.waitTimes[i % stats.waitTimes.length],
    extendedWait: i === ((stats.extendedIdx + layout.length) % layout.length) && stats.extendedIdx !== -1,
  }));

  return {
    boundingBoxes,
    queueAnalytics: {
      queueLength: stats.queueLength,
      avgWaitTime: stats.avgWaitTime,
      predictedWait: stats.predictedWait,
    },
  };
}

/**
 * @param {Location} location
 * @param {{ name: string, sceneType: import("@/types").SceneType, status?: import("@/types").CameraStatus }[]} entries
 * @returns {Camera[]}
 */
function buildCameras(location, entries) {
  const suffix = location.code.replace("LOC-", "");
  return entries.map((entry, i) => {
    const status = entry.status ?? "Active";
    const dvrIndex = Math.floor(i / 4) + 1;
    const isQueueScene = QUEUE_SCENE_TYPES.has(entry.sceneType);
    const overlay = status === "Active" && isQueueScene ? makeQueueScene(entry.sceneType, i) : null;
    return {
      id: `cam-${suffix.toLowerCase()}-${pad(i + 1)}`,
      code: `CAM-${suffix}-${pad(i + 1)}`,
      name: entry.name,
      locationId: location.id,
      sceneType: entry.sceneType,
      status,
      brand: CAMERA_BRANDS[i % CAMERA_BRANDS.length],
      dvrCode: `DVR-${suffix}-${pad(dvrIndex)}`,
      dvrBrand: DVR_BRANDS[(dvrIndex - 1) % DVR_BRANDS.length],
      image: `/cameras/${entry.sceneType}.jpg`,
      ...(overlay ?? {}),
    };
  });
}

/** @param {string} id */
const loc = (id) => /** @type {Location} */ (locationById.get(id));

/** @type {Camera[]} */
export const cameras = [
  ...buildCameras(loc("loc-dtw-01"), [
    { name: "Dining Area 1", sceneType: "dining" },
    { name: "Dining Area 2", sceneType: "dining" },
    { name: "Counter View", sceneType: "counter" },
    { name: "Kitchen Pass", sceneType: "kitchen" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Dining Area 1", sceneType: "dining" },
    { name: "Dining Area 2", sceneType: "dining" },
    { name: "Dining Area 3", sceneType: "dining", status: "Inactive" },
    { name: "Patio Cam", sceneType: "patio" },
    { name: "Kitchen Pass 2", sceneType: "kitchen" },
    { name: "Storage Room", sceneType: "stockroom" },
    { name: "Back Office", sceneType: "office-corridor" },
    { name: "Dining Area 4", sceneType: "dining" },
    { name: "Entrance 2", sceneType: "entrance" },
    { name: "Walk-in Cooler", sceneType: "stockroom" },
    { name: "Prep Station", sceneType: "kitchen" },
  ]),
  ...buildCameras(loc("loc-mll-02"), [
    { name: "Entrance", sceneType: "entrance" },
    { name: "Food Court", sceneType: "food-court" },
    { name: "Exit Zone", sceneType: "exit" },
    { name: "Atrium", sceneType: "atrium" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Food Court", sceneType: "food-court" },
    { name: "Exit Zone", sceneType: "exit", status: "Inactive" },
    { name: "Corridor B", sceneType: "corridor", status: "Disabled" },
    { name: "Escalator", sceneType: "escalator" },
    { name: "Tenant Zone", sceneType: "corridor", status: "Inactive" },
    { name: "Food Court 3", sceneType: "food-court" },
    { name: "Atrium 2", sceneType: "atrium" },
    { name: "Corridor A", sceneType: "corridor" },
    { name: "Entrance 3", sceneType: "entrance" },
  ]),
  ...buildCameras(loc("loc-whs-03"), [
    { name: "Warehouse Floor 1", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 2", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 3", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 4", sceneType: "warehouse-floor" },
    { name: "Loading Dock 1", sceneType: "loading-dock" },
    { name: "Loading Dock 2", sceneType: "loading-dock" },
    { name: "Storage Aisle 1", sceneType: "stockroom" },
    { name: "Storage Aisle 2", sceneType: "stockroom" },
    { name: "Storage Aisle 3", sceneType: "stockroom" },
    { name: "Office Corridor", sceneType: "office-corridor" },
    { name: "Parking Lot", sceneType: "parking" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Exit", sceneType: "exit" },
    { name: "Warehouse Floor 5", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 6", sceneType: "warehouse-floor" },
    { name: "Loading Dock 3", sceneType: "loading-dock" },
    { name: "Storage Aisle 4", sceneType: "stockroom" },
    { name: "Break Room", sceneType: "office-corridor" },
  ]),
  ...buildCameras(loc("loc-off-04"), [
    { name: "Lobby", sceneType: "lobby" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Office Corridor 1", sceneType: "office-corridor" },
    { name: "Office Corridor 2", sceneType: "office-corridor" },
    { name: "Parking Garage", sceneType: "parking" },
    { name: "Server Room", sceneType: "office-corridor" },
  ]),
  ...buildCameras(loc("loc-str-05"), [
    { name: "Counter View", sceneType: "counter" },
    { name: "Aisle 1", sceneType: "aisle" },
    { name: "Aisle 2", sceneType: "aisle" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Exit", sceneType: "exit" },
    { name: "Stockroom", sceneType: "stockroom" },
    { name: "Patio Cam", sceneType: "patio" },
    { name: "Counter View 2", sceneType: "counter" },
    { name: "Aisle 3", sceneType: "aisle" },
    { name: "Entrance 2", sceneType: "entrance" },
    { name: "Stockroom 2", sceneType: "stockroom" },
    { name: "Parking Lot", sceneType: "parking" },
  ]),
  ...buildCameras(loc("loc-dst-06"), [
    { name: "Kiosk Counter", sceneType: "kiosk" },
    { name: "Seating Area", sceneType: "seating-area" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Security Line", sceneType: "kiosk" },
    { name: "Baggage Area", sceneType: "corridor" },
    { name: "Gate Corridor", sceneType: "office-corridor" },
    { name: "Kiosk Counter 2", sceneType: "kiosk" },
    { name: "Seating Area 2", sceneType: "seating-area" },
  ]),
  ...buildCameras(loc("loc-whs-07"), [
    { name: "Loading Dock", sceneType: "loading-dock" },
    { name: "Warehouse Floor 1", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 2", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 3", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 4", sceneType: "warehouse-floor" },
    { name: "Storage Aisle 1", sceneType: "stockroom" },
    { name: "Storage Aisle 2", sceneType: "stockroom" },
    { name: "Storage Aisle 3", sceneType: "stockroom" },
    { name: "Storage Aisle 4", sceneType: "stockroom" },
    { name: "Storage Aisle 5", sceneType: "stockroom", status: "Inactive" },
    { name: "Office Corridor", sceneType: "office-corridor" },
    { name: "Parking Lot", sceneType: "parking" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Exit", sceneType: "exit" },
    { name: "Loading Dock 2", sceneType: "loading-dock" },
    { name: "Warehouse Floor 5", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 6", sceneType: "warehouse-floor", status: "Disabled" },
    { name: "Storage Aisle 6", sceneType: "stockroom" },
    { name: "Break Room", sceneType: "office-corridor" },
    { name: "Security Office", sceneType: "office-corridor" },
  ]),
  ...buildCameras(loc("loc-str-08"), [
    { name: "Entrance", sceneType: "entrance" },
    { name: "Aisle 1", sceneType: "aisle" },
    { name: "Aisle 2", sceneType: "aisle" },
    { name: "Counter View", sceneType: "counter" },
    { name: "Exit", sceneType: "exit" },
    { name: "Stockroom", sceneType: "stockroom" },
    { name: "Parking Lot", sceneType: "parking" },
    { name: "Aisle 3", sceneType: "aisle" },
    { name: "Entrance 2", sceneType: "entrance" },
    { name: "Counter View 2", sceneType: "counter" },
  ]),
  ...buildCameras(loc("loc-mll-09"), [
    { name: "Entrance", sceneType: "entrance", status: "Disabled" },
    { name: "Food Court", sceneType: "food-court", status: "Disabled" },
    { name: "Exit Zone", sceneType: "exit", status: "Disabled" },
    { name: "Atrium", sceneType: "atrium", status: "Disabled" },
    { name: "Corridor A", sceneType: "corridor", status: "Disabled" },
    { name: "Escalator", sceneType: "escalator", status: "Inactive" },
    { name: "Tenant Zone", sceneType: "corridor", status: "Disabled" },
    { name: "Entrance 2", sceneType: "entrance", status: "Disabled" },
    { name: "Food Court 2", sceneType: "food-court", status: "Disabled" },
    { name: "Exit Zone 2", sceneType: "exit", status: "Inactive" },
    { name: "Corridor B", sceneType: "corridor", status: "Disabled" },
    { name: "Atrium 2", sceneType: "atrium", status: "Disabled" },
    { name: "Tenant Zone 2", sceneType: "corridor", status: "Disabled" },
    { name: "Entrance 3", sceneType: "entrance", status: "Disabled" },
    { name: "Food Court 3", sceneType: "food-court", status: "Disabled" },
  ]),
  ...buildCameras(loc("loc-whs-10"), [
    { name: "Storage Aisle 1", sceneType: "stockroom" },
    { name: "Storage Aisle 2", sceneType: "stockroom" },
    { name: "Storage Aisle 3", sceneType: "stockroom" },
    { name: "Storage Aisle 4", sceneType: "stockroom" },
    { name: "Storage Aisle 5", sceneType: "stockroom" },
    { name: "Storage Aisle 6", sceneType: "stockroom" },
    { name: "Loading Dock 1", sceneType: "loading-dock" },
    { name: "Loading Dock 2", sceneType: "loading-dock" },
    { name: "Warehouse Floor 1", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 2", sceneType: "warehouse-floor" },
    { name: "Warehouse Floor 3", sceneType: "warehouse-floor" },
    { name: "Office Corridor", sceneType: "office-corridor" },
    { name: "Parking Lot", sceneType: "parking" },
    { name: "Entrance", sceneType: "entrance" },
    { name: "Exit", sceneType: "exit" },
    { name: "Storage Aisle 7", sceneType: "stockroom" },
    { name: "Warehouse Floor 4", sceneType: "warehouse-floor" },
    { name: "Break Room", sceneType: "office-corridor" },
  ]),
];

const cameraById = new Map(cameras.map((c) => [c.id, c]));

/**
 * Find a camera by name within a location- used only while authoring alerts below.
 * @param {string} locationId
 * @param {string} name
 */
function findCamera(locationId, name) {
  const cam = cameras.find((c) => c.locationId === locationId && c.name === name);
  if (!cam) throw new Error(`mockData: no camera named "${name}" at location ${locationId}`);
  return cam;
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

/** @type {Omit<Alert, "id" | "timestamp">[]} */
const alertSeed = [
  { time: "Jun 9, 06:49 AM", locationId: "loc-dtw-01", type: "Dirty Table Detected", severity: "Critical", status: "New", cameraId: findCamera("loc-dtw-01", "Dining Area 2").id, clipVariant: "dirty-table", clipDescription: "Table 7 requires immediate cleaning attention" },
  { time: "Jun 7, 10:11 AM", locationId: "loc-str-05", type: "Queue Congestion", severity: "Warning", status: "In Progress", cameraId: findCamera("loc-str-05", "Counter View").id, clipVariant: "queue-abandonment", clipDescription: "Queue length exceeded threshold at checkout" },
  { time: "Jun 6, 11:22 AM", locationId: "loc-mll-02", type: "Long Wait Time", severity: "Warning", status: "New", cameraId: findCamera("loc-mll-02", "Entrance").id, clipVariant: "queue-abandonment", clipDescription: "Average wait time exceeded 5 minutes" },
  { time: "Jun 4, 12:33 PM", locationId: "loc-dtw-01", type: "Dirty Table Detected", severity: "Critical", status: "In Progress", cameraId: findCamera("loc-dtw-01", "Dining Area 1").id, clipVariant: "dirty-table", clipDescription: "Table 3 unattended for over 5 minutes" },
  { time: "Jun 2, 01:44 PM", locationId: "loc-str-05", type: "Dirty Table Detected", severity: "Warning", status: "New", cameraId: findCamera("loc-str-05", "Patio Cam").id, clipVariant: "dirty-table", clipDescription: "Patio table 2 requires cleaning attention" },
  { time: "Jun 1, 02:55 PM", locationId: "loc-dtw-01", type: "Queue Congestion", severity: "Critical", status: "New", cameraId: findCamera("loc-dtw-01", "Counter View").id, clipVariant: "queue-abandonment", clipDescription: "Queue length exceeded threshold at counter" },
  { time: "May 30, 03:06 PM", locationId: "loc-mll-02", type: "Queue Abandonment", severity: "Warning", status: "Resolved", cameraId: findCamera("loc-mll-02", "Exit Zone").id, clipVariant: "queue-abandonment", clipDescription: "Customer abandoned queue after 8 minute wait" },
  { time: "May 28, 04:17 PM", locationId: "loc-dst-06", type: "Dirty Table Detected", severity: "Warning", status: "New", cameraId: findCamera("loc-dst-06", "Seating Area").id, clipVariant: "dirty-table", clipDescription: "Seating area table left unattended" },
  { time: "May 27, 05:28 PM", locationId: "loc-str-05", type: "Staffing Alert", severity: "Info", status: "In Progress", cameraId: findCamera("loc-str-05", "Counter View").id, clipVariant: "none" },
  { time: "May 25, 06:39 PM", locationId: "loc-dtw-01", type: "Dirty Table Detected", severity: "Warning", status: "New", cameraId: findCamera("loc-dtw-01", "Dining Area 2").id, clipVariant: "dirty-table", clipDescription: "Table 5 requires cleaning attention" },
  { time: "May 23, 09:50 AM", locationId: "loc-mll-02", type: "Queue Congestion", severity: "Info", status: "Resolved", cameraId: findCamera("loc-mll-02", "Entrance").id, clipVariant: "queue-abandonment", clipDescription: "Queue congestion cleared after staffing adjustment" },
  { time: "May 22, 10:01 AM", locationId: "loc-str-05", type: "Dirty Table Detected", severity: "Info", status: "New", cameraId: findCamera("loc-str-05", "Patio Cam").id, clipVariant: "dirty-table", clipDescription: "Patio table 5 flagged for review" },
  { time: "May 20, 08:14 AM", locationId: "loc-whs-07", type: "Safety Violation", severity: "Critical", status: "New", cameraId: findCamera("loc-whs-07", "Loading Dock").id, clipVariant: "none" },
  { time: "May 19, 03:37 PM", locationId: "loc-whs-07", type: "Slip Hazard", severity: "Warning", status: "Resolved", cameraId: findCamera("loc-whs-07", "Warehouse Floor 2").id, clipVariant: "none" },
  { time: "May 18, 11:05 AM", locationId: "loc-whs-10", type: "Temperature Compliance Violation", severity: "Warning", status: "New", cameraId: findCamera("loc-whs-10", "Storage Aisle 1").id, clipVariant: "none" },
];

/** @type {Alert[]} */
export const alerts = alertSeed.map((a, i) => ({
  ...a,
  id: `alert-${pad(i + 1)}`,
  timestamp: alertSeed.length - i,
}));

const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
export const activeAlertCount = activeAlerts.length;

// ---------------------------------------------------------------------------
// AI Workflows marketplace
// ---------------------------------------------------------------------------

/** @type {Workflow[]} */
export const workflows = [
  { id: "wf-wet-floor", name: "Wet Floor Safety Monitor", category: "Popular", suitableFor: ["Restaurant", "Mall", "Store"], description: "Detect cleaning without wet floor sign placement within a configurable time window.", alertTypes: ["Safety Violation", "Compliance Alert"], installed: true, enabled: true, rating: 4.8, usersCount: 12500, icon: "Droplets" },
  { id: "wf-queue-mgmt", name: "Queue Management", category: "Operations", suitableFor: ["Restaurant", "Mall", "Store", "Airport Kiosk"], description: "Alert when queue exceeds threshold duration at counter or service points.", alertTypes: ["Queue Congestion", "Long Wait Time"], installed: true, enabled: true, rating: 4.9, usersCount: 18200, icon: "Users" },
  { id: "wf-hand-wash", name: "Hand Washing Compliance", category: "Compliance", suitableFor: ["Restaurant", "Store"], description: "Monitor staff hand washing station usage and compliance gaps.", alertTypes: ["Compliance Violation"], installed: false, enabled: false, rating: 4.6, usersCount: 8100, icon: "Hand" },
  { id: "wf-slip-fall", name: "Slip & Fall Detection", category: "Safety", suitableFor: ["Restaurant", "Mall", "Warehouse"], description: "Detect potential slip hazards and unusual floor activity in real-time.", alertTypes: ["Safety Alert", "Slip Hazard"], installed: false, enabled: false, rating: 4.7, usersCount: 6300, icon: "TriangleAlert" },
  { id: "wf-dirty-table", name: "Dirty Table Detection", category: "Table Service", suitableFor: ["Restaurant", "Mall", "Store"], description: "Alert when tables remain uncleaned beyond the configured threshold.", alertTypes: ["Dirty Table Detected"], installed: true, enabled: true, rating: 4.9, usersCount: 15700, icon: "Table2" },
  { id: "wf-dwell-time", name: "Dwell Time Analytics", category: "Customer Experience", suitableFor: ["Restaurant", "Mall", "Store"], description: "Track customer time spent in seating areas and flag unusually long dwell.", alertTypes: ["Extended Dwell", "Occupancy Insight"], installed: false, enabled: false, rating: 4.5, usersCount: 9400, icon: "Clock" },
  { id: "wf-footfall-spike", name: "Footfall Spike Monitor", category: "Footfall", suitableFor: ["Mall", "Store", "Restaurant"], description: "Detect unusual visitor surges compared to the hourly baseline.", alertTypes: ["Footfall Alert", "Capacity Warning"], installed: false, enabled: false, rating: 4.7, usersCount: 11200, icon: "TrendingUp" },
  { id: "wf-occupancy", name: "Occupancy Threshold Alert", category: "Operations", suitableFor: ["Restaurant", "Mall"], description: "Notify staff when seating occupancy crosses a configured limit.", alertTypes: ["Occupancy Alert"], installed: true, enabled: true, rating: 4.8, usersCount: 10600, icon: "Gauge" },
  { id: "wf-table-turnover", name: "Table Turnover Optimizer", category: "Table Service", suitableFor: ["Restaurant", "Mall"], description: "Flag tables with extended idle time between guest seatings.", alertTypes: ["Table Idle", "Service Delay"], installed: false, enabled: false, rating: 4.6, usersCount: 7800, icon: "RotateCw" },
  { id: "wf-food-temp", name: "Food Temperature Compliance", category: "Compliance", suitableFor: ["Restaurant", "Store"], description: "Monitor hot-holding and cold-storage zones for temperature violations.", alertTypes: ["Temperature Violation", "Compliance Alert"], installed: false, enabled: false, rating: 4.5, usersCount: 5900, icon: "Thermometer" },
  { id: "wf-ppe", name: "Uniform & PPE Compliance", category: "Compliance", suitableFor: ["Restaurant", "Warehouse", "Store"], description: "Verify staff wear required uniforms and PPE in designated zones.", alertTypes: ["Compliance Violation"], installed: false, enabled: false, rating: 4.4, usersCount: 4700, icon: "ShieldCheck" },
  { id: "wf-restroom", name: "Restroom Hygiene Audit", category: "Compliance", suitableFor: ["Mall", "Restaurant", "Office"], description: "Track restroom cleaning cycles and flag missed service windows.", alertTypes: ["Hygiene Compliance"], installed: false, enabled: false, rating: 4.3, usersCount: 3800, icon: "Sparkles" },
  { id: "wf-fire-exit", name: "Fire Exit Obstruction", category: "Safety", suitableFor: ["Mall", "Warehouse", "Store", "Office"], description: "Detect blocked fire exits and emergency pathways in real-time.", alertTypes: ["Safety Violation", "Compliance Alert"], installed: false, enabled: false, rating: 4.9, usersCount: 9100, icon: "DoorOpen" },
  { id: "wf-queue-abandon", name: "Queue Abandonment Detector", category: "Queue", suitableFor: ["Restaurant", "Mall"], description: "Detect customers leaving queues before being served.", alertTypes: ["Queue Abandonment"], installed: true, enabled: true, rating: 4.6, usersCount: 6900, icon: "UserX" },
  { id: "wf-staffing", name: "Staffing Alert Monitor", category: "Operations", suitableFor: ["Restaurant", "Store"], description: "Flag understaffed service points based on real-time queue load.", alertTypes: ["Staffing Alert"], installed: true, enabled: true, rating: 4.5, usersCount: 4200, icon: "UserCog" },
];

export const installedWorkflows = workflows.filter((w) => w.installed);
export const enabledWorkflowCount = installedWorkflows.filter((w) => w.enabled).length;

// ---------------------------------------------------------------------------
// Analytics series
// ---------------------------------------------------------------------------

const HOURS = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm"];

/** @type {SeriesPoint[]} */
export const footfallTrend = [18, 24, 34, 42, 55, 60, 52, 48, 58, 74, 82, 70, 60].map((value, i) => ({
  label: HOURS[i],
  value,
}));

/** @type {SeriesPoint[]} */
export const queueTimeTrend = [0.6, 0.8, 1.1, 1.6, 2.1, 2.4, 2.0, 1.7, 1.9, 2.3, 1.8, 1.2, 0.9].map((value, i) => ({
  label: HOURS[i],
  value,
}));

/** @type {SeriesPoint[]} */
export const complianceViolations = [
  { label: "Mon", value: 3 },
  { label: "Tue", value: 5 },
  { label: "Wed", value: 2 },
  { label: "Thu", value: 7 },
  { label: "Fri", value: 4 },
  { label: "Sat", value: 8 },
  { label: "Sun", value: 2 },
];

/** @type {LocationComparisonPoint[]} */
export const locationComparison = [
  { locationId: "loc-dtw-01", value: 95, color: "var(--color-success)" },
  { locationId: "loc-mll-02", value: 88, color: "var(--color-info)" },
  { locationId: "loc-str-05", value: 87, color: "var(--color-warning)" },
  { locationId: "loc-dst-06", value: 82, color: "var(--color-muted-foreground)" },
];

// ---------------------------------------------------------------------------
// Derived overview KPIs
// ---------------------------------------------------------------------------

export const overviewKpis = {
  footfallToday: { value: "3", change: "+12.5%", trend: [18, 22, 19, 26, 24, 30, 27] },
  activeAlerts: { value: String(activeAlertCount), change: "+18.8%", trend: [7, 8, 9, 8, 10, 11, activeAlertCount] },
  complianceScore: { value: "92.4%", change: "+4.3%", mock: true, trend: [88, 89, 90, 91, 90, 92, 92.4] },
  avgQueueTime: { value: "1.0 min", change: "+1.2 min", trend: [0.7, 0.8, 0.9, 1.1, 0.9, 1.0, 1.0] },
  locationHealth: { value: "87%", change: "+5%", mock: true, trend: [80, 82, 83, 85, 84, 86, 87] },
};

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** @param {string} id */
export function getLocation(id) {
  return locationById.get(id);
}

/** @param {string} id */
export function getCamera(id) {
  return cameraById.get(id);
}

/** @param {string} locationId */
export function camerasForLocation(locationId) {
  return cameras.filter((c) => c.locationId === locationId);
}

/** @param {string} locationId */
export function alertsForLocation(locationId) {
  return alerts.filter((a) => a.locationId === locationId);
}

/**
 * Non-resolved alert count for one location- feeds the Locations table's "Alerts" column.
 * @param {string} locationId
 */
export function activeAlertCountForLocation(locationId) {
  return alerts.filter((a) => a.locationId === locationId && a.status !== "Resolved").length;
}

// ---------------------------------------------------------------------------
// Dev-only integrity check- cheap insurance against FK / count drift.
// ---------------------------------------------------------------------------

if (process.env.NODE_ENV !== "production") {
  for (const cam of cameras) {
    console.assert(locationById.has(cam.locationId), `mockData: camera ${cam.id} has dangling locationId`);
    console.assert(typeof cam.image === "string" && cam.image.length > 0, `mockData: camera ${cam.id} is missing an image`);
  }
  for (const alert of alerts) {
    console.assert(locationById.has(alert.locationId), `mockData: alert ${alert.id} has dangling locationId`);
    console.assert(cameraById.has(alert.cameraId), `mockData: alert ${alert.id} has dangling cameraId`);
  }
  console.assert(cameras.length === 137, `mockData: expected 137 cameras, got ${cameras.length}`);
  console.assert(enabledWorkflowCount === installedWorkflows.length, "mockData: not all installed workflows are enabled");
}
