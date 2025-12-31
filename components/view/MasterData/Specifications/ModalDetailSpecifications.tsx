/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Settings,
  Tag,
  FileText,
  Hash,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
  Edit,
  Copy,
  Check,
  CheckCircle,
  XCircle,
  Car,
  Layers,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getSpecificationById,
  clearSelectedSpecification,
  Specification,
} from "@/lib/state/slice/Specifications/SpecificationsSlice";
import { Button } from "@/components/ui";
import Alert from "@/components/feature/alert/alert";
import { generateEditUrl } from "@/lib/slug/slug";
import { useRouter } from "next/navigation";

interface ModalDetailSpecificationProps {
  isOpen: boolean;
  onClose: () => void;
  specificationId: string | null;
  onEdit?: (specification: Specification) => void;
}

function getCategoryBadgeStyle(category: string, isDarkMode: boolean) {
  const styles: Record<string, string> = {
    engine: "bg-red-500/20 text-red-400",
    transmission: "bg-purple-500/20 text-purple-400",
    fuel: "bg-yellow-500/20 text-yellow-400",
    dimension: "bg-blue-500/20 text-blue-400",
    performance: "bg-orange-500/20 text-orange-400",
    safety: "bg-green-500/20 text-green-400",
    comfort: "bg-pink-500/20 text-pink-400",
    exterior: "bg-indigo-500/20 text-indigo-400",
    interior: "bg-teal-500/20 text-teal-400",
  };
  return (
    styles[category] ||
    (isDarkMode
      ? "bg-slate-500/20 text-slate-400"
      : "bg-slate-200 text-slate-600")
  );
}

export default function ModalDetailSpecification({
  isOpen,
  onClose,
  specificationId,
  onEdit,
}: ModalDetailSpecificationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { selectedSpecification, loading, error } = useSelector(
    (state: RootState) => state.Specifications
  );

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && specificationId) {
      dispatch(getSpecificationById(specificationId));
    }
    return () => {
      if (!isOpen) {
        dispatch(clearSelectedSpecification());
      }
    };
  }, [isOpen, specificationId, dispatch]);

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

  const handleClose = () => {
    dispatch(clearSelectedSpecification());
    onClose();
  };

  const handleEdit = () => {
    if (selectedSpecification) {
      if (onEdit) {
        onEdit(selectedSpecification);
      } else {
        const editUrl = generateEditUrl(
          "/MasterData/Specification/Edit",
          selectedSpecification.id
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: localeId });
  };

  if (!isOpen || !mounted) return null;

  const DetailItem = ({
    icon: Icon,
    label,
    value,
    copyable = false,
    highlight = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
    copyable?: boolean;
    highlight?: boolean;
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
            highlight
              ? isDarkMode
                ? "text-cyan-400"
                : "text-cyan-600"
              : isDarkMode
              ? "text-white"
              : "text-slate-900"
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

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
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
              className={cn(
                "text-xl font-bold",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
            >
              Detail Specification
            </h2>
            <button
              onClick={handleClose}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                  : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
              )}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}
              >
                Memuat data specification...
              </p>
            </div>
          )}

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

          {selectedSpecification && !loading && !error && (
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                    "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                  )}
                >
                  <Settings size={32} />
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {selectedSpecification.specName}
                </h3>

                {/* Category Badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold capitalize mb-3",
                    getCategoryBadgeStyle(
                      selectedSpecification.specCategory || "",
                      isDarkMode
                    )
                  )}
                >
                  <Layers size={14} />
                  {selectedSpecification.specCategory || "-"}
                </span>

                {/* Value Display */}
                <div
                  className={cn(
                    "px-4 py-2 rounded-xl mb-3",
                    isDarkMode ? "bg-cyan-500/20" : "bg-cyan-100"
                  )}
                >
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-cyan-400" : "text-cyan-600"
                    )}
                  >
                    {selectedSpecification.specValue || "-"}
                  </span>
                  {selectedSpecification.specUnit && (
                    <span
                      className={cn(
                        "text-lg ml-1",
                        isDarkMode ? "text-cyan-300" : "text-cyan-500"
                      )}
                    >
                      {selectedSpecification.specUnit}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold",
                    selectedSpecification.isActive
                      ? isDarkMode
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-100 text-green-700"
                      : isDarkMode
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-orange-100 text-orange-700"
                  )}
                >
                  {selectedSpecification.isActive ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {selectedSpecification.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>

              {/* Divider */}
              <div
                className={cn(
                  "border-t",
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                )}
              />

              {/* Car Model Info */}
              {selectedSpecification.carModel && (
                <>
                  <div>
                    <h4
                      className={cn(
                        "text-sm font-semibold mb-3 flex items-center gap-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      <Car size={16} className="text-cyan-500" />
                      Model Mobil
                    </h4>
                    <div
                      className={cn(
                        "p-4 rounded-xl",
                        isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {selectedSpecification.carModel.imageUrl ? (
                          <img
                            src={selectedSpecification.carModel.imageUrl}
                            alt={selectedSpecification.carModel.modelName}
                            className="w-16 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                            <Car size={20} />
                          </div>
                        )}
                        <div>
                          <p
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            {selectedSpecification.carModel.modelName}
                          </p>
                          {selectedSpecification.carModel.brand?.name && (
                            <p
                              className={cn(
                                "text-sm",
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                              )}
                            >
                              {selectedSpecification.carModel.brand.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "border-t",
                      isDarkMode ? "border-slate-700" : "border-slate-200"
                    )}
                  />
                </>
              )}

              {/* Specification Details */}
              <div>
                <h4
                  className={cn(
                    "text-sm font-semibold mb-3 flex items-center gap-2",
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  )}
                >
                  <Settings size={16} className="text-cyan-500" />
                  Detail Spesifikasi
                </h4>
                <div className="space-y-3">
                  <DetailItem
                    icon={Tag}
                    label="Nama Spesifikasi"
                    value={selectedSpecification.specName}
                    copyable
                  />
                  <DetailItem
                    icon={Layers}
                    label="Kategori"
                    value={selectedSpecification.specCategory}
                  />
                  <DetailItem
                    icon={Hash}
                    label="Nilai"
                    value={`${selectedSpecification.specValue || "-"} ${
                      selectedSpecification.specUnit || ""
                    }`}
                    highlight
                  />
                  <DetailItem
                    icon={FileText}
                    label="Deskripsi"
                    value={selectedSpecification.description}
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
                      {selectedSpecification.createdAt
                        ? formatDate(selectedSpecification.createdAt)
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
                      {selectedSpecification.updatedAt
                        ? formatDate(selectedSpecification.updatedAt)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ID */}
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
                      Specification ID
                    </p>
                    <p
                      className={cn(
                        "text-xs font-mono break-all",
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {selectedSpecification.id}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        String(selectedSpecification.id),
                        "Specification ID"
                      )
                    }
                    className={cn(
                      "p-2 rounded-lg transition-colors flex-shrink-0 ml-2",
                      isDarkMode
                        ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                        : "hover:bg-slate-200 text-slate-500 hover:text-slate-700"
                    )}
                    title="Salin ID"
                  >
                    {copiedField === "Specification ID" ? (
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
        {selectedSpecification && !loading && !error && (
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
              Edit Specification
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
