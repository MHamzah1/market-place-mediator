"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchVehicles } from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import { FiDollarSign } from "react-icons/fi";

const PaymentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, selectedShowroom, loading } = useSelector((state: RootState) => state.warehouse);

  useEffect(() => {
    dispatch(fetchVehicles({ showroomId: selectedShowroom?.id, status: "registered" }));
  }, [dispatch, selectedShowroom]);

  const formatPrice = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pembayaran Admin</h1>
        <p className="text-slate-400 text-sm mt-1">Kelola pembayaran biaya admin Rp 2.000.000</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiDollarSign className="text-blue-400" /> Kendaraan Menunggu Pembayaran
        </h3>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>
        ) : vehicles.length === 0 ? (
          <p className="text-slate-500 text-sm">Tidak ada kendaraan yang menunggu pembayaran admin</p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                <div>
                  <p className="font-semibold text-white">{v.brandName} {v.modelName} ({v.year})</p>
                  <p className="text-xs text-slate-400">{v.barcode} • Penjual: {v.sellerName}</p>
                  <p className="text-sm font-medium text-emerald-400 mt-1">{formatPrice(v.askingPrice)}</p>
                </div>
                <Link href={`/warehouse/vehicles/${v.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 font-medium text-sm hover:bg-blue-500/30 transition-colors border border-blue-500/30">
                  <FiDollarSign className="inline mr-1" /> Proses Bayar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList;
