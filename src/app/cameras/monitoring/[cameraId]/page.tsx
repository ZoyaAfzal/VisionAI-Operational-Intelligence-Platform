import { notFound } from "next/navigation";
import { MonitoringView } from "@/components/cameras/monitoring-view";
import { getCamera, getLocation } from "@/data/mockData";

export default async function CameraMonitoringPage({
  params,
}: {
  params: Promise<{ cameraId: string }>;
}) {
  const { cameraId } = await params;
  const camera = getCamera(cameraId);
  const location = camera ? getLocation(camera.locationId) : undefined;

  if (!camera || !location) notFound();

  return <MonitoringView camera={camera} location={location} />;
}
