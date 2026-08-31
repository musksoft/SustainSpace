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
// import Admin from "./modules/admin/Admin";
// import AdminLayout from "./modules/admin/AdminLayout";
import AdminLogin from "./modules/auth/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./modules/admin/AdminDashboard";
import Transaction from "./modules/transaction/Transaction";
import BuyerTransaction from "./modules/transaction/BuyerTransaction";
import SellerTransaction from "./modules/transaction/SellerTransaction";
import Sales from "./modules/transaction/Sales";
import AdminUsers from "./modules/admin/AdminUsers";
import AdminListings from "./modules/admin/AdminListings";
import AdminListingDetails from "./modules/admin/AdminListingsDetails";
import AdminTransactionDetails from "./modules/admin/AdminTransactionDetails";
import AdminTransactions from "./modules/admin/AdminTransactions";
import SystemActivity from "./modules/admin/SystemActivity";
import Ratings from "./modules/listings/Reviews";
import BuyerOrders from "./modules/transaction/BuyerOrders";
import ReportListing from "./modules/listings/ReportListing";
import AdminReports from "./modules/admin/AdminReports";
import SellerVerification from "./modules/profile/SellerVerification";
import AdminVerifications from "./modules/admin/AdminVerification";
import AdminVerificationDetail from "./modules/admin/AdminVerificationDetails";
import SellerAuthTest from "./components/sellerauth";
import EditListing from "./modules/listings/EditListing";

function App() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log(event, session);

      if (session) {
        // console.log("Logged in");
      } else {
        // console.log("Logged out");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* navbar will not come in the admin route */}
      {!window.location.pathname.startsWith("/admin") && <Navbar />}

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
        <Route path="/seller/:id" element={<SellerDashboard />} />
        <Route path="/profile/:id" element={<SellerProfile />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        {/*Upload Listings Dashboard*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/listings" element={<UploadListing />} />
        </Route>
        <Route path="/listing/edit/:id" element={<EditListing />}/>
        {/*Buyr Dashboard*/}
        <Route path="/buyer/:id" element={<BuyerDashboard />} />
        <Route path="/message" element={<Messages />} />
        {/* Transaction Element */}
        <Route path="/transaction" element={<Transaction />} />
        {/* Transaction Buyer */}
        <Route path="/buyer-transaction" element={<BuyerTransaction />} />
        {/* Transaction Element */}
        <Route path="/seller-transaction" element={<SellerTransaction />} />
        {/* Buyer Order */}
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        {/* Sales  */}
        <Route path="/seller/sales" element={<Sales />} />
        {/* Admin Dashboard */}
        {/* <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Admin />} />
        </Route> */}
        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/listings" element={<AdminListings />} />
        <Route path="/admin/listings/:id" element={<AdminListingDetails />} />
        
        {/* PROTECTED ADMIN AREA */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/admin/users" element={<AdminUsers />} />
        {/* ADMIN TRANSACTIONS */}
        <Route
          path="/admin/transactions"
          element={
            <AdminProtectedRoute>
              <AdminTransactions />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions/:id"
          element={
            <AdminProtectedRoute>
              <AdminTransactionDetails />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/activity"
          element={
            <AdminProtectedRoute>
              <SystemActivity />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminProtectedRoute>
              <AdminReports />
            </AdminProtectedRoute>
          }
        />
        {/* RATE LISTINGS */}
        <Route path="/buyer/reviews" element={<Ratings />} />
        {/* REPORT LISTINGS */}
        <Route path="/report-listing" element={<ReportListing />} />
        {/* SELLER VERIFICATION */}
        <Route path="/seller-verification" element={<SellerVerification />} />
        {/* ADMIN VERIFICATION */}
        <Route path="/admin/verification" element={<AdminVerifications />} />
        <Route
          path="/admin/verifications/:id"
          element={<AdminVerificationDetail />}
        />
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/sustainspace" />} />
        {/* TEST */}
        <Route
          path="/SustainSpace/seller-auth-test"
          element={<SellerAuthTest />}
        />
      </Routes>
    </>
  );
}

export default App;
