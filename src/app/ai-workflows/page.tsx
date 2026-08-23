import { MyWorkflowsView } from "@/components/workflows/my-workflows-view";
import { installedWorkflows } from "@/data/mockData";

export default function MyWorkflowsPage() {
  return <MyWorkflowsView workflows={installedWorkflows} />;
}
