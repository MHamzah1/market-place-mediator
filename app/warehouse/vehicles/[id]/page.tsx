import VehicleDetail from "@/components/view/Warehouse/VehicleDetail";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <VehicleDetail paramsPromise={params} />;
}
