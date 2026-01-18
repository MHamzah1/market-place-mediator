import React from "react";
import Link from "next/link";
import { IoCarSportSharp } from "react-icons/io5";

interface MediatorLogoProps {
  className?: string;
  variant?: "full" | "icon"; // 'full' ada teksnya, 'icon' cuma logonya
  href?: string; // URL tujuan link
}

export const MediatorLogo: React.FC<MediatorLogoProps> = ({
  className = "",
  variant = "full",
  href = "/", // Default ke homepage
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 select-none cursor-pointer transition-transform hover:scale-105 ${className}`}
    >
      {/* BAGIAN ICON LOGO (Car Icon) */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl blur-md opacity-50"></div>
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg">
          <IoCarSportSharp className="text-white text-3xl" />
        </div>
      </div>

      {/* BAGIAN TEKS (Hanya muncul jika variant 'full') */}
      {variant === "full" && (
        <div className="flex flex-col justify-center">
          <h1 className="leading-none font-black tracking-tighter text-2xl md:text-3xl">
            <span className="text-slate-900 dark:text-white">MEDIATOR</span>
            <span className="text-blue-600">.COM</span>
          </h1>
          <p className="text-[0.55rem] md:text-[0.65rem] font-medium tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase mt-1">
            Cepat, dan Terpercaya
          </p>
        </div>
      )}
    </Link>
  );
};
