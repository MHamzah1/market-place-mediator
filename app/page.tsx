import React from "react";
import DashboardBeranda from "@/components/view/dashboard/dashboard-beranda";
import MainLayout from "@/components/layout/main-layout";

const page = () => {
  return (
    <>
      <MainLayout>
        <DashboardBeranda />
      </MainLayout>
    </>
  );
};

export default page;
