import React from "react";
import HeaderBeranda from "./section/header-beranda";
import FeaturedListingsSection from "@/components/view/Boost/FeaturedListingsSection";
import MarketingSection from "./section/marketing-section";
import JasaInspeksiSection from "./section/jasa-inspeksi-section";
import ReviewSection from "./section/review-section";

const DashboardBeranda = () => {
  return (
    <>
      <HeaderBeranda />
      <FeaturedListingsSection limit={6} showViewAll={true} />
      <MarketingSection />
      <JasaInspeksiSection />
      <ReviewSection />
    </>
  );
};

export default DashboardBeranda;
