"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Tag,
  FileText,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getRolePositionById,
  getAllRoleUsers,
  updateRolePosition,
  clearRoleManagementSuccess,
  clearRoleManagementError,
  setSelectedRolePosition,
} from "@/lib/state/slice/role-management/roleManagementSlice";
import Alert from "@/components/feature/alert/alert";
import { cn } from "@/lib/utils";
import { decryptSlug } from "@/lib/slug/slug";

const schema = z.object({
  name: z.string().min(1, "Nama jabatan wajib diisi").max(100),
  description: z.string().max(255).optional(),
  roleUserId: z.string().min(1, "Pilih kategori role"),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function EditRolePosition({ slug }: { slug: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { loading, error, success, roleUsers } = useSelector(
    (state: RootState) => state.roleManagement,
  );

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const id = decryptSlug(slug);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  const watchedRoleUserId = watch("roleUserId");

  // ── Sequential fetch: roleUsers first, then position by id ──
  useEffect(() => {
    if (!id) {
      setFetchError("ID jabatan tidak valid.");
      setIsFetching(false);
      return;
    }

    const fetchData = async () => {
      setIsFetching(true);
      setFetchError(null);

      // 1. Load role users so the <select> options are ready
      await dispatch(getAllRoleUsers());

      // 2. Fetch the position and apply directly to form
      const result = await dispatch(getRolePositionById(id));

      if (getRolePositionById.fulfilled.match(result)) {
        const pos = result.payload;
        reset({
          name: pos.name,
          description: pos.description ?? "",
          roleUserId: pos.roleUserId,
          isActive: pos.isActive,
        });
      } else {
        setFetchError("Gagal memuat data jabatan. Silakan coba lagi.");
      }

      setIsFetching(false);
    };

    fetchData();

    return () => {
      dispatch(setSelectedRolePosition(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Redirect on success
  useEffect(() => {
    if (success) {
      dispatch(clearRoleManagementSuccess());
      router.push("/MasterData/RolePosition/Table");
    }
  }, [success, dispatch, router]);

  // Auto-clear submit error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearRoleManagementError()), 4000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  const onSubmit = (data: FormData) => {
    if (id) dispatch(updateRolePosition({ id, data }));
  };

  const inputBase = cn(
    "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors",
    isDark
      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400",
  );

  const labelClass =
    "flex items-center gap-1.5 text-sm font-medium mb-1.5 " +
    (isDark ? "text-slate-300" : "text-slate-700");

  // ── Loading skeleton ─────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
          <div className="space-y-2">
            <div className={`h-6 w-40 rounded-lg animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
            <div className={`h-4 w-24 rounded-lg animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
          </div>
        </div>

        {/* Form skeleton */}
        <div
          className={`rounded-2xl shadow-xl border p-6 space-y-5 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 w-28 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              <div className={`h-11 w-full rounded-xl animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <div className={`flex-1 h-12 rounded-xl animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
            <div className="flex-1 h-12 rounded-xl animate-pulse bg-cyan-500/20" />
          </div>
        </div>
      </div>
    );
  }

  // ── Fetch error state ─────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Edit Jabatan
          </h1>
        </div>
        <div
          className={`flex flex-col items-center gap-4 p-10 rounded-2xl border ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <AlertCircle className="w-12 h-12 text-red-500 opacity-70" />
          <p className={`text-center text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {fetchError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-xl transition-colors ${
            isDark
              ? "hover:bg-slate-800 text-slate-400"
              : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Edit Jabatan
          </h1>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Perbarui data jabatan
          </p>
        </div>
      </div>

      {/* Submit error */}
      {error && <Alert type="error" message={error} />}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`rounded-2xl shadow-xl border p-6 space-y-5 ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {/* Kategori Role */}
        <div>
          <label className={labelClass}>
            <Users className="w-4 h-4" />
            Kategori Role <span className="text-red-500">*</span>
          </label>
          <select
            {...register("roleUserId")}
            className={cn(
              inputBase,
              errors.roleUserId && "border-red-500 focus:ring-red-500",
            )}
          >
            <option value="">-- Pilih Kategori Role --</option>
            {roleUsers.map((ru) => (
              <option key={ru.id} value={ru.id}>
                {ru.name}
              </option>
            ))}
          </select>
          {errors.roleUserId && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.roleUserId.message}
            </p>
          )}
          {/* Show current selection label */}
          {watchedRoleUserId && (
            <p className="mt-1 text-xs text-cyan-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {roleUsers.find((r) => r.id === watchedRoleUserId)?.name ?? ""}
            </p>
          )}
        </div>

        {/* Nama Jabatan */}
        <div>
          <label className={labelClass}>
            <Tag className="w-4 h-4" />
            Nama Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            className={cn(
              inputBase,
              errors.name && "border-red-500 focus:ring-red-500",
            )}
            placeholder="Contoh: Sales, Inspektor, Admin Gudang"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div>
          <label className={labelClass}>
            <FileText className="w-4 h-4" />
            Deskripsi{" "}
            <span className={`text-xs font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              (opsional)
            </span>
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className={cn(inputBase, "resize-none")}
            placeholder="Deskripsi singkat tentang jabatan ini..."
          />
        </div>

        {/* Jabatan Aktif */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl border ${
            isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div>
            <p className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              Jabatan Aktif
            </p>
            <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Nonaktifkan untuk menyembunyikan jabatan ini
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 dark:bg-slate-700" />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className={`flex-1 px-4 py-3 border rounded-xl text-sm font-semibold transition-colors ${
              isDark
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
