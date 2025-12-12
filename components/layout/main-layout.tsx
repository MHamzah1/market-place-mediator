"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiHeart,
  FiLogOut,
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

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isLoggedIn, userInfo } = useSelector(
    (state: RootState) => state.auth
  );

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

  // Get role-based dashboard URL
  const getRoleDashboard = () => {
    switch (userInfo?.role) {
      case "admin":
        return "/admin/dashboard";
      case "salesman":
        return "/salesman/dashboard";
      case "customer":
        return "/customer/dashboard";
      default:
        return "/dashboard";
    }
  };

  const navItems = [
    { name: "Beranda", href: "/", icon: null },
    {
      name: "Marketplace Mobil",
      href: "/marketplace",
      icon: <AiOutlineCar className="inline mr-1" />,
    },
    {
      name: "Kalkulator Mobil",
      href: "/kalkulator",
      icon: <AiOutlineCalculator className="inline mr-1" />,
    },
    {
      name: "Jasa Inspeksi",
      href: "/inspeksi",
      icon: <AiOutlineCheckCircle className="inline mr-1" />,
    },
    // Conditional menu based on role
    ...(userInfo?.role === "admin"
      ? [
          {
            name: "Master Data",
            href: "/MasterData",
            icon: <AiOutlineCheckCircle className="inline mr-1" />,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <AiOutlineCar className="text-white text-2xl" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                CarMediator
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FiSearch className="text-gray-600 text-xl" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <FiHeart className="text-gray-600 text-xl" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Conditional Rendering: Login Button or User Avatar */}
              {!isLoggedIn ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                  onClick={() => router.push("/auth/login")}
                >
                  <FiUser />
                  <span>Masuk</span>
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  {/* User Avatar Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                      <span className="text-white text-sm font-bold">
                        {userInfo?.fullName?.charAt(0).toUpperCase() ||
                          userInfo?.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">
                          {userInfo?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userInfo?.email}
                        </p>
                        {userInfo?.phoneNumber && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {userInfo.phoneNumber}
                          </p>
                        )}
                        {userInfo?.role && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full capitalize">
                            {userInfo.role}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <Link
                        href={getRoleDashboard()}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <AiOutlineCar className="text-gray-600" />
                        <span className="text-sm text-gray-700">Dashboard</span>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiUser className="text-gray-600" />
                        <span className="text-sm text-gray-700">
                          Profil Saya
                        </span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <AiOutlineSetting className="text-gray-600" />
                        <span className="text-sm text-gray-700">
                          Pengaturan
                        </span>
                      </Link>

                      <Link
                        href="/favorites"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiHeart className="text-gray-600" />
                        <span className="text-sm text-gray-700">Favorit</span>
                      </Link>

                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full"
                        >
                          <FiLogOut className="text-red-600" />
                          <span className="text-sm text-red-600 font-medium">
                            Keluar
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Section */}
              {isLoggedIn ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {/* User Info Card */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">
                          {userInfo?.fullName?.charAt(0).toUpperCase() ||
                            userInfo?.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {userInfo?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {userInfo?.email}
                        </p>
                        {userInfo?.role && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full capitalize">
                            {userInfo.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={getRoleDashboard()}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <AiOutlineCar className="text-gray-600" />
                    <span className="text-sm text-gray-700">Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUser className="text-gray-600" />
                    <span className="text-sm text-gray-700">Profil Saya</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <AiOutlineSetting className="text-gray-600" />
                    <span className="text-sm text-gray-700">Pengaturan</span>
                  </Link>

                  <Link
                    href="/favorites"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiHeart className="text-gray-600" />
                    <span className="text-sm text-gray-700">Favorit</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 w-full"
                  >
                    <FiLogOut className="text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      Keluar
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2 pt-4">
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={() => {
                      router.push("/auth/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Masuk
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <FiSearch className="text-gray-600 text-xl" />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 relative">
                    <FiHeart className="text-gray-600 text-xl" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <AiOutlineCar className="text-white text-2xl" />
                </div>
                <span className="text-xl font-bold text-white">
                  CarMediator
                </span>
              </div>
              <p className="text-sm mb-4">
                Platform marketplace mobil terpercaya dengan layanan inspeksi
                profesional dan kalkulator pembiayaan.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">f</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">𝕏</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">in</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">IG</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Marketplace Mobil
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Kalkulator Pembiayaan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Jasa Inspeksi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Tukar Tambah
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Cara Pembelian
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-sm">
                <li>📧 info@carmediator.com</li>
                <li>📱 +62 812-3456-7890</li>
                <li>📍 Jakarta, Indonesia</li>
                <li className="pt-2">
                  <span className="text-xs">Jam Operasional:</span>
                  <br />
                  <span className="text-xs">Senin - Jumat: 08:00 - 17:00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} CarMediator. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
