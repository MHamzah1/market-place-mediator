"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchShowrooms,
  deleteShowroom,
  searchShowrooms,
  joinShowroom,
  leaveShowroom,
  clearSuccess,
  clearError,
  Showroom,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiUserPlus,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { useTheme } from "@/context/ThemeContext";
import { encryptSlug } from "@/lib/slug/slug";

const ShowroomList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { showrooms, loading, error, successMessage } = useSelector(
    (state: RootState) => state.warehouse,
  );

  // Join modal state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Showroom[]>([]);
  const [searching, setSearching] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchShowrooms());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      dispatch(fetchShowrooms());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
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
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#e2e8f0" : "#1e293b",
    });
    if (result.isConfirmed) dispatch(deleteShowroom(id));
  };

  const handleLeave = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Keluar dari Showroom?",
      text: `Apakah Anda yakin ingin keluar dari "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#e2e8f0" : "#1e293b",
    });
    if (result.isConfirmed) dispatch(leaveShowroom(id));
  };

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await dispatch(searchShowrooms(q)).unwrap();
      setSearchResults(res);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [dispatch]);

  const handleJoin = async (showroom: Showroom) => {
    setJoiningId(showroom.id);
    try {
      await dispatch(joinShowroom(showroom.id)).unwrap();
      setShowJoinModal(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch {
      // error handled via redux state
    } finally {
      setJoiningId(null);
    }
  };

  const joinedIds = new Set(
    showrooms
      .filter((s) => !(s as Showroom & { isOwner?: boolean }).isOwner)
      .map((s) => s.id),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Showroom
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Kelola data showroom Anda
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
              isDark
                ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <FiUserPlus /> Bergabung
          </button>
          <Link
            href="/warehouse/showrooms/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            <FiPlus /> Tambah Showroom
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        </div>
      ) : showrooms.length === 0 ? (
        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} rounded-2xl p-12 text-center border`}
        >
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"} mb-4`}>
            Belum ada showroom. Buat showroom pertama Anda atau bergabung dengan yang sudah ada!
          </p>
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <FiUserPlus /> Bergabung ke Showroom
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showrooms.map((s) => {
            const isOwner = (s as Showroom & { isOwner?: boolean }).isOwner !== false;
            return (
              <div
                key={s.id}
                className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-5 hover:border-emerald-500/30 transition-all`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {s.name}
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {s.code}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {s.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                    {!isOwner && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        Anggota
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`space-y-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <div className="flex items-start gap-2">
                    <FiMapPin className="mt-0.5 shrink-0" />
                    <span>
                      {s.address}, {s.city}, {s.province}
                    </span>
                  </div>
                  {s.phone && (
                    <div className="flex items-center gap-2">
                      <FiPhone className="shrink-0" />
                      <span>{s.phone}</span>
                    </div>
                  )}
                </div>
                <div
                  className={`flex gap-2 mt-4 pt-4 border-t ${isDark ? "border-slate-700/50" : "border-slate-200"}`}
                >
                  {isOwner ? (
                    <>
                      <Link
                        href={`/warehouse/showrooms/edit/${encryptSlug(s.id)}`}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? "bg-slate-700/50 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      >
                        <FiEdit className="text-base" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLeave(s.id, s.name)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-medium transition-colors w-full"
                    >
                      <FiLogOut className="text-base" /> Keluar dari Showroom
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 ${
              isDark ? "bg-slate-800 border border-slate-700" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Bergabung ke Showroom
              </h2>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className={`p-1.5 rounded-lg ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <FiX />
              </button>
            </div>

            <div className="relative">
              <FiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari nama atau kode showroom..."
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
                autoFocus
              />
            </div>

            <div className="min-h-[120px] max-h-72 overflow-y-auto space-y-2">
              {searching ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <p
                  className={`text-sm text-center py-8 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Showroom tidak ditemukan
                </p>
              ) : searchResults.length === 0 ? (
                <p
                  className={`text-sm text-center py-8 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Ketik nama atau kode showroom untuk mencari
                </p>
              ) : (
                searchResults.map((s) => {
                  const alreadyJoined = showrooms.some((x) => x.id === s.id);
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isDark
                          ? "border-slate-700 hover:border-slate-600"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {s.name}
                        </p>
                        <p
                          className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {s.code} · {s.city}
                        </p>
                      </div>
                      {alreadyJoined ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                          Bergabung
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoin(s)}
                          disabled={joiningId === s.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {joiningId === s.id ? (
                            <span className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                          ) : (
                            <FiUserPlus />
                          )}
                          Bergabung
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowroomList;
