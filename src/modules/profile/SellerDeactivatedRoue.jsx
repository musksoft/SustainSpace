import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import {
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function SellerDeactivatedRoute({
  children,
}) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [profile, setProfile] = useState(null);

  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkSeller = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) {
          setLoading(false);
          setAllowed(false);
        }

        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id,full_name,email,role,is_active,status"
        )
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (error) {
        console.error(
          "Error checking seller account:",
          error
        );

        setLoading(false);
        setAllowed(false);
        return;
      }

      setProfile(data);

      const isDeactivated =
        data?.is_active === false ||
        data?.status === "deactivated" ||
        data?.status === "suspended" ||
        data?.status === "banned";

      /*
       * Only seller accounts are handled here.
       */

      const isSeller =
        data?.role === "seller";

      if (!isSeller) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      /*
       * Seller is active.
       */

      if (!isDeactivated) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    };

    checkSeller();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1F3D2A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Checking seller account...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Not logged in.
   */

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  /*
   * Not a seller.
   */

  if (profile.role !== "seller") {
    return <Navigate to="/sustainspace" replace />;
  }

  /*
   * ACTIVE SELLER
   */

  if (allowed) {
    return children;
  }

  /*
   * DEACTIVATED SELLER
   *
   * Do not send them to another page.
   * Keep them inside the dashboard.
   */

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="bg-[#1F3D2A] text-white px-6 py-5">
        <h1 className="text-2xl font-semibold">
          Sustain
          <span className="text-[#D6A77A]">
            Space
          </span>
        </h1>
      </div>

      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white border-2 border-red-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-red-600 text-white px-6 py-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Seller Account Deactivated
              </h2>

              <p className="text-red-100 mt-1">
                This seller account cannot access this page.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex gap-3">
                <Lock
                  className="text-red-600 shrink-0"
                  size={22}
                />

                <div>
                  <h3 className="font-semibold text-red-800">
                    Access restricted
                  </h3>

                  <p className="text-sm text-red-700 mt-2">
                    Your seller account has been deactivated
                    by an administrator. Seller features and
                    seller management pages are currently
                    unavailable.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Restricted seller functions
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Create listings",
                  "Edit listings",
                  "Delete listings",
                  "Purchase requests",
                  "Seller orders",
                  "Seller transactions",
                  "Seller sales",
                  "Seller verification",
                  "Seller profile",
                  "Seller messages",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 border rounded-lg p-3 bg-gray-50"
                  >
                    <Lock
                      size={15}
                      className="text-red-500"
                    />

                    <span className="text-sm text-gray-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6 pt-5 border-t">
              If you believe this account was deactivated by
              mistake, please contact the administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
