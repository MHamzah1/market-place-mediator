"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchShowrooms, deleteShowroom, clearSuccess, clearError } from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiPhone } from "react-icons/fi";
import Swal from "sweetalert2";

const ShowroomList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showrooms, loading, error, successMessage } = useSelector((state: RootState) => state.warehouse);

  useEffect(() => { dispatch(fetchShowrooms()); }, [dispatch]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearSuccess()); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [successMessage, error, dispatch]);

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Hapus Showroom?",
      text: `Apakah Anda yakin ingin menghapus "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      background: "#1e293b",
      color: "#e2e8f0",
    });
    if (result.isConfirmed) dispatch(deleteShowroom(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Showroom</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data showroom Anda</p>
        </div>
        <Link
          href="/warehouse/showrooms/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all"
        >
          <FiPlus /> Tambah Showroom
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        </div>
      ) : showrooms.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
          <p className="text-slate-400">Belum ada showroom. Buat showroom pertama Anda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showrooms.map((s) => (
            <div key={s.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{s.name}</h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{s.code}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {s.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 flex-shrink-0" />
                  <span>{s.address}, {s.city}, {s.province}</span>
                </div>
                {s.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="flex-shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                <Link
                  href={`/warehouse/showrooms/create?edit=${s.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  <FiEdit className="text-base" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
                >
                  <FiTrash2 className="text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowroomList;
