"use client";

import CarModelsTable from "@/components/view/MasterData/CarModels/CarModelsTable";
import React from "react";

export default function CarModelsTablePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <CarModelsTable />
      </div>
    </div>
  );
}
