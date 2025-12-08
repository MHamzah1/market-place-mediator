import React from "react";
import HeaderBeranda from "./section/header-beranda";
import SuperiorCarSection from "./section/superior-car-section";
import MarketingSection from "./section/marketing-section";
import JasaInspeksiSection from "./section/jasa-inspeksi-section";
import ReviewSection from "./section/review-section";

const DashboardBeranda = () => {
  return (
    <>
      <HeaderBeranda />
      <SuperiorCarSection />
      <MarketingSection />
      <JasaInspeksiSection />
      <ReviewSection />
    </>
  );
};

export default DashboardBeranda;
