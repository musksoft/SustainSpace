import { useEffect, useState } from "react";
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  X,
  User,
  ShoppingBag,
  CalendarDays,
  ShieldOff,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import { supabase } from "../../config/supabaseClient";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [deactivatingSeller, setDeactivatingSeller] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // ==========================================================
  // LOAD REPORTS
  // ==========================================================

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Unable to verify administrator account.");
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, active")
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();

    if (adminError || !admin) {
      setErrorMessage("You do not have administrator access.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("admin_reports")
      .select("*")
      .order("report_created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error loading reports:", error);

      setErrorMessage(
        "Unable to load reports. Please try again.",
      );

      setLoading(false);
      return;
    }

    setReports(data || []);
    setLoading(false);
  }

  // ==========================================================
  // PRIORITY COLOR
  // ==========================================================

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-[#FFF1D8] text-[#A06A00]";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ==========================================================
  // STATUS COLOR
  // ==========================================================

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#FFF1D8] text-[#A06A00]";

      case "reviewing":
        return "bg-blue-100 text-blue-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      case "dismissed":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ==========================================================
  // STATUS LABEL
  // ==========================================================

  const statusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "reviewing":
        return "Under Review";

      case "resolved":
        return "Resolved";

      case "dismissed":
        return "Dismissed";

      default:
        return status;
    }
  };

  // ==========================================================
  // OPEN REPORT
  // ==========================================================

  function openReport(report) {
    setSelectedReport(report);
    setAdminNotes(report.admin_notes || "");
    setErrorMessage("");
    setSuccessMessage("");
  }

  // ==========================================================
  // CLOSE REPORT
  // ==========================================================

  function closeReport() {
    if (updating || deactivatingSeller) return;

    setSelectedReport(null);
    setAdminNotes("");
    setErrorMessage("");
    setSuccessMessage("");
  }

  // ==========================================================
  // UPDATE REPORT
  // ==========================================================

  async function updateReport(status) {
    if (!selectedReport) return;

    setUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "Unable to verify administrator account.",
      );

      setUpdating(false);
      return;
    }

    const { data: admin, error: adminError } =
      await supabase
        .from("admins")
        .select("id")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();

    if (adminError || !admin) {
      setErrorMessage(
        "Administrator account could not be verified.",
      );

      setUpdating(false);
      return;
    }

    const reviewedAt = new Date().toISOString();

    const { error } = await supabase
      .from("reports")
      .update({
        status,
        admin_notes: adminNotes.trim() || null,
        reviewed_by: admin.id,
        reviewed_at: reviewedAt,
      })
      .eq("id", selectedReport.report_id);

    if (error) {
      console.error("Error updating report:", error);

      setErrorMessage(
        "Unable to update this report.",
      );

      setUpdating(false);
      return;
    }

    setSuccessMessage(
      `Report marked as ${statusLabel(status)}.`,
    );

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.report_id === selectedReport.report_id
          ? {
              ...report,
              report_status: status,
              admin_notes:
                adminNotes.trim() || null,
              reviewer_id: admin.id,
              reviewed_at: reviewedAt,
            }
          : report,
      ),
    );

    setSelectedReport((current) => ({
      ...current,
      report_status: status,
      admin_notes: adminNotes.trim() || null,
      reviewer_id: admin.id,
      reviewed_at: reviewedAt,
    }));

    setUpdating(false);
  }

  // ==========================================================
  // DEACTIVATE SELLER
  // ==========================================================

  async function deactivateSeller() {
    if (!selectedReport?.seller_id) {
      setErrorMessage(
        "Seller information could not be found.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${selectedReport.seller_name || "this seller"}? This will deactivate the seller account.`,
    );

    if (!confirmed) return;

    setDeactivatingSeller(true);
    setErrorMessage("");
    setSuccessMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage(
        "Unable to verify administrator account.",
      );
      setDeactivatingSeller(false);
      return;
    }

    const { data: admin, error: adminError } =
      await supabase
        .from("admins")
        .select("id")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();

    if (adminError || !admin) {
      setErrorMessage(
        "Administrator account could not be verified.",
      );
      setDeactivatingSeller(false);
      return;
    }

    /*
     * Deactivate seller profile.
     *
     * This assumes profiles has an `active` boolean column.
     */

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        active: false,
      })
      .eq("id", selectedReport.seller_id);

    if (profileError) {
      console.error(
        "Error deactivating seller:",
        profileError,
      );

      setErrorMessage(
        "Unable to deactivate seller. Make sure the profiles table has an active column.",
      );

      setDeactivatingSeller(false);
      return;
    }

    /*
     * Deactivate seller's listings.
     *
     * We do not delete them.
     */

    const { error: listingError } = await supabase
      .from("listings")
      .update({
        status: "inactive",
      })
      .eq("seller_id", selectedReport.seller_id)
      .neq("status", "sold");

    if (listingError) {
      console.error(
        "Error deactivating seller listings:",
        listingError,
      );
    }

    /*
     * Add a note to the report.
     */

    const newNotes = [
      adminNotes.trim(),
      `Seller deactivated by administrator on ${new Date().toLocaleString()}.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error: reportError } = await supabase
      .from("reports")
      .update({
        admin_notes: newNotes || null,
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
        status: "resolved",
      })
      .eq("id", selectedReport.report_id);

    if (reportError) {
      console.error(
        "Error updating report after deactivation:",
        reportError,
      );
    }

    setAdminNotes(newNotes);

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.report_id === selectedReport.report_id
          ? {
              ...report,
              report_status: "resolved",
              admin_notes: newNotes,
              reviewer_id: admin.id,
              reviewed_at: new Date().toISOString(),
              listing_status: "inactive",
            }
          : report,
      ),
    );

    setSelectedReport((current) => ({
      ...current,
      report_status: "resolved",
      admin_notes: newNotes,
      listing_status: "inactive",
    }));

    setSuccessMessage(
      "Seller has been deactivated and the report was resolved.",
    );

    setDeactivatingSeller(false);
  }

  // ==========================================================
  // COUNTS
  // ==========================================================

  const pendingCount = reports.filter(
    (report) =>
      report.report_status === "pending",
  ).length;

  const highPriorityCount = reports.filter(
    (report) =>
      report.priority === "High",
  ).length;

  const totalReports = reports.reduce(
    (total, report) =>
      total + Number(report.report_count || 1),
    0,
  );

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[#8B5E3C] font-semibold tracking-wider text-sm">
                ADMIN PANEL
              </p>

              <h1 className="text-3xl font-serif text-[#1F3D2A] mt-1">
                Reported Listings
              </h1>

              <p className="text-gray-500 mt-1">
                Review listings reported by marketplace buyers.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E2D8] px-6 py-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#FCEDEE] text-red-600 flex items-center justify-center">
                <Flag size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Active Reports
                </p>

                <h2 className="text-2xl font-bold text-[#1F3D2A]">
                  {pendingCount}
                </h2>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* SUCCESS */}

          {successMessage && !selectedReport && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* SUMMARY */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Pending Review
                  </p>

                  <h3 className="text-3xl font-semibold text-[#1F3D2A] mt-2">
                    {pendingCount}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#FFF1D8] text-[#A06A00] flex items-center justify-center">
                  <Clock size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    High Priority
                  </p>

                  <h3 className="text-3xl font-semibold text-[#1F3D2A] mt-2">
                    {highPriorityCount}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </div>

            <div className="bg-[#1F3D2A] border border-[#1F3D2A] rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">
                    Total Reports
                  </p>

                  <h3 className="text-3xl font-semibold mt-2">
                    {totalReports}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Flag size={20} />
                </div>
              </div>
            </div>

          </div>

          {/* REPORT TABLE */}

          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D8] overflow-hidden">

            <div className="px-6 py-5 border-b bg-[#FCFAF7] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-[#1F3D2A]">
                  Listing Reports
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Listings requiring moderator attention.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Flag size={16} />
                {reports.length} reports
              </div>
            </div>

            {loading && (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-[#D8CEC4] border-t-[#1F3D2A] rounded-full animate-spin mx-auto mb-4" />
                Loading reports...
              </div>
            )}

            {!loading && reports.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F5F1EB] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2
                    size={25}
                    className="text-[#1F3D2A]"
                  />
                </div>

                <h3 className="font-semibold text-[#1F3D2A]">
                  No reports found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  There are currently no marketplace reports.
                </p>
              </div>
            )}

            {!loading && reports.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F5F1] border-b">
                    <tr className="text-left">

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Listing
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Buyer
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Seller
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Reason
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Reports
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Priority
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Reported
                      </th>

                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((report) => (
                      <tr
                        key={report.report_id}
                        className="border-b last:border-b-0 hover:bg-[#FAF7F2] transition"
                      >

                        <td className="px-6 py-5">
                          <div>
                            <h3 className="font-semibold text-[#1F3D2A]">
                              {report.listing_title}
                            </h3>

                            <p className="text-xs text-gray-400 mt-1">
                              {report.listing_category ||
                                "Marketplace listing"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium text-[#1F3D2A]">
                            {report.buyer_name ||
                              "Unknown buyer"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {report.buyer_email || "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium text-[#1F3D2A]">
                            {report.seller_name ||
                              "Unknown seller"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {report.seller_email || "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-700 max-w-[190px]">
                            {report.reason}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#1F3D2A]">
                            <Flag
                              size={15}
                              className="text-[#8B5E3C]"
                            />

                            {report.report_count}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${priorityColor(
                              report.priority,
                            )}`}
                          >
                            {report.priority}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor(
                              report.report_status,
                            )}`}
                          >
                            {statusLabel(
                              report.report_status,
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(
                            report.report_created_at,
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                openReport(report)
                              }
                              className="inline-flex items-center gap-2 bg-[#1F3D2A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#294C37] transition"
                            >
                              <Eye size={15} />
                              Review
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && reports.length > 0 && (
              <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8E2D8] flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {reports.length} reports
                </p>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-green-600"
                  />

                  <span className="text-sm text-gray-500">
                    Reports are reviewed by administrators
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ====================================================
          REPORT REVIEW MODAL
      ==================================================== */}

      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="px-7 py-5 border-b border-[#E8E2D8] flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold">
                  Report Review
                </p>

                <h2 className="text-2xl font-serif text-[#1F3D2A] mt-1">
                  {selectedReport.listing_title}
                </h2>
              </div>

              <button
                onClick={closeReport}
                disabled={
                  updating || deactivatingSeller
                }
                className="w-10 h-10 rounded-xl hover:bg-[#F5F1EB] flex items-center justify-center text-gray-500 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-7 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-7">

              {/* IMAGE */}

              <div>
                <img
                  src={
                    selectedReport.featured_image ||
                    selectedReport.gallery_images?.[0] ||
                    "https://placehold.co/400x300"
                  }
                  alt={selectedReport.listing_title}
                  className="w-full h-56 rounded-2xl object-cover border border-[#E8E2D8]"
                />

                <div className="mt-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${priorityColor(
                      selectedReport.priority,
                    )}`}
                  >
                    {selectedReport.priority} Priority
                  </span>
                </div>
              </div>

              {/* DETAILS */}

              <div>

                {/* LISTING INFORMATION */}

                <div className="bg-[#FAF7F2] rounded-2xl p-5">

                  <div className="flex items-center gap-2 text-[#1F3D2A] font-semibold">
                    <ShoppingBag size={17} />
                    Listing Information
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                    <div>
                      <p className="text-xs text-gray-400">
                        Listing
                      </p>

                      <p className="text-sm font-semibold text-[#1F3D2A] mt-1">
                        {selectedReport.listing_title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Category
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        {selectedReport.listing_category ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Price
                      </p>

                      <p className="text-sm font-semibold text-[#8B5E3C] mt-1">
                        €
                        {selectedReport.listing_price ??
                          selectedReport.agreed_price ??
                          "0"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Listing Status
                      </p>

                      <p className="text-sm text-gray-700 mt-1 capitalize">
                        {selectedReport.listing_status ||
                          "—"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* BUYER / SELLER */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  <div className="border border-[#E8E2D8] rounded-2xl p-5">

                    <div className="flex items-center gap-2 font-semibold text-[#1F3D2A]">
                      <User size={17} />
                      Buyer
                    </div>

                    <p className="font-medium text-[#1F3D2A] mt-4">
                      {selectedReport.buyer_name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {selectedReport.buyer_email}
                    </p>

                  </div>

                  <div className="border border-[#E8E2D8] rounded-2xl p-5">

                    <div className="flex items-center gap-2 font-semibold text-[#1F3D2A]">
                      <User size={17} />
                      Seller
                    </div>

                    <p className="font-medium text-[#1F3D2A] mt-4">
                      {selectedReport.seller_name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {selectedReport.seller_email}
                    </p>

                  </div>

                </div>

                {/* REPORT DETAILS */}

                <div className="border border-[#E8E2D8] rounded-2xl p-5 mt-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-400">
                        Report Reason
                      </p>

                      <h3 className="font-semibold text-[#1F3D2A] mt-1">
                        {selectedReport.reason}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor(
                        selectedReport.report_status,
                      )}`}
                    >
                      {statusLabel(
                        selectedReport.report_status,
                      )}
                    </span>

                  </div>

                  {selectedReport.description && (
                    <div className="mt-5">

                      <p className="text-xs text-gray-400">
                        Buyer's Description
                      </p>

                      <p className="text-sm text-gray-600 leading-relaxed mt-2 bg-[#FAF7F2] rounded-xl p-4">
                        {selectedReport.description}
                      </p>

                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
                    <CalendarDays size={14} />

                    Reported{" "}
                    {formatDate(
                      selectedReport.report_created_at,
                    )}
                  </div>

                </div>

                {/* ADMIN NOTES */}

                <div className="mt-5">

                  <label className="text-sm font-semibold text-[#1F3D2A]">
                    Admin Notes
                  </label>

                  <textarea
                    value={adminNotes}
                    onChange={(e) =>
                      setAdminNotes(e.target.value)
                    }
                    rows={4}
                    placeholder="Add internal notes about this report..."
                    disabled={
                      updating || deactivatingSeller
                    }
                    className="w-full mt-2 rounded-xl border border-[#DED8D1] bg-[#FCFBF9] p-4 text-sm text-gray-700 resize-none outline-none focus:border-[#1F3D2A] focus:ring-2 focus:ring-[#1F3D2A]/10 disabled:opacity-60"
                  />

                </div>

                {/* SUCCESS */}

                {successMessage && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                )}

                {/* ERROR */}

                {errorMessage && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                {/* ACTIONS */}

                <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-[#E8E2D8]">

                  {/* DEACTIVATE SELLER */}

                  <button
                    onClick={deactivateSeller}
                    disabled={
                      updating ||
                      deactivatingSeller ||
                      selectedReport.listing_status ===
                        "inactive"
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShieldOff size={16} />

                    {deactivatingSeller
                      ? "Deactivating..."
                      : selectedReport.listing_status ===
                          "inactive"
                        ? "Seller Deactivated"
                        : "Deactivate Seller"}
                  </button>

                  <button
                    onClick={() =>
                      updateReport("dismissed")
                    }
                    disabled={
                      updating ||
                      deactivatingSeller
                    }
                    className="px-5 py-2.5 rounded-xl border border-[#D8CEC4] text-gray-600 text-sm font-medium hover:bg-[#F8F5F1] disabled:opacity-50"
                  >
                    Dismiss
                  </button>

                  <button
                    onClick={() =>
                      updateReport("reviewing")
                    }
                    disabled={
                      updating ||
                      deactivatingSeller
                    }
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Mark Under Review
                  </button>

                  <button
                    onClick={() =>
                      updateReport("resolved")
                    }
                    disabled={
                      updating ||
                      deactivatingSeller
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#1F3D2A] text-white text-sm font-semibold hover:bg-[#294C37] disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Resolve Report
                    </span>
                  </button>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}