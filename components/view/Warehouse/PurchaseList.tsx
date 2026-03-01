"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchPurchasesByShowroom, confirmPurchasePayment, clearSuccess, clearError } from "@/lib/state/slice/warehouse/warehouseSlice";
import toast from "react-hot-toast";
import { FiShoppingBag, FiCheck } from "react-icons/fi";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  dp_paid: "bg-blue-500/20 text-blue-400",
  fully_paid: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-slate-500/20 text-slate-400",
};

const PurchaseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { purchases, selectedShowroom, loading, successMessage, error } = useSelector((state: RootState) => state.warehouse);

  useEffect(() => {
    if (selectedShowroom?.id) dispatch(fetchPurchasesByShowroom(selectedShowroom.id));
  }, [dispatch, selectedShowroom]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearSuccess()); if (selectedShowroom?.id) dispatch(fetchPurchasesByShowroom(selectedShowroom.id)); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [successMessage, error, dispatch, selectedShowroom]);

  const formatPrice = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transaksi Pembelian</h1>
        <p className="text-slate-400 text-sm mt-1">Kelola transaksi pembelian kendaraan</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" /></div>
      ) : purchases.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
          <FiShoppingBag className="text-5xl text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Belum ada transaksi pembelian</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Invoice</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Pembeli</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Tipe</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Pembayaran</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Tanggal</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-emerald-400 text-xs">{p.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{p.buyerName}</div>
                      <div className="text-xs text-slate-400">{p.buyerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{formatPrice(p.totalPrice)}</td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{p.paymentType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[p.paymentStatus] || ""}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      {p.paymentStatus === "pending" && (
                        <button onClick={() => dispatch(confirmPurchasePayment(p.id))}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium transition-colors">
                          <FiCheck /> Konfirmasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
