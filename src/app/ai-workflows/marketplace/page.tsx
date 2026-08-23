import { MarketplaceView } from "@/components/workflows/marketplace-view";
import { workflows } from "@/data/mockData";

export default function MarketplacePage() {
  return <MarketplaceView workflows={workflows} />;
}
