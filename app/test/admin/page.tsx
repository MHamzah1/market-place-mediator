// ============================================
// ADMIN DASHBOARD EXAMPLE
// File: app/admin/dashboard/page.tsx
// ============================================

"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/state/store";
import MainLayout from "@/components/layout/main-layout";

const AdminDashboard = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <span className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
              ADMIN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">1,234</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Cars</h3>
              <p className="text-3xl font-bold">567</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Revenue</h3>
              <p className="text-3xl font-bold">$89,450</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">User Info:</h3>
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

export default AdminDashboard;
