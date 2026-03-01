"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchVehicles, fetchRepairsByVehicle, updateRepairStatus, clearSuccess, clearError } from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiPlus, FiTool } from "react-icons/fi";

const RepairList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, repairs, selectedShowroom, loading, successMessage, error } = useSelector((state: RootState) => state.warehouse);

  useEffect(() => {
    dispatch(fetchVehicles({ showroomId: selectedShowroom?.id, status: "in_repair" }));
  }, [dispatch, selectedShowroom]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearSuccess()); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [successMessage, error, dispatch]);

  const formatPrice = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Repair Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola perbaikan kendaraan</p>
        </div>
        <Link href="/warehouse/repairs/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all">
          <FiPlus /> Buat Repair Order
        </Link>
      </div>

      {/* Vehicles in repair */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiTool className="text-orange-400" /> Kendaraan Dalam Perbaikan ({vehicles.length})
        </h3>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>
        ) : vehicles.length === 0 ? (
          <p className="text-slate-500 text-sm">Tidak ada kendaraan dalam perbaikan</p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{v.brandName} {v.modelName} ({v.year})</p>
                    <p className="text-xs text-slate-400 font-mono">{v.barcode}</p>
                  </div>
                  <Link href={`/warehouse/vehicles/${v.id}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairList;
