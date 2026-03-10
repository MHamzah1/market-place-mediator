/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  MessageCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getUsersById,
  updateUsers,
  clearSelectedUsers,
} from "@/lib/state/slice/user/userSlice";
import Alert from "@/components/feature/alert/alert";
import { cn } from "@/lib/utils";
import { decryptSlug, isValidSlug } from "@/lib/slug/slug";
import PhoneInputField from "@/components/ui/phone-input-field";

// ============================================
// Validation Schema
// ============================================
const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val.length === 0 ||
        (val.length >= 6 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)),
      {
        message:
          "Password minimal 6 karakter dan harus mengandung huruf besar, huruf kecil, dan angka",
      },
    ),
  fullName: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama minimal 3 karakter"),
  phoneNumber: z
    .string()
    .min(5, "Nomor telepon wajib diisi (minimal 3 digit setelah 62)")
    .regex(/^62\d+$/, "Format nomor telepon tidak valid"),
  whatsappNumber: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(["customer", "admin", "salesman"], {
    error: "Role wajib dipilih",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

// ============================================
// Component
// ============================================
export default function EditUser() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { selectedUsers, loading, error } = useSelector(
    (state: RootState) => state.Users,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isValidId, setIsValidId] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "62",
      whatsappNumber: "62",
      location: "",
      role: "customer",
    },
  });

  // ============================================
  // Decrypt Slug & Fetch Data
  // ============================================
  useEffect(() => {
    const slug = params?.slug as string;

    if (!slug) {
      setIsValidId(false);
      setIsInitialLoading(false);
      return;
    }

    // Validasi dan decrypt slug
    if (!isValidSlug(slug)) {
      setIsValidId(false);
      setIsInitialLoading(false);
      return;
    }

    const decryptedId = decryptSlug(slug);

    if (!decryptedId) {
      setIsValidId(false);
      setIsInitialLoading(false);
      return;
    }

    setUserId(decryptedId);
    setIsValidId(true);

    // Fetch user data
    dispatch(getUsersById(decryptedId)).finally(() => {
      setIsInitialLoading(false);
    });

    // Cleanup
    return () => {
      dispatch(clearSelectedUsers());
    };
  }, [params?.slug, dispatch]);

  // ============================================
  // Populate Form with User Data
  // ============================================
  useEffect(() => {
    if (selectedUsers) {
      setValue("email", selectedUsers.email || "");
      setValue("fullName", selectedUsers.fullName || "");
      const phone = selectedUsers.phoneNumber || "62";
      setValue("phoneNumber", phone.startsWith("62") ? phone : "62" + phone);
      const wa = selectedUsers.whatsappNumber || "62";
      setValue("whatsappNumber", wa.startsWith("62") ? wa : "62" + wa);
      setValue("location", selectedUsers.location || "");
      setValue("role", selectedUsers.role || "customer");
      // Password tidak di-set karena tidak dikirim dari API
    }
  }, [selectedUsers, setValue]);

  // ============================================
  // Handlers
  // ============================================
  const onSubmit = async (data: UserFormData) => {
    if (!userId) return;

    const confirmed = await Alert.confirmSave(
      "Simpan Perubahan?",
      "Apakah Anda yakin ingin menyimpan perubahan ini?",
    );

    if (!confirmed) return;

    try {
      Alert.loading("Menyimpan perubahan...");

      const payload: any = {
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        whatsappNumber: data.whatsappNumber || null,
        location: data.location || null,
        role: data.role,
      };

      // Hanya kirim password jika diisi
      if (data.password && data.password.length > 0) {
        payload.password = data.password;
      }

      await dispatch(
        updateUsers({
          id: userId,
          UsersData: payload,
        }),
      ).unwrap();

      Alert.closeLoading();
      await Alert.success("Berhasil!", "Data user berhasil diperbarui");
      router.push("/MasterData/User/Table");
    } catch (error: any) {
      Alert.closeLoading();
      await Alert.error(
        "Gagal!",
        error?.message || "Gagal memperbarui data user",
      );
    }
  };

  const handleCancel = async () => {
    if (isDirty) {
      const confirmed = await Alert.confirmDiscard();
      if (!confirmed) return;
    }
    router.push("/MasterData/User/Table");
  };

  const handleResetForm = async () => {
    const confirmed = await Alert.confirm(
      "Reset Form?",
      "Form akan dikembalikan ke data awal.",
      "Ya, Reset",
      "Batal",
    );
    if (confirmed && selectedUsers) {
      setValue("email", selectedUsers.email || "");
      setValue("fullName", selectedUsers.fullName || "");
      const phone = selectedUsers.phoneNumber || "62";
      setValue("phoneNumber", phone.startsWith("62") ? phone : "62" + phone);
      const wa = selectedUsers.whatsappNumber || "62";
      setValue("whatsappNumber", wa.startsWith("62") ? wa : "62" + wa);
      setValue("location", selectedUsers.location || "");
      setValue("role", selectedUsers.role || "customer");
      setValue("password", "");
      Alert.toast.info("Form berhasil direset");
    }
  };

  // ============================================
  // Input Component
  // ============================================
  const InputField = ({
    label,
    name,
    type = "text",
    icon: Icon,
    placeholder,
    required = false,
    error,
    disabled = false,
    helperText,
  }: {
    label: string;
    name: keyof UserFormData;
    type?: string;
    icon: React.ElementType;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    helperText?: string;
  }) => (
    <div className="space-y-2">
      <label
        className={cn(
          "block text-sm font-semibold",
          isDarkMode ? "text-slate-300" : "text-slate-700",
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            isDarkMode ? "text-slate-500" : "text-gray-400",
          )}
        >
          <Icon size={20} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500 bg-red-500/10"
              : isDarkMode
                ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                : "bg-white border-slate-300 text-slate-900 placeholder:text-gray-400",
          )}
          {...register(name)}
        />
      </div>
      {helperText && !error && (
        <p
          className={cn(
            "text-xs",
            isDarkMode ? "text-slate-400" : "text-slate-500",
          )}
        >
          {helperText}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );

  // ============================================
  // Loading State
  // ============================================
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Memuat data user...
        </p>
      </div>
    );
  }

  // ============================================
  // Invalid ID State
  // ============================================
  if (!isValidId || !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div
          className={cn(
            "p-4 rounded-full",
            isDarkMode ? "bg-red-500/20" : "bg-red-100",
          )}
        >
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h2
          className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-slate-900",
          )}
        >
          ID User Tidak Valid
        </h2>
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Link yang Anda akses tidak valid atau sudah kadaluarsa.
        </p>
        <button
          onClick={() => router.push("/MasterData/User/Table")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-white transition-all duration-200"
        >
          Kembali ke Daftar User
        </button>
      </div>
    );
  }

  // ============================================
  // Error State
  // ============================================
  if (error && !selectedUsers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div
          className={cn(
            "p-4 rounded-full",
            isDarkMode ? "bg-red-500/20" : "bg-red-100",
          )}
        >
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h2
          className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-slate-900",
          )}
        >
          Gagal Memuat Data
        </h2>
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          {error}
        </p>
        <button
          onClick={() => router.push("/MasterData/User/Table")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-white transition-all duration-200"
        >
          Kembali ke Daftar User
        </button>
      </div>
    );
  }

  // ============================================
  // Render Form
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className={cn(
              "p-2 rounded-xl transition-all duration-200",
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700",
            )}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Edit User
            </h1>
            <p
              className={cn(
                "text-sm mt-1",
                isDarkMode ? "text-slate-400" : "text-slate-600",
              )}
            >
              {selectedUsers?.fullName || selectedUsers?.email || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cn(
            "rounded-2xl border backdrop-blur-sm p-6 lg:p-8",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white border-slate-200 shadow-lg",
          )}
        >
          {/* Section: Informasi Akun */}
          <div className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 flex items-center gap-2",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              <Shield size={20} className="text-cyan-400" />
              Informasi Akun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="contoh@email.com"
                required
                error={errors.email?.message}
              />
              <div className="space-y-2">
                <label
                  className={cn(
                    "block text-sm font-semibold",
                    isDarkMode ? "text-slate-300" : "text-slate-700",
                  )}
                >
                  Password Baru
                  <span
                    className={cn(
                      "text-xs font-normal ml-2",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    (Kosongkan jika tidak ingin mengubah)
                  </span>
                </label>
                <div className="relative">
                  <div
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2",
                      isDarkMode ? "text-slate-500" : "text-gray-400",
                    )}
                  >
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    className={cn(
                      "w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300",
                      "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent",
                      errors.password
                        ? "border-red-500 bg-red-500/10"
                        : isDarkMode
                          ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder:text-gray-400",
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2",
                      isDarkMode
                        ? "text-slate-500 hover:text-slate-300"
                        : "text-gray-400 hover:text-gray-600",
                    )}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Informasi Pribadi */}
          <div className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 flex items-center gap-2",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              <User size={20} className="text-cyan-400" />
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nama Lengkap"
                name="fullName"
                icon={User}
                placeholder="Masukkan nama lengkap"
                required
                error={errors.fullName?.message}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInputField
                    label="Nomor Telepon"
                    name="phoneNumber"
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                    icon={Phone}
                    placeholder="8123456789"
                    required
                    error={errors.phoneNumber?.message}
                  />
                )}
              />
              <Controller
                name="whatsappNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInputField
                    label="Nomor WhatsApp"
                    name="whatsappNumber"
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                    icon={MessageCircle}
                    placeholder="8123456789 (opsional)"
                    error={errors.whatsappNumber?.message}
                  />
                )}
              />
              <InputField
                label="Lokasi"
                name="location"
                icon={MapPin}
                placeholder="Kota/Alamat (opsional)"
                error={errors.location?.message}
              />
            </div>
          </div>

          {/* Section: Role */}
          <div className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 flex items-center gap-2",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              <Shield size={20} className="text-cyan-400" />
              Role & Akses
            </h2>
            <div className="space-y-2">
              <label
                className={cn(
                  "block text-sm font-semibold",
                  isDarkMode ? "text-slate-300" : "text-slate-700",
                )}
              >
                Role<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    value: "customer",
                    label: "Customer",
                    desc: "Pengguna biasa",
                    color: "green",
                  },
                  {
                    value: "salesman",
                    label: "Salesman",
                    desc: "Tim penjualan",
                    color: "blue",
                  },
                  {
                    value: "admin",
                    label: "Admin",
                    desc: "Akses penuh",
                    color: "purple",
                  },
                ].map((role) => (
                  <label
                    key={role.value}
                    className={cn(
                      "relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      isDarkMode
                        ? "bg-slate-800/50 hover:bg-slate-700/50"
                        : "bg-slate-50 hover:bg-slate-100",
                    )}
                  >
                    <input
                      type="radio"
                      value={role.value}
                      className="sr-only peer"
                      {...register("role")}
                    />
                    <div
                      className={cn(
                        "w-full peer-checked:border-cyan-500",
                        "peer-checked:ring-2 peer-checked:ring-cyan-500/50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            role.color === "green" &&
                              "bg-green-500/20 text-green-400",
                            role.color === "blue" &&
                              "bg-blue-500/20 text-blue-400",
                            role.color === "purple" &&
                              "bg-purple-500/20 text-purple-400",
                          )}
                        >
                          <Shield size={20} />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {role.label}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {role.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-700/50">
            <button
              type="button"
              onClick={handleResetForm}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                isDarkMode
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300",
              )}
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                isDarkMode
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300",
              )}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={cn(
                "px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
                "rounded-xl font-semibold flex items-center justify-center gap-2",
                "transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              )}
            >
              {isSubmitting || loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
