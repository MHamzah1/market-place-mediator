"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { BsCarFrontFill } from "react-icons/bs";
import { HiOutlineTag, HiOutlineCog } from "react-icons/hi";
import { IoCarSportOutline } from "react-icons/io5";

// Menu Item Types
interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: SubMenuItem[];
}

const MasterDataLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Auto-expand menu based on current path
  useEffect(() => {
    const masterDataPaths = [
      "/MasterData/Brand",
      "/MasterData/CarModel",
      "/MasterData/Specification",
      "/MasterData/User",
    ];
    const isInMasterData = masterDataPaths.some((path) =>
      pathname?.startsWith(path)
    );

    if (isInMasterData && !expandedMenus.includes("Master Data")) {
      setExpandedMenus((prev) => [...prev, "Master Data"]);
    }
  }, [pathname]);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Toggle submenu expansion
  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Check if menu item is active
  const isMenuActive = (href?: string, subItems?: SubMenuItem[]): boolean => {
    if (href && pathname === href) return true;
    if (subItems) {
      return subItems.some((sub) =>
        pathname?.startsWith(
          sub.href
            .replace("/Table", "")
            .replace("/Add", "")
            .replace("/Edit", "")
        )
      );
    }
    return false;
  };

  // Check if submenu item is active
  const isSubMenuActive = (href: string): boolean => {
    // Extract base path (e.g., /MasterData/Brand from /MasterData/Brand/Table)
    const basePath = href.replace("/Table", "").replace("/Add", "");
    return pathname?.startsWith(basePath) || false;
  };

  // Menu Items with submenu support
  const menuItems: MenuItem[] = [
    {
      icon: FiHome,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: FiGrid,
      label: "Master Data",
      subItems: [
        { label: "Brand", href: "/MasterData/Brand/Table" },
        { label: "Car Model", href: "/MasterData/CarModel/Table" },
        { label: "Specification", href: "/MasterData/Specification/Table" },
        { label: "User", href: "/MasterData/User/Table" },
      ],
    },
    {
      icon: FiBarChart2,
      label: "Laporan",
      href: "/reports",
    },
    {
      icon: FiSettings,
      label: "Pengaturan",
      href: "/settings",
    },
  ];

  // Get icon for submenu based on label
  const getSubMenuIcon = (label: string) => {
    switch (label) {
      case "Brand":
        return HiOutlineTag;
      case "Car Model":
        return IoCarSportOutline;
      case "Specification":
        return HiOutlineCog;
      case "User":
        return FiUsers;
      default:
        return FiGrid;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
      }`}
    >
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-cyan-500/10" : "bg-cyan-400/20"
          }`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-blue-500/10" : "bg-blue-400/20"
          }`}
          style={{ animationDelay: "1s" }}
        />
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
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BsCarFrontFill className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <div>
                <h1
                  className={`text-lg font-black tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Mediator
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
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item, index) => {
            const isActive = isMenuActive(item.href, item.subItems);
            const isExpanded = expandedMenus.includes(item.label);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={index}>
                {/* Main Menu Item */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border ${
                            isDarkMode
                              ? "border-cyan-500/30"
                              : "border-cyan-500/50"
                          }`
                        : isDarkMode
                        ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" />
                    )}
                    <item.icon className="text-xl relative z-10 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="font-semibold relative z-10 flex-1 text-left">
                          {item.label}
                        </span>
                        <span className="relative z-10">
                          {isExpanded ? (
                            <FiChevronDown className="text-lg" />
                          ) : (
                            <FiChevronRight className="text-lg" />
                          )}
                        </span>
                      </>
                    )}
                    {!sidebarOpen && isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border ${
                            isDarkMode
                              ? "border-cyan-500/30"
                              : "border-cyan-500/50"
                          }`
                        : isDarkMode
                        ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" />
                    )}
                    <item.icon className="text-xl relative z-10" />
                    {sidebarOpen && (
                      <span className="font-semibold relative z-10">
                        {item.label}
                      </span>
                    )}
                    {!sidebarOpen && isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-cyan-400 rounded-full" />
                    )}
                  </Link>
                )}

                {/* Submenu Items */}
                {hasSubItems && sidebarOpen && isExpanded && (
                  <div className="mt-2 ml-4 pl-4 border-l border-slate-700/50 space-y-1">
                    {item.subItems?.map((subItem, subIndex) => {
                      const SubIcon = getSubMenuIcon(subItem.label);
                      const isSubActive = isSubMenuActive(subItem.href);

                      return (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? isDarkMode
                                ? "bg-cyan-500/20 text-cyan-400 font-semibold"
                                : "bg-cyan-100 text-cyan-700 font-semibold"
                              : isDarkMode
                              ? "text-slate-400 hover:text-white hover:bg-slate-800/30"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <SubIcon
                            className={`text-lg ${
                              isSubActive ? "text-cyan-400" : ""
                            }`}
                          />
                          <span className="text-sm">{subItem.label}</span>
                          {isSubActive && (
                            <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full text-xs flex items-center justify-center font-bold text-white">
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

export default MasterDataLayout;
