import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/lib/state/redux-provider";
import RouteGuardWrapper from "@/components/guards/RouteGuardWrapper";
import { RoleGuardWrapper } from "@/components/guards/RoleGuard";
import { ThemeProvider } from "../context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarMediator - Marketplace Mobil Terpercaya",
  description:
    "Platform marketplace mobil dengan layanan inspeksi profesional dan kalkulator pembiayaan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* 👇 WRAP DENGAN ThemeProvider */}
        <ThemeProvider>
          <ReduxProvider>
            <RouteGuardWrapper>
              <RoleGuardWrapper>{children}</RoleGuardWrapper>
            </RouteGuardWrapper>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
