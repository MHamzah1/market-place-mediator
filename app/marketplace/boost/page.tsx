import React, { Suspense } from "react";
import BoostListingPage from "@/components/view/Boost/BoostListingPage";

const BoostPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    }>
      <BoostListingPage />
    </Suspense>
  );
};

export default BoostPage;
