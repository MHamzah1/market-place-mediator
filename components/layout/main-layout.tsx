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
    (state: RootState) => state.auth
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
      href: "/inspeksi",
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

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
      }`}
    >
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-cyan-500" : "bg-blue-400"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30"
                    : "bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/30"
                }`}
              >
                <AiOutlineCar className="text-white text-2xl" />
              </div>
              <div className="hidden sm:block">
                <span
                  className={`text-2xl font-black tracking-tight ${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"
                  }`}
                >
                  CarMediator
                </span>
                <div
                  className={`text-xs font-medium ${
                    isDarkMode ? "text-slate-500" : "text-slate-600"
                  }`}
                >
                  Marketplace Terpercaya
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 relative group ${
                    isDarkMode
                      ? "text-slate-300 hover:text-cyan-400"
                      : "text-slate-700 hover:text-blue-600"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1">
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
            <div className="hidden md:flex items-center space-x-3">
              <button
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isDarkMode
                    ? "hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400"
                    : "hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                }`}
              >
                <FiSearch className="text-xl" />
              </button>

              <button
                className={`p-3 rounded-xl transition-all duration-200 relative ${
                  isDarkMode
                    ? "hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400"
                    : "hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                }`}
              >
                <FiHeart className="text-xl" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-lg">
                  3
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30"
                    : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 hover:from-blue-500/20 hover:to-purple-500/20"
                }`}
                title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
              >
                {isDarkMode ? (
                  <FiSun className="text-xl" />
                ) : (
                  <FiMoon className="text-xl" />
                )}
              </button>

              {/* User Section */}
              {!isLoggedIn ? (
                <button
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center space-x-2 shadow-lg ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
                  }`}
                  onClick={() => router.push("/auth/login")}
                >
                  <FiUser />
                  <span>Masuk</span>
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`p-1.5 rounded-xl transition-all duration-200 ${
                      isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 font-bold text-white text-lg hover:scale-110 transition-transform">
                      {userInfo?.fullName?.charAt(0).toUpperCase() ||
                        userInfo?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className={`absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden animate-fadeIn ${
                        isDarkMode
                          ? "bg-slate-800/95 border-slate-700/50"
                          : "bg-white/95 border-slate-200"
                      }`}
                    >
                      {/* User Info */}
                      <div
                        className={`p-5 border-b ${
                          isDarkMode
                            ? "border-slate-700/50"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg font-bold text-white text-xl">
                            {userInfo?.fullName?.charAt(0).toUpperCase() ||
                              userInfo?.email?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-bold text-lg ${
                                isDarkMode ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {userInfo?.fullName || "User"}
                            </p>
                            <p
                              className={`text-sm truncate ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                              }`}
                            >
                              {userInfo?.email}
                            </p>
                          </div>
                        </div>
                        {userInfo?.role && (
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                              isDarkMode
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {userInfo.role.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {[
                          {
                            icon: AiOutlineCar,
                            label: "Dashboard",
                            href: getRoleDashboard(),
                          },
                          {
                            icon: FiUser,
                            label: "Profil Saya",
                            href: "/profile",
                          },
                          {
                            icon: AiOutlineSetting,
                            label: "Pengaturan",
                            href: "/settings",
                          },
                          {
                            icon: FiHeart,
                            label: "Favorit",
                            href: "/favorites",
                          },
                        ].map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isDarkMode
                                ? "hover:bg-slate-700/50 text-slate-300"
                                : "hover:bg-blue-50 text-slate-700"
                            }`}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <item.icon className="text-xl" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}

                        <div
                          className={`my-2 border-t ${
                            isDarkMode
                              ? "border-slate-700/50"
                              : "border-slate-200"
                          }`}
                        ></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 w-full transition-all duration-200"
                        >
                          <FiLogOut className="text-xl" />
                          <span className="font-bold">Keluar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-3 rounded-xl transition-all duration-200 ${
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden border-t backdrop-blur-xl ${
              isDarkMode
                ? "bg-slate-900/95 border-slate-800/50"
                : "bg-white/95 border-slate-200"
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? "text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isDarkMode
                    ? "text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {isDarkMode ? (
                  <>
                    <FiSun className="text-xl text-yellow-500" />
                    <span>Mode Terang</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="text-xl text-blue-600" />
                    <span>Mode Gelap</span>
                  </>
                )}
              </button>

              {/* Mobile User Section */}
              {isLoggedIn && (
                <div
                  className={`pt-4 mt-4 border-t space-y-2 ${
                    isDarkMode ? "border-slate-800/50" : "border-slate-200"
                  }`}
                >
                  <div
                    className={`px-4 py-4 rounded-2xl ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                        : "bg-gradient-to-r from-blue-50 to-purple-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg font-bold text-white text-lg">
                        {userInfo?.fullName?.charAt(0).toUpperCase() ||
                          userInfo?.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-bold ${
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
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isDarkMode
                          ? "hover:bg-slate-800/50 text-slate-300"
                          : "hover:bg-blue-50 text-slate-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="text-xl" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 w-full transition-all duration-200"
                  >
                    <FiLogOut className="text-xl" />
                    <span className="font-bold">Keluar</span>
                  </button>
                </div>
              )}

              {!isLoggedIn && (
                <button
                  className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
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

      {/* Footer */}
      <footer
        className={`relative z-10 ${
          isDarkMode
            ? "bg-gradient-to-b from-slate-900 to-black text-slate-300"
            : "bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <AiOutlineCar className="text-white text-2xl" />
                </div>
                <div>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    CarMediator
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Platform marketplace mobil terpercaya dengan layanan inspeksi
                profesional dan kalkulator pembiayaan.
              </p>
              <div className="flex space-x-3">
                {["f", "𝕏", "in", "IG"].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30"
                        : "bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                    }`}
                  >
                    <span className="text-sm font-bold">{social}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
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
                <h3 className="text-white font-bold text-lg mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className={`transition-colors duration-200 ${
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

          <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center text-slate-500">
            <p>
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
