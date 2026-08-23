import { InventoryView } from "@/components/cameras/inventory-view";
import { cameras, locations } from "@/data/mockData";

export default function CamerasInventoryPage() {
  return <InventoryView cameras={cameras} locations={locations} />;
}
