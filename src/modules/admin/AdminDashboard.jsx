
import { useEffect, useState } from "react";
import {
  Package,
  Flag,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  Eye,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import { supabase } from "../../config/supabaseClient"; // Change path if your Supabase client is elsewhere


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    listings: 0,
    listingsToday: 0,

    reports: 0,
    pendingReports: 0,

    transactions: 0,
    transactionsToday: 0,
    completedTransactions: 0,

    availableListings: 0,
    totalUsers: 0,

    pendingVerifications: 0,
  });

  const [verifications, setVerifications] = useState([]);
  const [reportedListings, setReportedListings] = useState([]);
  const [activities, setActivities] = useState([]);


  useEffect(() => {
    loadDashboard();
  }, []);


  /*
  ============================================================
  LOAD DASHBOARD
  ============================================================
  */

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const todayISO = today.toISOString();


      /*
      ----------------------------------------------------------
      FETCH EVERYTHING IN PARALLEL
      ----------------------------------------------------------
      */

      const [
        listingsResult,
        listingsTodayResult,

        reportsResult,
        pendingReportsResult,

        transactionsResult,
        transactionsTodayResult,
        completedTransactionsResult,

        availableListingsResult,
        profilesResult,

        verificationsResult,

        reportedListingsResult,

        activityResult,
      ] = await Promise.all([

        /*
        --------------------------------------------------------
        LISTINGS
        --------------------------------------------------------
        */

        supabase
          .from("listings")
          .select("id", {
            count: "exact",
            head: true,
          }),


        /*
        Listings created today
        */

        supabase
          .from("listings")
          .select("id", {
            count: "exact",
            head: true,
          })
          .gte("created_at", todayISO),


        /*
        --------------------------------------------------------
        REPORTS
        --------------------------------------------------------
        */

        supabase
          .from("reports")
          .select("id", {
            count: "exact",
            head: true,
          }),


        /*
        Reports requiring attention
        */

        supabase
          .from("reports")
          .select("id", {
            count: "exact",
            head: true,
          })
          .in("status", ["pending", "reviewing"]),


        /*
        --------------------------------------------------------
        TRANSACTIONS
        --------------------------------------------------------
        */

        supabase
          .from("transactions")
          .select("id", {
            count: "exact",
            head: true,
          }),


        /*
        Transactions created today
        */

        supabase
          .from("transactions")
          .select("id", {
            count: "exact",
            head: true,
          })
          .gte("created_at", todayISO),


        /*
        Completed transactions
        */

        supabase
          .from("transactions")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("status", "completed"),


        /*
        --------------------------------------------------------
        AVAILABLE LISTINGS
        --------------------------------------------------------
        */

        supabase
          .from("listings")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("status", "available"),


        /*
        --------------------------------------------------------
        TOTAL USERS
        --------------------------------------------------------
        */

        supabase
          .from("profiles")
          .select("id", {
            count: "exact",
            head: true,
          }),


        /*
        --------------------------------------------------------
        SELLER VERIFICATIONS
        --------------------------------------------------------
        */

        supabase
          .from("seller_verifications")
          .select(`
            id,
            seller_id,
            attempt_number,
            status,
            primary_document_path,
            secondary_document_path,
            rejection_reason,
            created_at,
            updated_at,

            profiles (
              id,
              full_name,
              email
            )
          `)
          .eq("status", "submitted")
          .order("created_at", {
            ascending: false,
          }),


        /*
        --------------------------------------------------------
        REPORTED LISTINGS
        --------------------------------------------------------
        */

        supabase
          .from("admin_reports")
          .select("*")
          .in("report_status", ["pending", "reviewing"])
          .order("report_created_at", {
            ascending: false,
          }),


        /*
        --------------------------------------------------------
        RECENT ACTIVITY
        --------------------------------------------------------
        */

        supabase
          .from("system_activity")
          .select(`
            id,
            user_id,
            admin_id,
            action,
            entity_type,
            entity_id,
            description,
            created_at
          `)
          .order("created_at", {
            ascending: false,
          })
          .limit(6),
      ]);


      /*
      ==========================================================
      CHECK FOR ERRORS
      ==========================================================
      */

      const results = [
        listingsResult,
        listingsTodayResult,

        reportsResult,
        pendingReportsResult,

        transactionsResult,
        transactionsTodayResult,
        completedTransactionsResult,

        availableListingsResult,
        profilesResult,

        verificationsResult,

        reportedListingsResult,

        activityResult,
      ];


      const failedResult = results.find(
        (result) => result.error
      );


      if (failedResult) {
        throw failedResult.error;
      }


      /*
      ==========================================================
      SET STATISTICS
      ==========================================================
      */

      setStats({
        listings:
          listingsResult.count || 0,

        listingsToday:
          listingsTodayResult.count || 0,


        reports:
          reportsResult.count || 0,

        pendingReports:
          pendingReportsResult.count || 0,


        transactions:
          transactionsResult.count || 0,

        transactionsToday:
          transactionsTodayResult.count || 0,

        completedTransactions:
          completedTransactionsResult.count || 0,


        availableListings:
          availableListingsResult.count || 0,


        totalUsers:
          profilesResult.count || 0,


        pendingVerifications:
          verificationsResult.data?.length || 0,
      });


      /*
      ==========================================================
      SET TABLE DATA
      ==========================================================
      */

      setVerifications(
        verificationsResult.data || []
      );


      setReportedListings(
        reportedListingsResult.data || []
      );


      setActivities(
        activityResult.data || []
      );

    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }


  /*
  ============================================================
  LOADING STATE
  ============================================================
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex">

        <AdminSidebar />

        <main className="flex-1 p-6">

          <div className="max-w-7xl mx-auto">

            <div className="animate-pulse space-y-6">

              <div className="h-10 bg-gray-200 rounded-xl w-64" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      h-36
                      bg-white
                      rounded-2xl
                      border
                      border-[#E8E2D8]
                    "
                  />
                ))}

              </div>


              <div
                className="
                  h-80
                  bg-white
                  rounded-2xl
                  border
                  border-[#E8E2D8]
                "
              />

            </div>

          </div>

        </main>

      </div>
    );
  }


  /*
  ============================================================
  ERROR STATE
  ============================================================
  */

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex">

        <AdminSidebar />

        <main className="flex-1 p-6">

          <div className="max-w-7xl mx-auto">

            <div
              className="
                bg-red-50
                border
                border-red-200
                rounded-2xl
                p-6
              "
            >

              <div className="flex items-center gap-3">

                <AlertTriangle
                  size={22}
                  className="text-red-500"
                />

                <div>

                  <h2 className="font-semibold text-red-700">
                    Dashboard could not load
                  </h2>

                  <p className="text-sm text-red-600 mt-1">
                    {error}
                  </p>

                </div>

              </div>


              <button
                onClick={loadDashboard}
                className="
                  mt-4
                  px-4
                  py-2
                  rounded-xl
                  bg-[#1F3D2A]
                  text-white
                  text-sm
                  hover:bg-[#294C37]
                "
              >
                Try Again
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }


  /*
  ============================================================
  MAIN DASHBOARD
  ============================================================
  */

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">

      <AdminSidebar />


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="flex-1 overflow-y-auto p-6">

        <div className="max-w-7xl mx-auto">


          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              mb-7
            "
          >

            <div>

              <h1
                className="
                  text-3xl
                  font-serif
                  font-semibold
                  text-[#1F3D2A]
                "
              >
                Admin Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Monitor users, listings and marketplace activity.
              </p>

            </div>


            <button
              onClick={loadDashboard}
              className="
                flex
                items-center
                gap-2
                bg-[#1F3D2A]
                text-white
                px-4
                py-2.5
                rounded-xl
                text-sm
                hover:bg-[#294C37]
                transition
              "
            >
              <Activity size={16} />

              Refresh Dashboard
            </button>

          </div>


          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
            "
          >

            <StatCard
              bg="bg-[#FFF6DA]"
              icon={
                <Package
                  size={22}
                  className="text-[#A06A00]"
                />
              }
              title="Listings"
              value={stats.listings}
              subtitle={`${stats.listingsToday} added today`}
            />


            <StatCard
              bg="bg-[#FFE9D9]"
              icon={
                <Flag
                  size={22}
                  className="text-[#8B5E3C]"
                />
              }
              title="Reports"
              value={stats.reports}
              subtitle={`${stats.pendingReports} need attention`}
            />


            <StatCard
              dark
              icon={
                <CheckCircle2
                  size={22}
                  className="text-green-200"
                />
              }
              title="Transactions"
              value={stats.transactions}
              subtitle={`${stats.transactionsToday} created today`}
            />

          </div>


          {/* ==================================================
              SELLER VERIFICATIONS
          ================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-[#E8E2D8]
              mt-6
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div
              className="
                px-6
                py-5
                bg-[#1F3D2A]
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-serif
                    text-[#FBE8D3]
                  "
                >
                  Pending Seller Verifications
                </h2>

                <p className="text-xs text-green-100 mt-1">
                  Review pending seller verification applications
                </p>

              </div>


              <span className="text-sm text-[#FBE8D3]">
                {stats.pendingVerifications} pending
              </span>

            </div>


            {/* EMPTY STATE */}

            {verifications.length === 0 ? (

              <div className="px-6 py-10 text-center">

                <CheckCircle2
                  size={32}
                  className="mx-auto text-green-600"
                />

                <p
                  className="
                    font-semibold
                    text-[#1F3D2A]
                    mt-3
                  "
                >
                  No pending verifications
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  All seller applications have been reviewed.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-[#E8E2D8]">

                {verifications.map(
                  (verification) => {

                    const seller =
                      verification.profiles;


                    return (
                      <div
                        key={verification.id}
                        className="
                          p-5
                          flex
                          flex-col
                          md:flex-row
                          md:items-center
                          gap-5
                          justify-between
                        "
                      >

                        {/* SELLER */}

                        <div
                          className="
                            flex
                            items-center
                            gap-4
                          "
                        >

                          <div
                            className="
                              w-10
                              h-10
                              rounded-full
                              bg-[#DCEBD8]
                              flex
                              items-center
                              justify-center
                              font-semibold
                              text-[#1F3D2A]
                            "
                          >
                            {seller?.full_name
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>


                          <div>

                            <p
                              className="
                                font-semibold
                                text-[#1F3D2A]
                              "
                            >
                              {seller?.full_name ||
                                "Unknown Seller"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {seller?.email ||
                                "No email"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Attempt{" "}
                              {verification.attempt_number}
                            </p>

                          </div>

                        </div>


                        {/* DOCUMENT */}

                        <div className="text-sm">

                          <p className="text-gray-500">
                            ID Proof
                          </p>

                          <p className="font-medium text-[#1F3D2A] mt-1">
                            {verification.primary_document_path
                              ? "Uploaded"
                              : "Missing"}
                          </p>

                        </div>


                        {/* STATUS */}

                        <div>

                          <span
                            className="
                              bg-[#FFF6DA]
                              text-[#A06A00]
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-semibold
                            "
                          >
                            Pending
                          </span>

                        </div>


                        {/* VIEW */}

                        <button
                          className="
                            px-4
                            py-2
                            rounded-xl
                            border
                            border-[#E8E2D8]
                            text-sm
                            hover:bg-[#FAF7F2]
                            transition
                          "
                        >
                          <Eye
                            size={15}
                            className="
                              inline
                              mr-1.5
                            "
                          />

                          View
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </section>


          {/* ==================================================
              REPORTED LISTINGS
          ================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-[#E8E2D8]
              mt-6
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div
              className="
                px-6
                py-5
                bg-[#1F3D2A]
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-serif
                    text-[#FBE8D3]
                  "
                >
                  Reported Listings
                </h2>

                <p className="text-xs text-green-100 mt-1">
                  Listings requiring moderator review
                </p>

              </div>


              <span className="text-sm text-[#FBE8D3]">
                {stats.pendingReports} open
              </span>

            </div>


            {/* EMPTY STATE */}

            {reportedListings.length === 0 ? (

              <div className="px-6 py-10 text-center">

                <ShieldCheck
                  size={32}
                  className="
                    mx-auto
                    text-green-600
                  "
                />

                <p
                  className="
                    font-semibold
                    text-[#1F3D2A]
                    mt-3
                  "
                >
                  No reports requiring attention
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Your marketplace is currently clear.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-[#E8E2D8]">

                {reportedListings
                  .slice(0, 5)
                  .map((report) => (

                    <div
                      key={report.report_id}
                      className="
                        p-5
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        justify-between
                        gap-5
                      "
                    >

                      {/* LISTING */}

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >

                        <img
                          src={
                            report.featured_image ||
                            "/placeholder.png"
                          }
                          alt=""
                          className="
                            w-20
                            h-20
                            rounded-xl
                            object-cover
                            bg-gray-100
                          "
                        />


                        <div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              flex-wrap
                            "
                          >

                            <h3
                              className="
                                font-semibold
                                text-[#1F3D2A]
                              "
                            >
                              {report.listing_title}
                            </h3>


                            <span
                              className={`
                                text-xs
                                px-2.5
                                py-1
                                rounded-full
                                font-semibold

                                ${
                                  report.priority === "High"
                                    ? "bg-[#FFE9D9] text-[#8B5E3C]"
                                    : report.priority === "Medium"
                                    ? "bg-[#FFF6DA] text-[#A06A00]"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}
                            >
                              {report.priority}
                            </span>

                          </div>


                          <p className="text-sm text-gray-500 mt-1">
                            {report.reason}
                          </p>


                          <p className="text-xs text-gray-400 mt-2">
                            Seller:{" "}
                            {report.seller_name ||
                              "Unknown Seller"}

                            {" • "}

                            {report.report_count || 0}

                            {" "}

                            {(report.report_count || 0) === 1
                              ? "Report"
                              : "Reports"}
                          </p>

                        </div>

                      </div>


                      {/* ACTION */}

                      <div className="flex gap-2">

                        <button
                          className="
                            px-4
                            py-2
                            rounded-xl
                            border
                            border-[#E8E2D8]
                            text-sm
                            hover:bg-[#FAF7F2]
                            transition
                          "
                        >
                          <Eye
                            size={15}
                            className="
                              inline
                              mr-1.5
                            "
                          />

                          Review
                        </button>


                        <button
                          className="
                            px-4
                            py-2
                            rounded-xl
                            bg-red-500
                            text-white
                            text-sm
                            hover:bg-red-600
                            transition
                          "
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </section>


          {/* ==================================================
              BOTTOM SECTION
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
              mt-6
            "
          >


            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <section
              className="
                lg:col-span-2
                bg-white
                rounded-2xl
                border
                border-[#E8E2D8]
                overflow-hidden
              "
            >

              <div
                className="
                  px-6
                  py-5
                  bg-[#1F3D2A]
                "
              >

                <h2
                  className="
                    text-xl
                    font-serif
                    text-[#FBE8D3]
                  "
                >
                  Recent Activity
                </h2>

                <p className="text-xs text-green-100 mt-1">
                  Latest marketplace events
                </p>

              </div>


              {activities.length === 0 ? (

                <div className="px-6 py-10 text-center">

                  <Activity
                    size={30}
                    className="
                      mx-auto
                      text-gray-400
                    "
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    No recent activity.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-[#E8E2D8]">

                  {activities.map(
                    (activity) => (

                      <div
                        key={activity.id}
                        className="
                          flex
                          justify-between
                          items-center
                          px-6
                          py-5
                          hover:bg-[#FAF7F2]
                          transition
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              w-9
                              h-9
                              rounded-full
                              bg-[#DCEBD8]
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <Activity
                              size={16}
                              className="
                                text-[#1F3D2A]
                              "
                            />

                          </div>


                          <div>

                            <h3
                              className="
                                font-semibold
                                text-[#1F3D2A]
                              "
                            >
                              {formatActivityAction(
                                activity.action
                              )}
                            </h3>


                            <p className="text-sm text-gray-500">
                              {activity.description ||
                                activity.entity_type}
                            </p>

                          </div>

                        </div>


                        <span
                          className="
                            text-xs
                            text-gray-400
                            whitespace-nowrap
                          "
                        >
                          {formatRelativeTime(
                            activity.created_at
                          )}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}


              <div
                className="
                  px-6
                  py-4
                  bg-[#FAF7F2]
                  text-sm
                  text-gray-500
                "
              >
                Showing latest{" "}
                {activities.length} activities
              </div>

            </section>


            {/* =================================================
                PLATFORM SNAPSHOT
            ================================================= */}

            <section
              className="
                bg-[#1F3D2A]
                text-white
                rounded-2xl
                p-6
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-serif
                    text-[#FBE8D3]
                  "
                >
                  Platform Snapshot
                </h2>

                <p className="text-sm text-green-100 mt-1">
                  Current marketplace overview
                </p>

              </div>


              <div className="space-y-4 mt-8">

                <SnapshotItem
                  icon={
                    <ShieldCheck size={18} />
                  }
                  label="Pending Verifications"
                  value={stats.pendingVerifications}
                />


                <SnapshotItem
                  icon={
                    <Flag size={18} />
                  }
                  label="Open Reports"
                  value={stats.pendingReports}
                />


                <SnapshotItem
                  icon={
                    <Package size={18} />
                  }
                  label="Available Listings"
                  value={stats.availableListings}
                />


                <SnapshotItem
                  icon={
                    <CheckCircle2 size={18} />
                  }
                  label="Completed Transactions"
                  value={stats.completedTransactions}
                />


                <SnapshotItem
                  icon={
                    <Users size={18} />
                  }
                  label="Registered Users"
                  value={stats.totalUsers}
                />

              </div>


              <div
                className="
                  mt-8
                  pt-5
                  border-t
                  border-white/10
                "
              >

                <div className="flex items-center gap-2">

                  <Clock
                    size={15}
                    className="text-[#FBE8D3]"
                  />

                  <p className="text-xs text-green-100">
                    Dashboard data is synced from Supabase.
                  </p>

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  title,
  value,
  subtitle,
  bg = "bg-white",
  dark = false,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-5
        transition
        hover:shadow-md

        ${
          dark
            ? "bg-[#1F3D2A] text-white border-[#1F3D2A]"
            : `${bg} border-[#E8E2D8]`
        }
      `}
    >

      <div className="flex items-center justify-between">
        {icon}
      </div>


      <h3
        className="
          text-3xl
          font-semibold
          mt-4
        "
      >
        {value}
      </h3>


      <p
        className={`
          text-sm
          font-medium
          mt-1

          ${
            dark
              ? "text-white"
              : "text-[#1F3D2A]"
          }
        `}
      >
        {title}
      </p>


      <p
        className={`
          text-xs
          mt-2

          ${
            dark
              ? "text-green-100"
              : "text-gray-500"
          }
        `}
      >
        {subtitle}
      </p>

    </div>
  );
}


/* ============================================================
   PLATFORM SNAPSHOT ITEM
============================================================ */

function SnapshotItem({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        bg-white/10
        rounded-xl
        p-4
        flex
        items-center
        justify-between
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <div className="text-[#FBE8D3]">
          {icon}
        </div>


        <p className="text-green-100 text-sm">
          {label}
        </p>

      </div>


      <h3 className="text-2xl font-semibold">
        {value}
      </h3>

    </div>
  );
}


/* ============================================================
   ACTIVITY ACTION FORMATTER
============================================================ */

function formatActivityAction(action) {
  if (!action) {
    return "Marketplace activity";
  }

  return action
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}


/* ============================================================
   RELATIVE TIME
============================================================ */

function formatRelativeTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );


  if (seconds < 60) {
    return "Just now";
  }


  const minutes = Math.floor(
    seconds / 60
  );


  if (minutes < 60) {
    return `${minutes} min ago`;
  }


  const hours = Math.floor(
    minutes / 60
  );


  if (hours < 24) {
    return `${hours} hr ago`;
  }


  const days = Math.floor(
    hours / 24
  );


  if (days < 7) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }


  return date.toLocaleDateString();
}

