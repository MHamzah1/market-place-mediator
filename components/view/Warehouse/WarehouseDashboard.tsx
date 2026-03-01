"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchShowroomDashboard, fetchStockSummary } from "@/lib/state/slice/warehouse/warehouseSlice";
import { FiTruck, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const statusColors: Record<string, string> = {
  inspecting: "bg-yellow-500/20 text-yellow-400",
  registered: "bg-blue-500/20 text-blue-400",
  in_warehouse: "bg-emerald-500/20 text-emerald-400",
  in_repair: "bg-orange-500/20 text-orange-400",
  ready: "bg-green-500/20 text-green-400",
  listed: "bg-purple-500/20 text-purple-400",
  sold: "bg-cyan-500/20 text-cyan-400",
  rejected: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  inspecting: "Inspeksi",
  registered: "Terdaftar",
  in_warehouse: "Di Gudang",
  in_repair: "Perbaikan",
  ready: "Siap Jual",
  listed: "Di Marketplace",
  sold: "Terjual",
  rejected: "Ditolak",
};

const WarehouseDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedShowroom, dashboard, stockSummary, loading } = useSelector(
    (state: RootState) => state.warehouse
  );

  useEffect(() => {
    if (selectedShowroom?.id) {
      dispatch(fetchShowroomDashboard(selectedShowroom.id));
      dispatch(fetchStockSummary(selectedShowroom.id));
    }
  }, [dispatch, selectedShowroom]);

  const totalVehicles = dashboard?.totalVehicles ?? stockSummary?.totalVehicles ?? 0;
  const statusCounts = dashboard?.statusCounts ?? stockSummary?.statusBreakdown ?? {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Dashboard Warehouse
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {selectedShowroom ? `Showroom: ${selectedShowroom.name}` : "Pilih showroom di sidebar"}
        </p>
      </div>

      {!selectedShowroom ? (
        <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
          <FiTruck className="text-5xl text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300">Belum Ada Showroom Dipilih</h3>
          <p className="text-slate-500 text-sm mt-2">Buat showroom terlebih dahulu di menu Showroom</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FiTruck}
              label="Total Kendaraan"
              value={totalVehicles}
              gradient="from-emerald-500 to-teal-600"
            />
            <StatCard
              icon={FiCheckCircle}
              label="Siap Jual"
              value={statusCounts.ready ?? 0}
              gradient="from-green-500 to-emerald-600"
            />
            <StatCard
              icon={FiAlertTriangle}
              label="Dalam Perbaikan"
              value={statusCounts.in_repair ?? 0}
              gradient="from-orange-500 to-amber-600"
            />
            <StatCard
              icon={FiDollarSign}
              label="Terjual"
              value={statusCounts.sold ?? 0}
              gradient="from-cyan-500 to-blue-600"
            />
          </div>

          {/* Stock In/Out */}
          {stockSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <FiArrowUpRight className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Masuk Bulan Ini</p>
                    <p className="text-2xl font-bold text-white">{stockSummary.monthlyIn}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <FiArrowDownRight className="text-red-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Keluar Bulan Ini</p>
                    <p className="text-2xl font-bold text-white">{stockSummary.monthlyOut}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status Kendaraan</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div
                  key={status}
                  className={`rounded-xl p-4 text-center ${statusColors[status] || "bg-slate-700/50 text-slate-300"}`}
                >
                  <p className="text-2xl font-bold">{String(count)}</p>
                  <p className="text-xs font-medium mt-1 opacity-80">{statusLabels[status] || status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Summary */}
          {dashboard?.zoneSummary && dashboard.zoneSummary.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Zona Gudang</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashboard.zoneSummary.map((zs) => (
                  <div key={zs.zone.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-white">{zs.zone.name}</p>
                        <p className="text-xs text-slate-400">{zs.zone.code}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                        {zs.zone.type}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Kapasitas</span>
                        <span className="text-white font-medium">{zs.vehicleCount} / {zs.zone.capacity}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((zs.vehicleCount / zs.zone.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="text-white text-xl" />
        </div>
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default WarehouseDashboard;
