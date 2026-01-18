"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiHeart,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import {
  AiOutlineCar,
  AiOutlineCalculator,
  AiOutlineCheckCircle,
  AiOutlineSetting,
} from "react-icons/ai";
import Link from "next/link";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import toast from "react-hot-toast";
import { LogoutUser } from "@/lib/state/slice/authSlice";
import { useTheme } from "@/context/ThemeContext";
import { MediatorLogo } from "../ui/mediatorLogo";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const { loading, error, isLoggedIn, userInfo } = useSelector(
    (state: RootState) => state.auth,
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(LogoutUser()).unwrap();
      toast.success("Berhasil logout");
      router.push("/");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  const getRoleDashboard = () => {
    switch (userInfo?.role) {
      case "admin":
        return "/marketplace/my-listings";
      case "salesman":
        return "/marketplace/my-listings";
      case "customer":
        return "/marketplace/my-listings";
      default:
        return "/dashboard";
    }
  };

  const navItems = [
    { name: "Beranda", href: "/", icon: null },
    {
      name: "Marketplace",
      href: "/marketplace",
      icon: <AiOutlineCar className="inline mr-1" />,
    },
    {
      name: "Kalkulator",
      href: "/Kalkulator",
      icon: <AiOutlineCalculator className="inline mr-1" />,
    },
    {
      name: "Inspeksi",
      href: "/Inspeksi",
      icon: <AiOutlineCheckCircle className="inline mr-1" />,
    },
    ...(userInfo?.role === "admin"
      ? [
          {
            name: "Master Data",
            href: "/MasterData",
            icon: <AiOutlineSetting className="inline mr-1" />,
          },
        ]
      : []),
  ];

  // ...existing code...

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
      }`}
    >
      {/* Decorative background elements - Optimized for mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-cyan-500" : "bg-blue-400"
          }`}
        ></div>
        <div
          className={`absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          }`}
        ></div>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDarkMode
              ? "bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/20"
              : "bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-200/50"
            : isDarkMode
              ? "bg-slate-900/50 backdrop-blur-md"
              : "bg-white/50 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo - Responsive */}
            <div className="flex-shrink-0">
              <MediatorLogo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 lg:px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 relative group ${
                    isDarkMode
                      ? "text-slate-300 hover:text-cyan-400"
                      : "text-slate-700 hover:text-blue-600"
                  }`}
                >
                  <span className="relative z-15 flex items-center gap-1 text-base lg:text-xl">
                    {item.icon}
                    {item.name}
                  </span>
                  <div
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      isDarkMode ? "bg-slate-800/50" : "bg-blue-50"
                    }`}
                  ></div>
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 lg:p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30"
                    : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 hover:from-blue-500/20 hover:to-purple-500/20"
                }`}
                title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
              >
                {isDarkMode ? (
                  <FiSun className="text-lg lg:text-xl" />
                ) : (
                  <FiMoon className="text-lg lg:text-xl" />
                )}
              </button>

              {/* User Section */}
              {!isLoggedIn ? (
                <button
                  className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center space-x-2 shadow-lg text-sm lg:text-base ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
                  }`}
                  onClick={() => router.push("/auth/login")}
                >
                  <FiUser className="text-base lg:text-lg" />
                  <span>Masuk</span>
                </button>
              ) : (
                // ...existing dropdown code...
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`p-1.5 rounded-xl transition-all duration-200 ${
                      isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 font-bold text-white text-base lg:text-lg hover:scale-110 transition-transform">
                      {userInfo?.fullName?.charAt(0).toUpperCase() ||
                        userInfo?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  </button>

                  {isDropdownOpen && (
                    // ...existing dropdown menu code...
                    <div
                      className={`absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden animate-fadeIn ${
                        isDarkMode
                          ? "bg-slate-800/95 border-slate-700/50"
                          : "bg-white/95 border-slate-200"
                      }`}
                    >
                      {/* ...existing dropdown content... */}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Improved */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/10 text-blue-600"
                }`}
              >
                {isDarkMode ? (
                  <FiSun className="text-lg" />
                ) : (
                  <FiMoon className="text-lg" />
                )}
              </button>

              {/* Menu Button */}
              <button
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "hover:bg-slate-800/50 text-slate-300"
                    : "hover:bg-blue-50 text-slate-700"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <FiX className="text-2xl" />
                ) : (
                  <FiMenu className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Improved */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden border-t backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto ${
              isDarkMode
                ? "bg-slate-900/95 border-slate-800/50"
                : "bg-white/95 border-slate-200"
            }`}
          >
            <div className="px-3 py-3 space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-all duration-200 text-base ${
                    isDarkMode
                      ? "text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </span>
                </Link>
              ))}

              {/* Mobile User Section */}
              {isLoggedIn && (
                <div
                  className={`pt-3 mt-3 border-t space-y-1.5 ${
                    isDarkMode ? "border-slate-800/50" : "border-slate-200"
                  }`}
                >
                  <div
                    className={`px-3 py-3 rounded-xl ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                        : "bg-gradient-to-r from-blue-50 to-purple-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg font-bold text-white text-base flex-shrink-0">
                        {userInfo?.fullName?.charAt(0).toUpperCase() ||
                          userInfo?.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-bold truncate ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {userInfo?.fullName || "User"}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {userInfo?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {[
                    {
                      icon: AiOutlineCar,
                      label: "Dashboard",
                      href: getRoleDashboard(),
                    },
                    { icon: FiUser, label: "Profil", href: "/profile" },
                    { icon: FiHeart, label: "Favorit", href: "/favorites" },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isDarkMode
                          ? "hover:bg-slate-800/50 text-slate-300"
                          : "hover:bg-blue-50 text-slate-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="text-lg flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-500 w-full transition-all duration-200"
                  >
                    <FiLogOut className="text-lg flex-shrink-0" />
                    <span className="font-bold text-sm">Keluar</span>
                  </button>
                </div>
              )}

              {!isLoggedIn && (
                <button
                  className={`w-full px-4 py-2.5 rounded-lg font-bold transition-all duration-200 shadow-lg text-sm ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  }`}
                  onClick={() => {
                    router.push("/auth/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Masuk
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Footer - Responsive */}
      <footer
        className={`relative z-10 ${
          isDarkMode
            ? "bg-gradient-to-b from-slate-900 to-black text-slate-300"
            : "bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  <AiOutlineCar className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    CarMediator
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-4 lg:mb-6 leading-relaxed">
                Platform marketplace mobil terpercaya dengan layanan inspeksi
                profesional dan kalkulator pembiayaan.
              </p>
              <div className="flex space-x-2 sm:space-x-3">
                {["f", "𝕏", "in", "IG"].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30"
                        : "bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">
                      {social}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links - Responsive */}
            {[
              {
                title: "Layanan",
                links: [
                  "Marketplace Mobil",
                  "Kalkulator Pembiayaan",
                  "Jasa Inspeksi",
                  "Tukar Tambah",
                ],
              },
              {
                title: "Bantuan",
                links: [
                  "Pusat Bantuan",
                  "Cara Pembelian",
                  "Syarat & Ketentuan",
                  "Kebijakan Privasi",
                ],
              },
              {
                title: "Kontak",
                links: [
                  "📧 info@carmediator.com",
                  "📱 +62 812-3456-7890",
                  "📍 Jakarta, Indonesia",
                  "🕐 Senin - Jumat: 08:00 - 17:00",
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-bold text-base sm:text-lg mb-3 lg:mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className={`transition-colors duration-200 break-words ${
                          isDarkMode
                            ? "hover:text-cyan-400"
                            : "hover:text-blue-400"
                        }`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-xs sm:text-sm text-center text-slate-500">
            <p className="break-words px-2">
              &copy; {new Date().getFullYear()} CarMediator. All rights
              reserved. Made with ❤️ in Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
