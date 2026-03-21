import EditRolePosition from "@/components/view/MasterData/RolePosition/EditRolePosition";
import React from "react";

const EditRolePositionPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <EditRolePosition slug={slug} />;
};

export default EditRolePositionPage;
