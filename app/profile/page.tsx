"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  X,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getUsersById,
  updateUsers,
  clearError,
} from "@/lib/state/slice/user/userSlice";
import { Button, SelectField, TextField } from "@/components/ui";

// Validation Schema
const profileSchema = z.object({
  email: z.string().email("Email tidak valid"),
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit"),
  whatsappNumber: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(["customer", "admin", "salesman"]),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { selectedUsers, loading, error } = useSelector(
    (state: RootState) => state.Users
  );
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      whatsappNumber: "",
      location: "",
      role: "customer",
    },
  });

  // 🔥 TAMBAHAN: Handle error dari backend
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Fetch user data by ID (hanya sekali saat mount)
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(getUsersById(userInfo.id));
    }
  }, [userInfo?.id, dispatch]);

  // Update form ketika selectedUsers berubah
  useEffect(() => {
    if (selectedUsers) {
      reset({
        email: selectedUsers.email || "",
        fullName: selectedUsers.fullName || "",
        phoneNumber: selectedUsers.phoneNumber || "",
        whatsappNumber: selectedUsers.whatsappNumber || "",
        location: selectedUsers.location || "",
        role: selectedUsers.role || "customer",
      });
    }
  }, [selectedUsers, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!userInfo?.id) {
        toast.error("User ID tidak ditemukan");
        return;
      }

      await dispatch(
        updateUsers({
          id: userInfo.id,
          UsersData: data,
        })
      ).unwrap();

      toast.success("Profile berhasil diupdate!");
      setIsEditing(false);

      // Refresh data setelah update
      dispatch(getUsersById(userInfo.id));
    } catch (error: any) {
      // Error akan di-handle oleh useEffect error handler
      console.error("Update profile error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedUsers) {
      reset({
        email: selectedUsers.email || "",
        fullName: selectedUsers.fullName || "",
        phoneNumber: selectedUsers.phoneNumber || "",
        whatsappNumber: selectedUsers.whatsappNumber || "",
        location: selectedUsers.location || "",
        role: selectedUsers.role || "customer",
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const roleOptions = [
    { value: "customer", label: "Customer" },
    { value: "admin", label: "Admin" },
    { value: "salesman", label: "Salesman" },
  ];

  if (loading && !selectedUsers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileData = selectedUsers || userInfo;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar & Name Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {profileData?.fullName || "User"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {profileData?.email}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {profileData?.role?.toUpperCase() || "USER"}
                </div>
              </div>

              <Button
                variant={isEditing ? "danger" : "primary"}
                size="md"
                leftIcon={isEditing ? X : Edit2}
                onClick={() =>
                  isEditing ? handleCancel() : setIsEditing(true)
                }
              >
                {isEditing ? "Batal" : "Edit Profile"}
              </Button>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nama Lengkap"
                      placeholder="Masukkan nama lengkap"
                      leftIcon={User}
                      error={errors.fullName?.message}
                      disabled={!isEditing}
                      required
                    />
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                      leftIcon={Mail}
                      error={errors.email?.message}
                      disabled={!isEditing}
                      required
                    />
                  )}
                />

                {/* Phone Number */}
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nomor Telepon"
                      placeholder="+628123456789"
                      leftIcon={Phone}
                      error={errors.phoneNumber?.message}
                      disabled={!isEditing}
                      required
                    />
                  )}
                />

                {/* WhatsApp Number */}
                <Controller
                  name="whatsappNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nomor WhatsApp"
                      placeholder="628123456789"
                      leftIcon={Phone}
                      error={errors.whatsappNumber?.message}
                      disabled={!isEditing}
                    />
                  )}
                />

                {/* Location */}
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Lokasi"
                      placeholder="Jakarta Selatan"
                      leftIcon={MapPin}
                      error={errors.location?.message}
                      disabled={!isEditing}
                    />
                  )}
                />

                {/* Role */}
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      {...field}
                      label="Role"
                      options={roleOptions}
                      error={errors.role?.message}
                      disabled={!isEditing}
                      required
                    />
                  )}
                />
              </div>

              {/* Metadata Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informasi Akun
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Dibuat pada
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(profileData?.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Terakhir diupdate
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(profileData?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    leftIcon={X}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    leftIcon={Check}
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
