import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { getCurrentAdmin } from "../modules/auth/adminAuth";

export default function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    verifyAdmin();
  }, []);

  async function verifyAdmin() {
    try {
      const admin = await getCurrentAdmin();

      if (admin) {
        setAuthorized(true);
      }
    } catch (error) {
      console.error("Admin verification error:", error);

      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  // Checking session

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#FAF7F2]
        "
      >
        <div
          className="
            text-[#1F3D2A]
            font-serif
            text-lg
          "
        >
          Verifying administrator access...
        </div>
      </div>
    );
  }

  // No admin access

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  // Allowed

  return children;
}
