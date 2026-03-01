"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchVehicles, clearSuccess, clearError, VehicleStatus } from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiPlus, FiEye, FiSearch, FiFilter } from "react-icons/fi";

const statusConfig: Record<string, { label: string; color: string }> = {
  inspecting: { label: "Inspeksi", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  registered: { label: "Terdaftar", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  in_warehouse: { label: "Di Gudang", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  in_repair: { label: "Perbaikan", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  ready: { label: "Siap Jual", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  listed: { label: "Di Marketplace", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  sold: { label: "Terjual", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  rejected: { label: "Ditolak", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const VehicleList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, selectedShowroom, loading, error, successMessage } = useSelector(
    (state: RootState) => state.warehouse
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    dispatch(fetchVehicles({
      showroomId: selectedShowroom?.id,
      ...(statusFilter ? { status: statusFilter as VehicleStatus } : {}),
      ...(search ? { search } : {}),
    }));
  }, [dispatch, selectedShowroom, statusFilter]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearSuccess()); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [successMessage, error, dispatch]);

  const handleSearch = () => {
    dispatch(fetchVehicles({
      showroomId: selectedShowroom?.id,
      ...(statusFilter ? { status: statusFilter as VehicleStatus } : {}),
      ...(search ? { search } : {}),
    }));
  };

  const formatPrice = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kendaraan Warehouse</h1>
          <p className="text-slate-400 text-sm mt-1">
            {selectedShowroom ? `Showroom: ${selectedShowroom.name}` : "Semua kendaraan"}
          </p>
        </div>
        <Link
          href="/warehouse/vehicles/register"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all"
        >
          <FiPlus /> Register Kendaraan
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Cari barcode, brand, model..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="">Semua Status</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
          <p className="text-slate-400">Belum ada kendaraan terdaftar</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Barcode</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Kendaraan</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Nopol</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Harga</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Penjual</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {vehicles.map((v) => {
                  const sc = statusConfig[v.status] || { label: v.status, color: "bg-slate-500/20 text-slate-400" };
                  return (
                    <tr key={v.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-emerald-400 text-xs">{v.barcode}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{v.brandName} {v.modelName}</div>
                        <div className="text-xs text-slate-400">{v.year} • {v.color} • {v.transmission}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{v.licensePlate}</td>
                      <td className="px-4 py-3 text-white font-medium">{formatPrice(v.askingPrice)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{v.sellerName}</td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/warehouse/vehicles/${v.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
                        >
                          <FiEye /> Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
