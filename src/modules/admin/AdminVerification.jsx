import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function AdminVerification() {
  const navigate = useNavigate();

  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
  }, []);

  async function loadVerifications() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, active")
      .eq("user_id", user.id)
      .eq("active", true)
      .single();

    if (adminError || !admin) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("seller_verifications")
      .select(`
        *,
        seller:profiles!seller_verifications_seller_id_fkey(
          id,
          full_name,
          email,
          is_verified_seller
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Verification loading error:", error);
      setLoading(false);
      return;
    }

    setVerifications(data || []);
    setLoading(false);
  }

  const statusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-amber-100 text-amber-700";

      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "submitted":
        return "Under Review";

      case "approved":
        return "Approved";

      case "rejected":
        return "Rejected";

      default:
        return status;
    }
  };

  return (
  <div className="min-h-screen bg-[#F8F6F2]">
    <div className="flex">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 p-5 md:p-8 ">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[#8B5E3C] font-semibold tracking-wider text-sm">
                ADMIN PANEL
              </p>

              <h1 className="text-3xl font-serif text-[#1F3D2A]">
                Seller Verification
              </h1>

              <p className="text-gray-500 mt-1">
                Review seller identity documents and manage verification
                requests.
              </p>
            </div>

            <div className="bg-white rounded-xl border px-5 py-3">
              <p className="text-xs text-gray-500">
                Total Requests
              </p>

              <h2 className="text-2xl font-bold text-[#1F3D2A]">
                {verifications.length}
              </h2>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Clock className="text-amber-600" size={20} />

                <div>
                  <p className="text-xs text-gray-500">
                    Pending
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {
                      verifications.filter(
                        (item) => item.status === "submitted"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="text-green-600"
                  size={20}
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Approved
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {
                      verifications.filter(
                        (item) => item.status === "approved"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <XCircle
                  className="text-red-600"
                  size={20}
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Rejected
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {
                      verifications.filter(
                        (item) => item.status === "rejected"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading verification requests...
              </div>
            ) : verifications.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No verification requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F5F1] border-b">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-sm font-semibold">
                        Seller
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold">
                        Attempt
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold">
                        Documents
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold">
                        Submitted
                      </th>

                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Review
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {verifications.map((verification) => (
                      <tr
                        key={verification.id}
                        className="
                          border-b
                          hover:bg-[#FAF7F2]
                          transition
                        "
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#1F3D2A]">
                            {verification.seller?.full_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {verification.seller?.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-medium">
                            #{verification.attempt_number}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText
                              size={16}
                              className="text-[#8B5E3C]"
                            />

                            {verification.secondary_document_path
                              ? "2 documents"
                              : "1 document"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-medium
                              ${statusColor(verification.status)}
                            `}
                          >
                            {statusLabel(verification.status)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {new Date(
                            verification.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/verifications/${verification.id}`
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              bg-[#1F3D2A]
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              hover:bg-[#294C37]
                              transition
                            "
                          >
                            <Eye size={16} />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
);
}