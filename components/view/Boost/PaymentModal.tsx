"use client";

import React, { useState, useEffect } from "react";
import {
  FiX,
  FiCreditCard,
  FiSmartphone,
  FiCopy,
  FiCheck,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { BoostOrderResponse } from "@/lib/state/slice/boost/boostSlice";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderResponse: BoostOrderResponse;
  onPaymentComplete?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderResponse,
  onPaymentComplete,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Calculate time remaining
  useEffect(() => {
    if (!orderResponse?.transaction?.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(orderResponse.transaction.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [orderResponse]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "ewallet":
        return <FiSmartphone className="text-2xl" />;
      case "credit_card":
        return <FiCreditCard className="text-2xl" />;
      case "bank_transfer":
        return <FiCreditCard className="text-2xl" />;
      case "qris":
        return <FiSmartphone className="text-2xl" />;
      default:
        return <FiCreditCard className="text-2xl" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "ewallet":
        return "E-Wallet";
      case "credit_card":
        return "Kartu Kredit";
      case "bank_transfer":
        return "Transfer Bank";
      case "qris":
        return "QRIS";
      default:
        return method;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 p-4 border-b ${
            isDarkMode ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
          } flex items-center justify-between`}
        >
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Pembayaran Boost
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Timer Warning */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
              timeLeft === "Expired"
                ? "bg-red-500/20 border border-red-500/50"
                : "bg-yellow-500/20 border border-yellow-500/50"
            }`}
          >
            <FiClock
              className={timeLeft === "Expired" ? "text-red-500" : "text-yellow-500"}
            />
            <div>
              <div
                className={`font-semibold ${
                  timeLeft === "Expired" ? "text-red-500" : "text-yellow-500"
                }`}
              >
                {timeLeft === "Expired" ? "Pembayaran Kedaluwarsa" : "Selesaikan dalam"}
              </div>
              <div
                className={`text-2xl font-bold ${
                  timeLeft === "Expired" ? "text-red-400" : "text-yellow-400"
                }`}
              >
                {timeLeft}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Total Pembayaran
            </div>
            <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {formatPrice(orderResponse.transaction.amount)}
            </div>
          </div>

          {/* Payment Method */}
          <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                {getPaymentMethodIcon(orderResponse.transaction.paymentMethod)}
              </div>
              <div>
                <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {getPaymentMethodName(orderResponse.transaction.paymentMethod)}
                </div>
                <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  Ref: {orderResponse.payment.paymentReference}
                </div>
              </div>
            </div>

            {/* Virtual Account / QR Code */}
            {orderResponse.payment.virtualAccount && (
              <div className="mb-4">
                <div className={`text-sm mb-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  Nomor Virtual Account {orderResponse.payment.bankName || ""}
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDarkMode ? "bg-slate-700" : "bg-white"
                  }`}
                >
                  <span
                    className={`font-mono text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {orderResponse.payment.virtualAccount}
                  </span>
                  <button
                    onClick={() => handleCopy(orderResponse.payment.virtualAccount!)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? "hover:bg-slate-600 text-cyan-400" : "hover:bg-gray-100 text-blue-600"
                    }`}
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
            )}

            {/* QR Code */}
            {orderResponse.payment.qrCode && (
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? "bg-white" : "bg-white"}`}>
                  <img
                    src={orderResponse.payment.qrCode}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {orderResponse.payment.instructions && orderResponse.payment.instructions.length > 0 && (
            <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <div className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Cara Pembayaran:
              </div>
              <ol className="space-y-2">
                {orderResponse.payment.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isDarkMode
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {orderResponse.payment.paymentUrl && (
              <a
                href={orderResponse.payment.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 text-center font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                Bayar Sekarang
              </a>
            )}

            <button
              onClick={onClose}
              className={`w-full py-3 font-semibold rounded-xl transition-colors ${
                isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tutup
            </button>
          </div>

          {/* Note */}
          <div
            className={`flex items-start gap-2 mt-4 p-3 rounded-lg ${
              isDarkMode ? "bg-slate-800/50" : "bg-gray-50"
            }`}
          >
            <FiAlertCircle className={isDarkMode ? "text-slate-400" : "text-gray-400"} />
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Boost akan aktif otomatis setelah pembayaran berhasil diverifikasi.
              Anda akan mendapat notifikasi melalui email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
