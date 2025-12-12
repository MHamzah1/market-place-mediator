"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/state/store";

// Konfigurasi route protection
const ROUTE_CONFIG = {
  // Route yang memerlukan autentikasi
  protected: [
    "/dashboard",
    "/profile",
    "/settings",
    "/favorites",
    "/MasterData",
    "/kalkulator", // ← PROTECTED
    "/inspeksi", // ← PROTECTED
    "/marketplace/post",
    "/marketplace/my-cars",
  ],

  // Route yang hanya bisa diakses guest (belum login)
  guest: ["/auth/login", "/auth/register"],

  // Route public (bisa diakses siapa saja)
  public: ["/", "/marketplace", "/about", "/contact"],
};

export const useRouteGuard = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, loading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;

    const checkRouteAccess = () => {
      const isProtectedRoute = ROUTE_CONFIG.protected.some((route) =>
        pathname.startsWith(route)
      );

      const isGuestRoute = ROUTE_CONFIG.guest.some((route) =>
        pathname.startsWith(route)
      );

      const isPublicRoute = ROUTE_CONFIG.public.some(
        (route) => pathname === route || pathname.startsWith(route)
      );

      // Protected route logic
      if (isProtectedRoute) {
        if (!isLoggedIn) {
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(
            pathname
          )}`;
          router.push(loginUrl);
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
      }
      // Guest only route logic
      else if (isGuestRoute) {
        if (isLoggedIn) {
          router.push("/dashboard");
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
      }
      // Public route logic
      else {
        setIsAllowed(true);
      }

      setIsChecking(false);
    };

    checkRouteAccess();
  }, [pathname, isLoggedIn, loading, router]);

  return { isChecking, isAllowed, isLoggedIn, loading };
};
