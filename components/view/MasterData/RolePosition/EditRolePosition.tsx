"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Tag, FileText, Users } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getRolePositionById,
  getAllRoleUsers,
  updateRolePosition,
  clearRoleManagementSuccess,
  clearRoleManagementError,
} from "@/lib/state/slice/role-management/roleManagementSlice";
import Alert from "@/components/feature/alert/alert";
import { cn } from "@/lib/utils";
import { decryptSlug } from "@/lib/slug/slug";

const schema = z.object({
  name: z.string().min(1, "Nama jabatan wajib diisi").max(100),
  description: z.string().max(255).optional(),
  roleUserId: z.string().uuid("Pilih kategori role"),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function EditRolePosition({ slug }: { slug: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { loading, error, success, selectedRolePosition, roleUsers } =
    useSelector((state: RootState) => state.roleManagement);

  const id = decryptSlug(slug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    dispatch(getAllRoleUsers());
    if (id) dispatch(getRolePositionById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedRolePosition) {
      reset({
        name: selectedRolePosition.name,
        description: selectedRolePosition.description ?? "",
        roleUserId: selectedRolePosition.roleUserId,
        isActive: selectedRolePosition.isActive,
      });
    }
  }, [selectedRolePosition, reset]);

  useEffect(() => {
    if (success) {
      dispatch(clearRoleManagementSuccess());
      router.push("/MasterData/RolePosition/Table");
    }
  }, [success, dispatch, router]);

  useEffect(() => {
    if (error) dispatch(clearRoleManagementError());
  }, [error, dispatch]);

  const onSubmit = (data: FormData) => {
    if (id) dispatch(updateRolePosition({ id, data }));
  };

  const inputClass = cn(
    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors",
    isDark
      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400",
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Jabatan
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Perbarui data jabatan</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            <Users className="inline w-4 h-4 mr-1" />
            Kategori Role <span className="text-red-500">*</span>
          </label>
          <select {...register("roleUserId")} className={inputClass}>
            <option value="">-- Pilih Kategori Role --</option>
            {roleUsers.map((ru) => (
              <option key={ru.id} value={ru.id}>
                {ru.name}
              </option>
            ))}
          </select>
          {errors.roleUserId && (
            <p className="mt-1 text-sm text-red-500">{errors.roleUserId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            <Tag className="inline w-4 h-4 mr-1" />
            Nama Jabatan <span className="text-red-500">*</span>
          </label>
          <input {...register("name")} className={inputClass} />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Deskripsi
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className={cn(inputClass, "resize-none")}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="w-4 h-4 rounded accent-cyan-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Jabatan Aktif
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
