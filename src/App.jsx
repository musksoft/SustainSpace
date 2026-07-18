import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import AuthPage from "./modules/auth/AuthPage";
import SellerDashboard from "./modules/profile/SellerDashboard";
import { supabase } from "./config/supabaseClient";
import BuyerDashboard from "./modules/profile/BuyerDashboard";
import UploadListing from "./modules/listings/UploadListing";
import ListingDetails from "./modules/listings/ListingsDetails";
import SellerProfile from "./modules/profile/SellerProfile";
import SellPage from "./shared/SellerPage";
import HomePage from "./shared/HomePage";
import ShopPage from "./shared/Shop";
import BuyerGuide from "./shared/BuyerGuide";
import SustainabilityPage from "./shared/Sustainability";
import Navbar from "./shared/Navbar";
import Messages from "./modules/messaging/Messages";
import Admin from "./modules/admin/Admin";
// import AdminLayout from "./modules/admin/AdminLayout";
import AdminDashboard from "./modules/admin/AdminDashboard";

function App() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (session) {
        console.log("Logged in");
      } else {
        console.log("Logged out");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sustainspace" element={<HomePage />} />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Seller Page */}
        <Route path="/sell" element={<SellPage />} />

        {/* Shop Page */}
        <Route path="/shop" element={<ShopPage />} />

        {/* Buyer Page */}
        <Route path="/buyer-guide" element={<BuyerGuide />} />

        {/* Sustainability Page */}
        <Route path="/sustainability" element={<SustainabilityPage />} />

        {/* Seller Dashboard */}
        <Route path="/seller/:id/:slug" element={<SellerDashboard />} />
        <Route path="/profile/:id" element={<SellerProfile />} />
        <Route path="/listing/:id" element={<ListingDetails />} />

        {/*Upload Listings Dashboard*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/listings" element={<UploadListing />} />
        </Route>{" "}

        {/*Buyr Dashboard*/}
        <Route path="/buyer/:id" element={<BuyerDashboard />} />
        <Route path="/message" element={<Messages />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />}>
  <Route index element={<Admin />} />
</Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/sustainspace" />} />
      </Routes>
    </>
  );
}

export default App;
