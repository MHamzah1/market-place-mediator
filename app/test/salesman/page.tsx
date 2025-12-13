// ============================================
// SALESMAN DASHBOARD EXAMPLE
// File: app/salesman/dashboard/page.tsx
// ============================================

"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/state/store";
import MainLayout from "@/components/layout/main-layout";

const SalesmanDashboard = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Salesman Dashboard
            </h1>
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
              SALESMAN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">My Leads</h3>
              <p className="text-3xl font-bold">45</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Cars Sold</h3>
              <p className="text-3xl font-bold">12</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Commission</h3>
              <p className="text-3xl font-bold">$5,400</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">User Info:</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Name:</span> {userInfo?.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {userInfo?.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                <span className="uppercase font-semibold">
                  {userInfo?.role}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesmanDashboard;
