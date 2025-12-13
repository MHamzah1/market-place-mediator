"use client";

import BrandTable from "@/components/view/MasterData/Brand/BrandTable";
import React from "react";

export default function BrandTablePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BrandTable />
      </div>
    </div>
  );
}
