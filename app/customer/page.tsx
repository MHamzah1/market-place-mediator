// ============================================
// CUSTOMER DASHBOARD EXAMPLE
// File: app/customer/dashboard/page.tsx
// ============================================

"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/state/store";
import MainLayout from "@/components/layout/main-layout";

const CustomerDashboard = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Dashboard
            </h1>
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              CUSTOMER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">My Cars</h3>
              <p className="text-3xl font-bold">2</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Bookings</h3>
              <p className="text-3xl font-bold">3</p>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Favorites</h3>
              <p className="text-3xl font-bold">8</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">User Info:</h3>
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

export default CustomerDashboard;
