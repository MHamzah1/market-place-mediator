"use client";

import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiShoppingCart,
  FiSettings,
  FiBarChart2,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { BsCarFrontFill } from "react-icons/bs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/", active: true },
    {
      icon: BsCarFrontFill,
      label: "Brand",
      href: "/MasterData/Brand/Table",
      active: false,
    },
    {
      icon: FiUsers,
      label: "Car Model",
      href: "/master-data-customer",
      active: false,
    },
    {
      icon: FiShoppingCart,
      label: "User",
      href: "/transactions",
      active: false,
    },
    { icon: FiBarChart2, label: "Laporan", href: "/reports", active: false },
    { icon: FiSettings, label: "Pengaturan", href: "/settings", active: false },
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode
          ? "bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900"
      }`}
    >
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-cyan-500/10" : "bg-cyan-400/20"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-blue-500/10" : "bg-blue-400/20"
          }`}
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full backdrop-blur-xl border-r transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          isDarkMode
            ? "bg-slate-900/80 border-slate-800/50"
            : "bg-white/80 border-slate-200"
        }`}
      >
        {/* Logo */}
        <div
          className={`h-20 flex items-center justify-between px-6 border-b ${
            isDarkMode ? "border-slate-800/50" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BsCarFrontFill className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <div>
                <h1
                  className={`text-lg font-black tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  AutoHub
                </h1>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Marketplace
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                item.active
                  ? `bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border ${
                      isDarkMode ? "border-cyan-500/30" : "border-cyan-500/50"
                    }`
                  : isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {item.active && (
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
              )}
              <item.icon className="text-xl relative z-10" />
              {sidebarOpen && (
                <span className="font-semibold relative z-10">
                  {item.label}
                </span>
              )}
              {!sidebarOpen && item.active && (
                <div className="absolute right-2 w-2 h-2 bg-cyan-400 rounded-full"></div>
              )}
            </a>
          ))}
        </nav>

        {/* User Profile */}
        {sidebarOpen && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
              isDarkMode ? "border-slate-800/50" : "border-slate-200"
            }`}
          >
            <div
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-slate-800/50 hover:bg-slate-800"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                A
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Admin User
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  admin@autohub.com
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header
          className={`h-20 border-b backdrop-blur-xl sticky top-0 z-30 ${
            isDarkMode
              ? "border-slate-800/50 bg-slate-900/30"
              : "border-slate-200 bg-white/30"
          }`}
        >
          <div className="h-full px-8 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isDarkMode
                  ? "bg-slate-800/50 hover:bg-slate-800"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {sidebarOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>

            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-slate-800/50 hover:bg-slate-800 text-yellow-400"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <FiSun className="text-xl" />
                ) : (
                  <FiMoon className="text-xl" />
                )}
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari mobil, customer, transaksi..."
                  className={`w-80 px-4 py-2 pl-10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-colors ${
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700/50 placeholder-slate-500 text-white"
                      : "bg-white border-slate-200 placeholder-slate-400 text-slate-900"
                  }`}
                />
                <FiGrid
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
              </div>

              <button
                className={`relative p-2 rounded-xl transition-colors ${
                  isDarkMode
                    ? "bg-slate-800/50 hover:bg-slate-800"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <FiShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full text-xs flex items-center justify-center font-bold text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 relative z-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
