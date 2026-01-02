import MainLayout from "@/components/layout/main-layout";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
