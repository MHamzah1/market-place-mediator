import EditRoleUser from "@/components/view/MasterData/RoleUser/EditRoleUser";
import React from "react";

const EditRoleUserPage = ({ params }: { params: { slug: string } }) => {
  return <EditRoleUser slug={params.slug} />;
};

export default EditRoleUserPage;
