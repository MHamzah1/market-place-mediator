"use client";

import SpecificationsTable from "@/components/view/MasterData/Specifications/SpecificationsTable";
import React from "react";

export default function SpecificationsTablePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SpecificationsTable />
      </div>
    </div>
  );
}
