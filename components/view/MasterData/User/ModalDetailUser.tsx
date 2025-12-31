/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Shield,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
  Edit,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getUsersById,
  clearSelectedUsers,
  Users,
} from "@/lib/state/slice/user/userSlice";
import { Button } from "@/components/ui";
import Alert from "@/components/feature/alert/alert";
import { generateEditUrl } from "@/lib/slug/slug";
import { useRouter } from "next/navigation";

// ============================================
// Types
// ============================================
interface ModalDetailUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number | null;
  onEdit?: (user: Users) => void;
}

// ============================================
// Component
// ============================================
export default function ModalDetailUser({
  isOpen,
  onClose,
  userId,
  onEdit,
}: ModalDetailUserProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { selectedUsers, loading, error } = useSelector(
    (state: RootState) => state.Users
  );

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // ============================================
  // Mount check for Portal
  // ============================================
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ============================================
  // Fetch User Data
  // ============================================
  useEffect(() => {
    if (isOpen && userId) {
      dispatch(getUsersById(userId));
    }

    return () => {
      if (!isOpen) {
        dispatch(clearSelectedUsers());
      }
    };
  }, [isOpen, userId, dispatch]);

  // ============================================
  // Lock body scroll when modal is open
  // ============================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ============================================
  // Handlers
  // ============================================
  const handleClose = () => {
    dispatch(clearSelectedUsers());
    onClose();
  };

  const handleEdit = () => {
    if (selectedUsers) {
      if (onEdit) {
        onEdit(selectedUsers);
      } else {
        const editUrl = generateEditUrl(
          "/MasterData/User/Edit",
          selectedUsers.id
        );
        router.push(editUrl);
      }
      handleClose();
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      Alert.toast.success("Berhasil disalin!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      Alert.toast.error("Gagal menyalin");
    }
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // ============================================
  // Helper Functions
  // ============================================
  const getRoleBadge = (role: string) => {
    const roleConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      admin: {
        bg: isDarkMode ? "bg-purple-500/20" : "bg-purple-100",
        text: isDarkMode ? "text-purple-400" : "text-purple-700",
        label: "Administrator",
      },
      salesman: {
        bg: isDarkMode ? "bg-blue-500/20" : "bg-blue-100",
        text: isDarkMode ? "text-blue-400" : "text-blue-700",
        label: "Salesman",
      },
      customer: {
        bg: isDarkMode ? "bg-green-500/20" : "bg-green-100",
        text: isDarkMode ? "text-green-400" : "text-green-700",
        label: "Customer",
      },
    };

    const config = roleConfig[role] || roleConfig.customer;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold",
          config.bg,
          config.text
        )}
      >
        <Shield size={14} />
        {config.label}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy", { locale: localeId });
  };

  // ============================================
  // Don't render if not open or not mounted
  // ============================================
  if (!isOpen || !mounted) return null;

  // ============================================
  // Detail Item Component
  // ============================================
  const DetailItem = ({
    icon: Icon,
    label,
    value,
    copyable = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
    copyable?: boolean;
  }) => (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl transition-colors",
        isDarkMode
          ? "bg-slate-800/50 hover:bg-slate-800"
          : "bg-slate-50 hover:bg-slate-100"
      )}
    >
      <div
        className={cn(
          "p-2.5 rounded-lg flex-shrink-0",
          isDarkMode
            ? "bg-cyan-500/20 text-cyan-400"
            : "bg-cyan-100 text-cyan-600"
        )}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs font-medium mb-1",
            isDarkMode ? "text-slate-400" : "text-slate-500"
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-semibold break-all",
            isDarkMode ? "text-white" : "text-slate-900"
          )}
        >
          {value || "-"}
        </p>
      </div>
      {copyable && value && (
        <button
          onClick={() => handleCopy(value, label)}
          className={cn(
            "p-2 rounded-lg transition-colors flex-shrink-0",
            isDarkMode
              ? "hover:bg-slate-700 text-slate-400 hover:text-white"
              : "hover:bg-slate-200 text-slate-500 hover:text-slate-700"
          )}
          title="Salin"
        >
          {copiedField === label ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      )}
    </div>
  );

  // ============================================
  // Modal Content
  // ============================================
  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl",
          isDarkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white border border-slate-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 px-6 py-4 border-b",
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-slate-200"
          )}
        >
          <div className="flex items-center justify-between">
            <h2
              id="modal-title"
              className={cn(
                "text-xl font-bold",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
            >
              Detail User
            </h2>
            <button
              onClick={handleClose}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                  : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
              )}
              aria-label="Tutup modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}
              >
                Memuat data user...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div
                className={cn(
                  "p-4 rounded-full",
                  isDarkMode ? "bg-red-500/20" : "bg-red-100"
                )}
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p
                className={cn(
                  "text-sm text-center",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}
              >
                {error}
              </p>
              <Button variant="outline" size="sm" onClick={handleClose}>
                Tutup
              </Button>
            </div>
          )}

          {/* User Data */}
          {selectedUsers && !loading && !error && (
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4",
                    "bg-gradient-to-br from-cyan-500 to-blue-600 text-white",
                    "shadow-lg shadow-cyan-500/30"
                  )}
                >
                  {getInitials(selectedUsers.fullName || "U")}
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-1",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {selectedUsers.fullName || "-"}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-3",
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  {selectedUsers.email || "-"}
                </p>
                {getRoleBadge(selectedUsers.role || "customer")}
              </div>

              {/* Divider */}
              <div
                className={cn(
                  "border-t",
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                )}
              />

              {/* Contact Information */}
              <div>
                <h4
                  className={cn(
                    "text-sm font-semibold mb-3 flex items-center gap-2",
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  )}
                >
                  <Phone size={16} className="text-cyan-500" />
                  Informasi Kontak
                </h4>
                <div className="space-y-3">
                  <DetailItem
                    icon={Mail}
                    label="Email"
                    value={selectedUsers.email}
                    copyable
                  />
                  <DetailItem
                    icon={Phone}
                    label="Nomor Telepon"
                    value={selectedUsers.phoneNumber}
                    copyable
                  />
                  <DetailItem
                    icon={MessageCircle}
                    label="Nomor WhatsApp"
                    value={selectedUsers.whatsappNumber}
                    copyable
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Lokasi"
                    value={selectedUsers.location}
                  />
                </div>
              </div>

              {/* Divider */}
              <div
                className={cn(
                  "border-t",
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                )}
              />

              {/* Timestamps */}
              <div>
                <h4
                  className={cn(
                    "text-sm font-semibold mb-3 flex items-center gap-2",
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  )}
                >
                  <Clock size={16} className="text-cyan-500" />
                  Informasi Waktu
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={cn(
                      "p-4 rounded-xl",
                      isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar
                        size={16}
                        className={
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }
                      />
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        )}
                      >
                        Dibuat
                      </p>
                    </div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isDarkMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      {selectedUsers.createdAt
                        ? formatDate(selectedUsers.createdAt)
                        : "-"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-4 rounded-xl",
                      isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock
                        size={16}
                        className={
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }
                      />
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        )}
                      >
                        Diperbarui
                      </p>
                    </div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isDarkMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      {selectedUsers.updatedAt
                        ? formatDate(selectedUsers.updatedAt)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div
                className={cn(
                  "p-4 rounded-xl",
                  isDarkMode ? "bg-slate-800/30" : "bg-slate-100"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs font-medium mb-1",
                        isDarkMode ? "text-slate-500" : "text-slate-500"
                      )}
                    >
                      User ID
                    </p>
                    <p
                      className={cn(
                        "text-xs font-mono break-all",
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {selectedUsers.id}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(String(selectedUsers.id), "User ID")
                    }
                    className={cn(
                      "p-2 rounded-lg transition-colors flex-shrink-0 ml-2",
                      isDarkMode
                        ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                        : "hover:bg-slate-200 text-slate-500 hover:text-slate-700"
                    )}
                    title="Salin ID"
                  >
                    {copiedField === "User ID" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedUsers && !loading && !error && (
          <div
            className={cn(
              "sticky bottom-0 px-6 py-4 border-t flex gap-3",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
            )}
          >
            <Button
              variant="outline"
              fullWidth
              onClick={handleClose}
              className={
                isDarkMode
                  ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                  : ""
              }
            >
              Tutup
            </Button>
            <Button
              variant="primary"
              fullWidth
              leftIcon={Edit}
              onClick={handleEdit}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Edit User
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // Render with Portal to body
  // ============================================
  return createPortal(modalContent, document.body);
}
