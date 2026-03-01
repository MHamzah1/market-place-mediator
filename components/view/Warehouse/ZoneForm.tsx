"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import { createZone, clearError, clearSuccess } from "@/lib/state/slice/warehouse/warehouseSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";

const ZoneForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { actionLoading, error, successMessage, selectedShowroom } = useSelector((state: RootState) => state.warehouse);

  const [form, setForm] = useState({
    showroomId: selectedShowroom?.id || "",
    code: "", name: "", type: "ready" as "ready" | "light_repair" | "heavy_repair" | "holding" | "showroom_display",
    capacity: 20,
  });

  useEffect(() => {
    if (selectedShowroom) setForm((f) => ({ ...f, showroomId: selectedShowroom.id }));
  }, [selectedShowroom]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearSuccess()); router.push("/warehouse/zones"); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [successMessage, error, dispatch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createZone({ ...form, capacity: Number(form.capacity) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/warehouse/zones" className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400"><FiArrowLeft className="text-xl" /></Link>
        <div><h1 className="text-2xl font-bold text-white">Tambah Zona Gudang</h1></div>
      </div>
      <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Kode Zona</label>
          <input type="text" name="code" value={form.code} onChange={handleChange} placeholder="GD-A" required
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Nama Zona</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Gudang Ready Jual" required
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipe Zona</label>
          <select name="type" value={form.type} onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            <option value="ready">Ready Jual</option>
            <option value="light_repair">Perbaikan Ringan</option>
            <option value="heavy_repair">Perbaikan Berat</option>
            <option value="holding">Holding</option>
            <option value="showroom_display">Display Showroom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Kapasitas</label>
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min={1} required
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>
        <button type="submit" disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50">
          {actionLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><FiSave /> Simpan Zona</>}
        </button>
      </form>
    </div>
  );
};

export default ZoneForm;
