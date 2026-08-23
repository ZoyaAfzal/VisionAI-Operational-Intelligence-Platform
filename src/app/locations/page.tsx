import { LocationsView } from "@/components/locations/locations-view";
import { locations, activeAlertCountForLocation } from "@/data/mockData";

export default function LocationsPage() {
  const alertCounts = new Map(locations.map((l) => [l.id, activeAlertCountForLocation(l.id)]));

  return (
    <div className="p-6">
      <LocationsView locations={locations} alertCounts={alertCounts} />
    </div>
  );
}
