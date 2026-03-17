import EditRolePosition from "@/components/view/MasterData/RolePosition/EditRolePosition";
import React from "react";

const EditRolePositionPage = ({ params }: { params: { slug: string } }) => {
  return <EditRolePosition slug={params.slug} />;
};

export default EditRolePositionPage;
