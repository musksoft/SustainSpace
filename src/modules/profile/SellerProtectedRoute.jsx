import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function SellerProtectedRoute({
  children,
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [profile, setProfile] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const checkSeller = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, is_active")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(
          "Error checking seller:",
          error
        );

        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    checkSeller();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1F3D2A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Checking seller access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (profile?.role !== "seller") {
    return (
      <Navigate
        to="/sustainspace"
        replace
      />
    );
  }

  /*
   * Deactivated sellers cannot access any protected
   * seller functionality.
   *
   * The dashboard itself is NOT protected by this component
   * because we want the seller to see the deactivation warning.
   */

  if (profile?.is_active === false) {
    return (
      <Navigate
        to={`/seller/${profile.id}`}
        replace
        state={{
          sellerDeactivated: true,
        }}
      />
    );
  }

  return children || <Outlet />;
}
