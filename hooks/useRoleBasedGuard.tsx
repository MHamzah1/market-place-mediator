"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/state/store";

// Define role types
export type UserRole = "customer" | "admin" | "salesman";

// Konfigurasi route berdasarkan role
const ROLE_BASED_ROUTES = {
  // Admin only routes
  admin: [
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/settings",
    "/admin/reports",
    "/MasterData",
  ],

  // Salesman only routes
  salesman: [
    "/salesman",
    "/salesman/dashboard",
    "/salesman/cars",
    "/salesman/leads",
    "/salesman/commission",
  ],

  // Customer only routes
  customer: [
    "/customer",
    "/customer/dashboard",
    "/customer/my-cars",
    "/customer/bookings",
  ],

  // Routes yang memerlukan login (any role)
  authenticated: [
    "/dashboard",
    "/profile",
    "/settings",
    "/kalkulator",
    "/inspeksi",
    "/favorites",
  ],

  // Guest only routes (belum login)
  guest: ["/auth/login", "/auth/register"],

  // Public routes (siapa saja bisa akses)
  public: ["/", "/marketplace", "/about", "/contact"],
};

interface RouteGuardResult {
  isChecking: boolean;
  isAllowed: boolean;
  isLoggedIn: boolean;
  userInfo: any;
  loading: boolean;
  userRole: UserRole | null;
}

/**
 * Hook untuk role-based route guard
 * Otomatis check role dan redirect sesuai hak akses
 */
export const useRoleBasedGuard = (): RouteGuardResult => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userInfo, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const userRole = userInfo?.role as UserRole | null;

  useEffect(() => {
    if (loading) return;

    const checkAccess = () => {
      // Check admin routes
      const isAdminRoute = ROLE_BASED_ROUTES.admin.some((route) =>
        pathname.startsWith(route)
      );

      if (isAdminRoute) {
        if (!isLoggedIn) {
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsAllowed(false);
        } else if (userRole !== "admin") {
          // User bukan admin, redirect berdasarkan role mereka
          redirectToRoleBasedDashboard(userRole);
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
        setIsChecking(false);
        return;
      }

      // Check salesman routes
      const isSalesmanRoute = ROLE_BASED_ROUTES.salesman.some((route) =>
        pathname.startsWith(route)
      );

      if (isSalesmanRoute) {
        if (!isLoggedIn) {
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsAllowed(false);
        } else if (userRole !== "salesman") {
          redirectToRoleBasedDashboard(userRole);
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
        setIsChecking(false);
        return;
      }

      // Check customer routes
      const isCustomerRoute = ROLE_BASED_ROUTES.customer.some((route) =>
        pathname.startsWith(route)
      );

      if (isCustomerRoute) {
        if (!isLoggedIn) {
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsAllowed(false);
        } else if (userRole !== "customer") {
          redirectToRoleBasedDashboard(userRole);
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
        setIsChecking(false);
        return;
      }

      // Check authenticated routes (any logged in user)
      const isAuthRoute = ROLE_BASED_ROUTES.authenticated.some((route) =>
        pathname.startsWith(route)
      );

      if (isAuthRoute) {
        if (!isLoggedIn) {
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
        setIsChecking(false);
        return;
      }

      // Check guest only routes
      const isGuestRoute = ROLE_BASED_ROUTES.guest.some((route) =>
        pathname.startsWith(route)
      );

      if (isGuestRoute) {
        if (isLoggedIn) {
          // Redirect ke dashboard sesuai role
          redirectToRoleBasedDashboard(userRole);
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
        setIsChecking(false);
        return;
      }

      // Public routes atau unknown routes
      setIsAllowed(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [pathname, isLoggedIn, userRole, loading, router]);

  /**
   * Helper function untuk redirect ke dashboard sesuai role
   */
  const redirectToRoleBasedDashboard = (role: UserRole | null) => {
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "salesman":
        router.push("/salesman/dashboard");
        break;
      case "customer":
        router.push("/customer/dashboard");
        break;
      default:
        router.push("/dashboard"); // Fallback
        break;
    }
  };

  return {
    isChecking,
    isAllowed,
    isLoggedIn,
    userInfo,
    loading,
    userRole,
  };
};

/**
 * Helper function untuk check apakah user punya akses ke route tertentu
 */
export const hasRoleAccess = (
  userRole: UserRole | null,
  pathname: string
): boolean => {
  if (!userRole) return false;

  // Check admin routes
  if (ROLE_BASED_ROUTES.admin.some((route) => pathname.startsWith(route))) {
    return userRole === "admin";
  }

  // Check salesman routes
  if (ROLE_BASED_ROUTES.salesman.some((route) => pathname.startsWith(route))) {
    return userRole === "salesman";
  }

  // Check customer routes
  if (ROLE_BASED_ROUTES.customer.some((route) => pathname.startsWith(route))) {
    return userRole === "customer";
  }

  // Authenticated routes - semua role bisa akses
  if (
    ROLE_BASED_ROUTES.authenticated.some((route) => pathname.startsWith(route))
  ) {
    return true;
  }

  // Public routes - semua bisa akses
  return true;
};

/**
 * Helper function untuk get redirect URL berdasarkan role
 */
export const getRoleDashboard = (role: UserRole | null): string => {
  switch (role) {
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

/**
 * Export route config untuk keperluan lain
 */
export { ROLE_BASED_ROUTES };
