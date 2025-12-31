"use client";

import UsersTable from "@/components/view/MasterData/User/UserTable";
import React from "react";

export default function UserTablePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <UsersTable />
      </div>
    </div>
  );
}
