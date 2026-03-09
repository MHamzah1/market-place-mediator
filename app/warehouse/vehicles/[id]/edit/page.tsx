import VehicleEditForm from "@/components/view/Warehouse/VehicleEditForm";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <VehicleEditForm paramsPromise={params} />;
}
