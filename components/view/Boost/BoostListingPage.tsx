"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchBoostPackages,
  calculateBoost,
  createBoostOrder,
  clearEstimation,
  clearOrderResponse,
  BoostPackage,
} from "@/lib/state/slice/boost/boostSlice";
import { fetchListingDetail } from "@/lib/state/slice/marketplace/marketplaceSlice";
import { useTheme } from "@/context/ThemeContext";
import {
  FiArrowLeft,
  FiZap,
  FiCreditCard,
  FiSmartphone,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import BoostPackageCard from "./BoostPackageCard";
import BoostPreview from "./BoostPreview";
import PaymentModal from "./PaymentModal";
import { decryptQueryParam } from "@/lib/slug/slug";

const BoostListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = decryptQueryParam(searchParams.get("listingId"));

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { selectedListing, detailLoading } = useSelector(
    (state: RootState) => state.marketplace,
  );
  const {
    packages,
    packagesLoading,
    estimation,
    estimationLoading,
    orderResponse,
    orderLoading,
    error,
  } = useSelector((state: RootState) => state.boost);

  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [step, setStep] = useState<number>(1);

  // Check auth and fetch data
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login");
      return;
    }

    if (!listingId) {
      toast.error("Listing tidak ditemukan");
      router.push("/marketplace/my-listings");
      return;
    }

    dispatch(fetchBoostPackages());
    dispatch(fetchListingDetail(listingId));

    return () => {
      dispatch(clearEstimation());
      dispatch(clearOrderResponse());
    };
  }, [dispatch, isLoggedIn, listingId, router]);

  // Calculate estimation when package selected
  useEffect(() => {
    if (selectedPackage && listingId) {
      dispatch(
        calculateBoost({
          listingId,
          packageId: selectedPackage.id,
        }),
      );
    }
  }, [selectedPackage, listingId, dispatch]);

  // Show payment modal when order created
  useEffect(() => {
    if (orderResponse) {
      setShowPaymentModal(true);
    }
  }, [orderResponse]);

  const handleSelectPackage = (pkg: BoostPackage) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handleCreateOrder = async () => {
    if (!selectedPackage || !listingId) return;

    try {
      await dispatch(
        createBoostOrder({
          listingId,
          packageId: selectedPackage.id,
          paymentMethod,
        }),
      ).unwrap();
      toast.success("Order berhasil dibuat!");
    } catch (err: any) {
      toast.error(err || "Gagal membuat order");
    }
  };

  const paymentMethods = [
    { id: "qris", name: "QRIS", icon: FiSmartphone, desc: "Scan & bayar" },
    {
      id: "ewallet",
      name: "E-Wallet",
      icon: FiSmartphone,
      desc: "GoPay, OVO, Dana",
    },
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      icon: FiCreditCard,
      desc: "Virtual Account",
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      icon: FiCreditCard,
      desc: "Visa, Mastercard",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-all mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <FiArrowLeft className="text-base sm:text-lg" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600">
              <FiZap className="text-xl sm:text-2xl md:text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Boost Listing
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-blue-100">
                Tingkatkan visibilitas listing Anda
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-8 overflow-x-auto pb-2">
            {["Pilih Paket", "Pembayaran", "Selesai"].map((label, idx) => (
              <div key={idx} className="flex items-center flex-shrink-0">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                    step > idx + 1
                      ? "bg-green-500 text-white"
                      : step === idx + 1
                        ? "bg-white text-blue-600"
                        : "bg-white/20 text-white/60"
                  }`}
                >
                  {step > idx + 1 ? (
                    <FiCheck className="text-xs sm:text-sm" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`ml-1.5 sm:ml-2 text-xs sm:text-sm hidden sm:inline ${
                    step >= idx + 1 ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>
                {idx < 2 && (
                  <div
                    className={`w-6 sm:w-8 md:w-12 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded ${
                      step > idx + 1 ? "bg-green-500" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Loading */}
        {(packagesLoading || detailLoading) && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        )}

        {/* Step 1: Select Package */}
        {!packagesLoading && !detailLoading && step === 1 && (
          <div>
            <h2
              className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Pilih Paket Boost
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {packages.map((pkg, idx) => (
                <BoostPackageCard
                  key={pkg.id}
                  packageData={pkg}
                  isSelected={selectedPackage?.id === pkg.id}
                  onSelect={handleSelectPackage}
                  isPopular={idx === 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Preview & Payment */}
        {step === 2 && estimation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Preview */}
            <div>
              <h2
                className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Preview Boost
              </h2>
              <BoostPreview estimation={estimation} />

              <button
                onClick={() => setStep(1)}
                className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ubah Paket
              </button>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h2
                className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Metode Pembayaran
              </h2>

              <div
                className={`rounded-xl sm:rounded-2xl ${isDarkMode ? "bg-slate-900" : "bg-white"} shadow-lg sm:shadow-xl p-4 sm:p-5 md:p-6`}
              >
                <div className="space-y-2 sm:space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? isDarkMode
                            ? "bg-cyan-500/20 ring-2 ring-cyan-500"
                            : "bg-blue-50 ring-2 ring-blue-500"
                          : isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700"
                            : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                          paymentMethod === method.id
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                            : isDarkMode
                              ? "bg-slate-700"
                              : "bg-gray-200"
                        }`}
                      >
                        <method.icon
                          className={`text-base sm:text-lg md:text-xl ${
                            paymentMethod === method.id
                              ? "text-white"
                              : isDarkMode
                                ? "text-slate-400"
                                : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-sm sm:text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {method.name}
                        </div>
                        <div
                          className={`text-xs sm:text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                        >
                          {method.desc}
                        </div>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <FiCheck className="text-white text-xs sm:text-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div
                  className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}
                >
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }
                    >
                      Paket {selectedPackage?.name}
                    </span>
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      {formatPrice(selectedPackage?.price || 0)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between pt-2 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
                  >
                    <span
                      className={`font-bold text-sm sm:text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Total
                    </span>
                    <span className="font-bold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                      {formatPrice(estimation.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Create Order Button */}
                <button
                  onClick={handleCreateOrder}
                  disabled={orderLoading}
                  className="w-full mt-4 sm:mt-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {orderLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      <span className="text-sm sm:text-base">Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FiZap className="text-base sm:text-lg" />
                      <span>Bayar & Aktifkan Boost</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {orderResponse && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            router.push("/marketplace/boost/history");
          }}
          orderResponse={orderResponse}
          onPaymentComplete={() => {
            router.push("/marketplace/boost/history");
          }}
        />
      )}
    </div>
  );
};

export default BoostListingPage;
