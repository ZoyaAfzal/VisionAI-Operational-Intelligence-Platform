import { LiveView } from "@/components/cameras/live-view";
import { cameras, locations } from "@/data/mockData";

export default function CamerasLivePage() {
  return <LiveView cameras={cameras} locations={locations} />;
}
