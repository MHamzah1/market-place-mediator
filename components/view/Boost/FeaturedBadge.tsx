"use client";

import React from "react";
import { FiStar, FiTrendingUp, FiAward, FiZap } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

interface FeaturedBadgeProps {
  badge: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const FeaturedBadge: React.FC<FeaturedBadgeProps> = ({
  badge,
  size = "md",
  className = "",
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const getBadgeConfig = () => {
    switch (badge.toLowerCase()) {
      case "premium":
        return {
          icon: FiAward,
          gradient: "from-purple-500 to-pink-600",
          shadowColor: "shadow-purple-500/40",
          text: "Premium",
        };
      case "unggulan":
        return {
          icon: FiStar,
          gradient: "from-yellow-500 to-orange-600",
          shadowColor: "shadow-yellow-500/40",
          text: "Unggulan",
        };
      case "populer":
        return {
          icon: FiTrendingUp,
          gradient: "from-cyan-500 to-blue-600",
          shadowColor: "shadow-cyan-500/40",
          text: "Populer",
        };
      case "featured":
      default:
        return {
          icon: FiZap,
          gradient: "from-green-500 to-emerald-600",
          shadowColor: "shadow-green-500/40",
          text: "Featured",
        };
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center font-bold rounded-full
        bg-gradient-to-r ${config.gradient}
        text-white shadow-lg ${config.shadowColor}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.text}</span>
    </span>
  );
};

export default FeaturedBadge;
