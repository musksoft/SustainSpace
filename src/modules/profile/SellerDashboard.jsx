import { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import ListingCard from "../listings/ListingsCard";
import {
  PlusCircle,
  Bell,
  Menu,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import PurchaseRequests from "../transaction/PurchaseRequests";
import Orders from "../transaction/Orders";

export default function SellerDashboard() {
  const [profile, setProfile] = useState(null);

  const [listings, setListings] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [soldListings, setSoldListings] = useState([]);
  const [completedTransactions, setCompletedTransactions] =
    useState([]);

  // Seller verification
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] =
    useState(true);

  // Seller account status
  const [isDeactivated, setIsDeactivated] = useState(false);

  // Dynamic dashboard stats
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [completedSales, setCompletedSales] = useState(0);

  // Load more controls
  const [visiblePurchaseHistory, setVisiblePurchaseHistory] =
    useState(3);

  const [visibleOrders, setVisibleOrders] = useState(3);

  const [visibleActiveListings, setVisibleActiveListings] =
    useState(3);

  const [visibleSoldListings, setVisibleSoldListings] =
    useState(3);

  const [
    visibleCompletedTransactions,
    setVisibleCompletedTransactions,
  ] = useState(3);

  const badgeSalesRequired = 5;

  const navigate = useNavigate();

  // ============================================================
  // LOAD SELLER VERIFICATION
  // ============================================================

  const loadSellerVerification = async (sellerId) => {
    setVerificationLoading(true);

    const { data, error } = await supabase
      .from("seller_verifications")
      .select(
        "id,status,attempt_number,created_at",
      )
      .eq("seller_id", sellerId)
      .eq("status", "approved")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Error loading seller verification:",
        error,
      );

      setIsVerified(false);
      setVerificationLoading(false);
      return;
    }

    setIsVerified(!!data);
    setVerificationLoading(false);
  };

  // ============================================================
  // LOAD ORDERS
  // ============================================================
  //
  // IMPORTANT:
  //
  // The seller does NOT create the transaction.
  //
  // The buyer creates the transaction.
  //
  // We simply load the transaction connected to the order.
  //
  // pending    -> Continue Transaction
  // completed  -> Completed
  // no record  -> Waiting for buyer
  //
  // ============================================================

  const loadOrders = async (sellerId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        buyer:profiles!orders_buyer_id_fkey(
          full_name,
          email
        ),
        listings(
          id,
          title,
          featured_image,
          status
        ),
        transactions(
          id,
          order_id,
          buyer_id,
          seller_id,
          delivery_method,
          payment_method,
          pickup_date,
          pickup_location,
          verification_code,
          status,
          created_at
        )
        `,
      )
      .eq("seller_id", sellerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error loading orders:",
        error,
      );

      return;
    }

    console.log(
      "Seller orders with transactions:",
      data,
    );

    setOrders(data || []);
  };

  // ============================================================
  // LOAD PURCHASE REQUESTS
  // ============================================================

  const loadPurchaseRequests = async (sellerId) => {
    const { data, error } = await supabase
      .from("purchase_requests")
      .select(
        `
        *,
        listings(*),
        buyer:profiles!purchase_requests_buyer_id_fkey(
          full_name,
          email
        ),
        orders(id)
        `,
      )
      .eq("seller_id", sellerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error loading purchase requests:",
        error,
      );

      return;
    }

    setPurchaseRequests(data || []);
  };

  // ============================================================
  // LOAD LISTINGS
  // ============================================================

  const loadListings = async (sellerId) => {
    /*
     * Find completed transactions.
     *
     * These listings should be marked as sold.
     */

    const {
      data: completedTransactionData,
      error: transactionError,
    } = await supabase
      .from("transactions")
      .select(
        `
        order_id,
        orders(
          listing_id
        )
        `,
      )
      .eq("seller_id", sellerId)
      .eq("status", "completed");

    if (transactionError) {
      console.error(
        "Error loading completed transaction listing IDs:",
        transactionError,
      );
    }

    const soldListingIds =
      completedTransactionData
        ?.map(
          (transaction) =>
            transaction.orders?.listing_id,
        )
        .filter(Boolean) || [];

    /*
     * Mark completed listings as sold.
     */

    if (soldListingIds.length > 0) {
      const { error: updateError } = await supabase
        .from("listings")
        .update({
          status: "sold",
        })
        .in("id", soldListingIds);

      if (updateError) {
        console.error(
          "Error marking listings as sold:",
          updateError,
        );
      }
    }

    /*
     * Active listings
     */

    const {
      data: activeData,
      error: activeError,
    } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", sellerId)
      .neq("status", "sold")
      .order("created_at", {
        ascending: false,
      });

    if (activeError) {
      console.error(
        "Error loading active listings:",
        activeError,
      );

      return;
    }

    /*
     * Sold listings
     */

    const {
      data: soldData,
      error: soldError,
    } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("status", "sold")
      .order("created_at", {
        ascending: false,
      });

    if (soldError) {
      console.error(
        "Error loading sold listings:",
        soldError,
      );

      return;
    }

    setListings(activeData || []);
    setSoldListings(soldData || []);
  };

  // ============================================================
  // LOAD COMPLETED TRANSACTIONS
  // ============================================================

  const loadCompletedTransactions = async (sellerId) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        buyer:profiles!transactions_buyer_id_fkey(
          full_name,
          email
        ),
        orders(
          id,
          title,
          agreed_price,
          listings(
            gallery_images
          )
        )
        `,
      )
      .eq("seller_id", sellerId)
      .eq("status", "completed")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error loading completed transactions:",
        error,
      );

      return;
    }

    setCompletedTransactions(data || []);
  };

  // ============================================================
  // LOAD SELLER STATS
  // ============================================================

  const loadSellerStats = async (sellerId) => {
    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id,
        created_at,
        orders(
          agreed_price
        )
        `,
      )
      .eq("seller_id", sellerId)
      .eq("status", "completed");

    if (error) {
      console.error(
        "Error loading seller stats:",
        error,
      );

      return;
    }

    const transactions = data || [];

    /*
     * Total completed sales
     */

    setCompletedSales(
      transactions.length,
    );

    /*
     * Monthly revenue
     */

    const monthlyTransactions =
      transactions.filter(
        (transaction) => {
          if (!transaction.created_at) {
            return false;
          }

          return (
            new Date(
              transaction.created_at,
            ) >= startOfMonth
          );
        },
      );

    const revenue =
      monthlyTransactions.reduce(
        (total, transaction) => {
          return (
            total +
            Number(
              transaction.orders
                ?.agreed_price || 0,
            )
          );
        },
        0,
      );

    setMonthlyRevenue(revenue);
  };

  // ============================================================
  // LOAD EVERYTHING
  // ============================================================

  const loadDashboard = async (sellerId) => {
    await loadPurchaseRequests(sellerId);
    await loadOrders(sellerId);
    await loadCompletedTransactions(
      sellerId,
    );
    await loadListings(sellerId);
    await loadSellerStats(sellerId);
    await loadSellerVerification(
      sellerId,
    );
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(data);

        setIsDeactivated(
          data.active === false,
        );

        if (data.active === false) {
          return;
        }
      } else {
        console.error(
          "Error loading profile:",
          error,
        );
      }

      await loadDashboard(user.id);
    };

    loadProfile();
  }, [navigate]);

  // ============================================================
  // ACCEPT PURCHASE REQUEST
  // ============================================================

  const acceptRequest = async (
    requestId,
    listingId,
  ) => {
    if (
      !profile?.id ||
      isDeactivated
    ) {
      return;
    }

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("purchase_requests")
      .select("id")
      .eq("listing_id", listingId)
      .eq("status", "accepted")
      .maybeSingle();

    if (existingError) {
      console.error(
        existingError,
      );
      return;
    }

    if (existing) {
      alert(
        "A buyer has already been accepted.",
      );

      return;
    }

    const {
      error: requestError,
    } = await supabase
      .from("purchase_requests")
      .update({
        status: "accepted",
      })
      .eq("id", requestId);

    if (requestError) {
      console.error(
        "Failed to accept request:",
        requestError,
      );

      return;
    }

    const {
      data,
      error: listingError,
    } = await supabase
      .from("listings")
      .update({
        status: "reserved",
      })
      .eq("id", listingId)
      .select();

    console.log(
      "Updated listing:",
      data,
    );

    if (listingError) {
      console.error(
        "Listing update failed:",
        listingError,
      );

      return;
    }

    await loadDashboard(
      profile.id,
    );
  };

  // ============================================================
  // CREATE ORDER
  // ============================================================
  //
  // Seller creates ONLY the order.
  //
  // Buyer will later create the transaction.
  //
  // ============================================================

  const createOrder = async (
    request,
  ) => {
    if (
      !profile?.id ||
      isDeactivated
    ) {
      return;
    }

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("orders")
      .select("id")
      .eq(
        "listing_id",
        request.listing_id,
      )
      .maybeSingle();

    if (existingError) {
      console.error(
        existingError,
      );
      return;
    }

    if (existing) {
      alert(
        "Order already exists.",
      );
      return;
    }

    const {
      data: newOrder,
      error,
    } = await supabase
      .from("orders")
      .insert({
        purchase_request_id:
          request.id,
        listing_id:
          request.listing_id,
        buyer_id:
          request.buyer_id,
        seller_id:
          request.seller_id,
        title:
          request.listings.title,
        image_url:
          request.listings
            .featured_image,
        agreed_price:
          request.agreed_price ??
          request.listings.price,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating order:",
        error,
      );

      return;
    }

    console.log(
      "Created order:",
      newOrder,
    );

    /*
     * IMPORTANT:
     *
     * Do NOT create a transaction here.
     *
     * The buyer creates the transaction.
     */

    const {
      error: requestUpdateError,
    } = await supabase
      .from("purchase_requests")
      .update({
        status: "completed",
      })
      .eq(
        "id",
        request.id,
      );

    if (requestUpdateError) {
      console.error(
        "Error updating purchase request:",
        requestUpdateError,
      );
    }

    await loadDashboard(
      profile.id,
    );

    alert(
      "Order created successfully. Waiting for buyer to create the transaction.",
    );
  };

  // ============================================================
  // CANCEL PURCHASE REQUEST
  // ============================================================

  const cancelRequest = async (
    requestId,
  ) => {
    if (
      !profile?.id ||
      isDeactivated
    ) {
      return;
    }

    const {
      data: request,
      error: requestError,
    } = await supabase
      .from("purchase_requests")
      .select(
        "listing_id,status",
      )
      .eq(
        "id",
        requestId,
      )
      .single();

    if (requestError) {
      console.error(
        requestError,
      );
      return;
    }

    if (!request) return;

    const {
      error: cancelError,
    } = await supabase
      .from("purchase_requests")
      .update({
        status: "cancelled",
      })
      .eq(
        "id",
        requestId,
      );

    if (cancelError) {
      console.error(
        cancelError,
      );

      return;
    }

    if (
      request.status ===
      "accepted"
    ) {
      const {
        error: listingError,
      } = await supabase
        .from("listings")
        .update({
          status: "available",
        })
        .eq(
          "id",
          request.listing_id,
        );

      if (listingError) {
        console.error(
          listingError,
        );
      }
    }

    await loadDashboard(
      profile.id,
    );
  };

  // ============================================================
  // CHECK ORDER TRANSACTION STATUS
  // ============================================================
  //
  // This is the main part of the new logic.
  //
  // transaction.status === "pending"
  //     -> Continue Transaction
  //
  // transaction.status === "completed"
  //     -> Completed
  //
  // no transaction
  //     -> Waiting for Buyer
  //
  // ============================================================

  const getOrderTransaction = (
    order,
  ) => {
    if (
      !order?.transactions
    ) {
      return null;
    }

    /*
     * Supabase can return either:
     *
     * []      -> array
     * object  -> single relation
     *
     * Handle both.
     */

    if (
      Array.isArray(
        order.transactions,
      )
    ) {
      if (
        order.transactions.length ===
        0
      ) {
        return null;
      }

      /*
       * Prefer the latest transaction.
       */

      return [
        ...order.transactions,
      ].sort(
        (a, b) =>
          new Date(
            b.created_at || 0,
          ) -
          new Date(
            a.created_at || 0,
          ),
      )[0];
    }

    return order.transactions;
  };

  // ============================================================
  // CONTINUE SELLER TRANSACTION
  // ============================================================

  const continueTransaction = (
    order,
  ) => {
    const transaction =
      getOrderTransaction(
        order,
      );

    if (!transaction) {
      alert(
        "The buyer has not created a transaction yet.",
      );

      return;
    }

    if (
      transaction.status !==
      "pending"
    ) {
      return;
    }

    /*
     * Navigate to seller transaction page.
     *
     * Pass the order/transaction ID
     * so the seller transaction page
     * can load the correct transaction.
     */

    navigate(
      `/seller-transaction?orderId=${order.id}&transactionId=${transaction.id}`,
    );
  };

  // ============================================================
  // BADGE PROGRESS
  // ============================================================

  const badgeProgress = Math.min(
    (completedSales /
      badgeSalesRequired) *
      100,
    100,
  );

  const salesRemaining = Math.max(
    badgeSalesRequired -
      completedSales,
    0,
  );

  // ============================================================
  // PURCHASE REQUESTS TO DISPLAY
  // ============================================================

  const pendingRequests =
    purchaseRequests.filter(
      (request) =>
        request.status ===
          "pending" &&
        request.listings?.status ===
          "available",
    );

  const requestHistory =
    purchaseRequests.filter(
      (request) =>
        request.status !==
        "pending",
    );

  const visibleRequestHistory =
    requestHistory.slice(
      0,
      visiblePurchaseHistory,
    );

  const requestsToDisplay = [
    ...pendingRequests,
    ...visibleRequestHistory,
  ];

  const hasMoreRequestHistory =
    visiblePurchaseHistory <
    requestHistory.length;

  // ============================================================
  // VISIBLE ORDERS
  // ============================================================

  const displayedOrders =
    orders.slice(
      0,
      visibleOrders,
    );

  const hasMoreOrders =
    visibleOrders <
    orders.length;

  // ============================================================
  // VISIBLE ACTIVE LISTINGS
  // ============================================================

  const displayedActiveListings =
    listings.slice(
      0,
      visibleActiveListings,
    );

  const hasMoreActiveListings =
    visibleActiveListings <
    listings.length;

  // ============================================================
  // VISIBLE SOLD LISTINGS
  // ============================================================

  const displayedSoldListings =
    soldListings.slice(
      0,
      visibleSoldListings,
    );

  const hasMoreSoldListings =
    visibleSoldListings <
    soldListings.length;

  // ============================================================
  // VISIBLE COMPLETED TRANSACTIONS
  // ============================================================

  const displayedCompletedTransactions =
    completedTransactions.slice(
      0,
      visibleCompletedTransactions,
    );

  const hasMoreCompletedTransactions =
    visibleCompletedTransactions <
    completedTransactions.length;

  // ============================================================
  // LOADING PROFILE
  // ============================================================

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F2]">
      {/* SIDEBAR */}

      <SellerSidebar
        isDeactivated={
          isDeactivated
        }
      />

      {/* MOBILE HEADER */}

      <div className="md:hidden bg-[#FAF7F2] border-b px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          disabled={
            isDeactivated
          }
          className={
            isDeactivated
              ? "opacity-40 cursor-not-allowed"
              : ""
          }
        >
          <Menu />
        </button>

        <h1 className="text-2xl font-serif font-semibold text-[#1F3D2A]">
          Sustain
          <span className="text-[#8B5E3C]">
            Space
          </span>
        </h1>

        <div className="w-8 h-8 rounded-full border flex items-center justify-center">
          {profile?.full_name?.charAt(
            0,
          ) || "U"}
        </div>
      </div>

      {/* ========================================================
          DEACTIVATED SELLER CONTENT
      ======================================================== */}

      {isDeactivated ? (
        <main className="flex-1 flex flex-col">
          <header className="hidden md:flex bg-[#1F3D2A] text-white px-8 py-5 items-center justify-between">
            <div>
              <p className="font-playfair italic text-lg text-[#FFF9F3]">
                SustainSpace
              </p>

              <h1 className="text-2xl font-semibold">
                Seller Profile
              </h1>
            </div>
          </header>

          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-[#1F3D2A] text-white px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-2xl font-semibold">
                      {profile?.full_name?.charAt(
                        0,
                      ) || "U"}
                    </div>

                    <div>
                      <h1 className="text-2xl font-semibold">
                        {profile?.full_name ||
                          "User"}
                      </h1>

                      <p className="text-white/70 text-sm mt-1">
                        Seller Profile
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1F3D2A]">
                      Your Profile
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Your seller account information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Full Name
                      </p>

                      <p className="font-medium text-gray-800">
                        {profile?.full_name ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="bg-[#FAF7F2] rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Email
                      </p>

                      <p className="font-medium text-gray-800 break-words">
                        {profile?.email ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="border border-red-200 bg-red-50 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <ShieldCheck
                          size={20}
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-red-700">
                          Seller Account Deactivated
                        </h3>

                        <p className="text-sm text-red-600 mt-1 leading-relaxed">
                          Your seller account has
                          been deactivated. You can
                          still view your profile and
                          log out, but all seller
                          dashboard features are
                          currently unavailable.
                        </p>

                        <p className="text-sm text-red-600 mt-3">
                          You cannot add listings,
                          manage purchase requests,
                          create orders, access seller
                          sections, or perform seller
                          actions while your account is
                          deactivated.
                        </p>

                        <p className="text-sm text-red-600 mt-3">
                          Please contact support if you
                          believe this was done by
                          mistake.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ========================================================
           NORMAL ACTIVE SELLER DASHBOARD
        ======================================================== */

        <main className="flex-1 flex flex-col">
          {/* TOP BAR */}

          <header className="hidden md:flex bg-[#1F3D2A] text-white px-8 py-5 items-center justify-between">
            <div>
              <p className="font-playfair italic text-lg text-[#FFF9F3]">
                Ready to rehome your furniture,
              </p>

              <h1 className="text-2xl font-semibold">
                {profile?.full_name ||
                  "User"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Bell size={20} />
            </div>
          </header>

          {/* CONTENT */}

          <div className="p-8 overflow-y-auto space-y-8">
            {/* HEADER SECTION */}

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#8B5E3C]">
                SELLER DASHBOARD
              </h2>

              <button
                onClick={() =>
                  navigate(
                    "/listings",
                  )
                }
                className="flex items-center gap-2 bg-[#1F3D2A] text-white px-3 md:px-4 py-2 rounded-lg"
              >
                <PlusCircle
                  size={18}
                />

                <span className="hidden md:block">
                  Add new item
                </span>
              </button>
            </div>

            {/* ==================================================
                DYNAMIC STATS
            ================================================== */}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {/* MONTHLY REVENUE */}

              <div className="bg-white p-4 rounded-xl border">
                <p className="text-sm text-gray-500">
                  Monthly Revenue
                </p>

                <h3 className="text-xl font-semibold">
                  €
                  {monthlyRevenue.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Completed sales this month
                </p>
              </div>

              {/* ACTIVE ITEMS */}

              <div className="bg-white p-4 rounded-xl border">
                <p className="text-sm text-gray-500">
                  Active Items
                </p>

                <h3 className="text-xl font-semibold">
                  {listings.length}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Currently listed
                </p>
              </div>

              {/* VERIFIED SELLER */}

              <div className="bg-white p-4 rounded-xl border col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Verified Seller Badge
                  </p>

                  {isVerified && (
                    <ShieldCheck
                      size={22}
                      className="text-green-600"
                    />
                  )}
                </div>

                <div className="mt-2 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#1F3D2A] rounded-full transition-all duration-500"
                    style={{
                      width: `${badgeProgress}%`,
                    }}
                  />
                </div>

                {verificationLoading ? (
                  <p className="text-xs text-gray-400 mt-1">
                    Checking verification...
                  </p>
                ) : isVerified ? (
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1 font-medium">
                    <ShieldCheck
                      size={14}
                    />

                    <span>
                      Verified seller
                    </span>
                  </div>
                ) : completedSales >=
                  badgeSalesRequired ? (
                  <p className="text-xs text-[#8B5E3C] mt-1 font-medium">
                    Eligible for verification
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    {salesRemaining} more
                    sale
                    {salesRemaining !==
                    1
                      ? "s"
                      : ""}{" "}
                    to earn badge
                  </p>
                )}
              </div>
            </div>

            {/* ==================================================
                PURCHASE REQUESTS
            ================================================== */}

            <PurchaseRequests
              requests={
                requestsToDisplay
              }
              onAccept={
                acceptRequest
              }
              onCancel={
                cancelRequest
              }
              onCreateOrder={
                createOrder
              }
            />

            {hasMoreRequestHistory && (
              <div className="flex justify-center -mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setVisiblePurchaseHistory(
                      (previous) =>
                        previous + 3,
                    )
                  }
                  className="px-5 py-2 rounded-lg border border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-white transition text-sm font-medium"
                >
                  Load more
                </button>
              </div>
            )}

            {/* ==================================================
                ORDERS
            ================================================== */}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Orders
                </h3>

                <span className="text-sm text-gray-500">
                  {orders.length}{" "}
                  order
                  {orders.length !==
                  1
                    ? "s"
                    : ""}
                </span>
              </div>

              {displayedOrders.length ===
              0 ? (
                <div className="bg-white border rounded-xl p-6 text-center">
                  <p className="text-gray-500">
                    No orders found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedOrders.map(
                    (order) => {
                      const transaction =
                        getOrderTransaction(
                          order,
                        );

                      const transactionStatus =
                        transaction?.status ||
                        null;

                      /*
                       * Pending transaction
                       */

                      const isPending =
                        transactionStatus ===
                        "pending";

                      /*
                       * Completed transaction
                       */

                      const isCompleted =
                        transactionStatus ===
                        "completed";

                      /*
                       * No transaction
                       */

                      const waitingForBuyer =
                        !transaction;

                      return (
                        <div
                          key={
                            order.id
                          }
                          className="bg-white border rounded-xl p-5 shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* ORDER INFORMATION */}

                            <div className="flex gap-4">
                              {order.image_url ||
                              order.listings
                                ?.featured_image ? (
                                <img
                                  src={
                                    order.image_url ||
                                    order
                                      .listings
                                      ?.featured_image
                                  }
                                  alt={
                                    order.title ||
                                    order
                                      .listings
                                      ?.title ||
                                    "Order"
                                  }
                                  className="w-24 h-24 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                  No image
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {order.title ||
                                    order
                                      .listings
                                      ?.title ||
                                    "Order"}
                                </h4>

                                <p className="text-sm text-gray-500 mt-1">
                                  Buyer:{" "}
                                  {order
                                    .buyer
                                    ?.full_name ||
                                    "Unknown"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Price: €
                                  {Number(
                                    order.agreed_price ||
                                      0,
                                  ).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                                </p>

                                <p className="text-xs text-gray-400 mt-2">
                                  Order ID:{" "}
                                  {order.id}
                                </p>
                              </div>
                            </div>

                            {/* TRANSACTION STATUS */}

                            <div className="flex flex-col items-start md:items-end gap-2">
                              {/* BUYER HAS NOT CREATED TRANSACTION */}

                              {waitingForBuyer && (
                                <>
                                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Waiting for Buyer
                                  </span>

                                  <p className="text-xs text-gray-400 max-w-xs md:text-right">
                                    Waiting for the
                                    buyer to create
                                    the transaction.
                                  </p>
                                </>
                              )}

                              {/* PENDING TRANSACTION */}

                              {isPending && (
                                <>
                                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Transaction Pending
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      continueTransaction(
                                        order,
                                      )
                                    }
                                    className="flex items-center gap-2 bg-[#1F3D2A] hover:bg-[#163020] text-white px-4 py-2 rounded-lg transition"
                                  >
                                    <span>
                                      Continue Transaction
                                    </span>

                                    <ArrowRight
                                      size={
                                        16
                                      }
                                    />
                                  </button>
                                </>
                              )}

                              {/* COMPLETED TRANSACTION */}

                              {isCompleted && (
                                <>
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Completed
                                  </span>

                                  <p className="text-xs text-gray-400">
                                    Transaction completed
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            {hasMoreOrders && (
              <div className="flex justify-center -mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleOrders(
                      (previous) =>
                        previous + 3,
                    )
                  }
                  className="px-5 py-2 rounded-lg border border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-white transition text-sm font-medium"
                >
                  Load more
                </button>
              </div>
            )}

            {/* ==================================================
                ACTIVE LISTINGS
            ================================================== */}

            <div>
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">
                  Active Listings
                </h3>

                <button className="text-sm text-gray-500">
                  View all →
                </button>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4 md:gap-5
                "
              >
                {displayedActiveListings.length ===
                0 ? (
                  <div className="bg-white border rounded-xl p-6 text-center">
                    No listings found.
                  </div>
                ) : (
                  displayedActiveListings.map(
                    (listing) => (
                      <ListingCard
                        key={
                          listing.id
                        }
                        listing={
                          listing
                        }
                        onEdit={(
                          item,
                        ) =>
                          console.log(
                            item,
                          )
                        }
                      />
                    ),
                  )
                )}
              </div>

              {hasMoreActiveListings && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleActiveListings(
                        (previous) =>
                          previous + 3,
                      )
                    }
                    className="px-5 py-2 rounded-lg border border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-white transition text-sm font-medium"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>

            {/* ==================================================
                SOLD LISTINGS
            ================================================== */}

            <div>
              <h3 className="font-semibold mb-4">
                Sold Listings
              </h3>

              {displayedSoldListings.length ===
              0 ? (
                <div className="bg-white border rounded-xl p-6 text-center">
                  No sold listings.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedSoldListings.map(
                      (listing) => (
                        <div
                          key={
                            listing.id
                          }
                          className="relative opacity-80"
                        >
                          <ListingCard
                            listing={
                              listing
                            }
                          />

                          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                            SOLD
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {hasMoreSoldListings && (
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleSoldListings(
                            (previous) =>
                              previous + 3,
                          )
                        }
                        className="px-5 py-2 rounded-lg border border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-white transition text-sm font-medium"
                      >
                        Load more
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ==================================================
                COMPLETED TRANSACTIONS
            ================================================== */}

            <div>
              <h3 className="font-semibold mb-3">
                Completed Transactions
              </h3>

              {displayedCompletedTransactions.length ===
              0 ? (
                <div className="bg-white border rounded-xl p-5">
                  No completed transactions.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {displayedCompletedTransactions.map(
                      (
                        transaction,
                      ) => {
                        const image =
                          Array.isArray(
                            transaction
                              .orders
                              ?.listings
                              ?.gallery_images,
                          )
                            ? transaction
                                .orders
                                .listings
                                .gallery_images[0]
                            : transaction
                                .orders
                                ?.listings
                                ?.gallery_images;

                        return (
                          <div
                            key={
                              transaction.id
                            }
                            className="bg-white border rounded-xl p-5 shadow-sm"
                          >
                            <div className="flex justify-between gap-4">
                              <div className="flex gap-4">
                                {image ? (
                                  <img
                                    src={
                                      image
                                    }
                                    alt={
                                      transaction
                                        .orders
                                        ?.title
                                    }
                                    className="w-24 h-24 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                    No image
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-semibold">
                                    {
                                      transaction
                                        .orders
                                        ?.title
                                    }
                                  </h4>

                                  <p className="text-sm text-gray-500">
                                    Buyer:{" "}
                                    {transaction
                                      .buyer
                                      ?.full_name ||
                                      "Unknown"}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    Price: €
                                    {Number(
                                      transaction
                                        .orders
                                        ?.agreed_price ||
                                        0,
                                    ).toLocaleString(
                                      "en-US",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      },
                                    )}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    Pickup:{" "}
                                    {transaction
                                      .pickup_date ||
                                      "Not specified"}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    Payment:{" "}
                                    {transaction
                                      .payment_method ||
                                      "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full h-fit text-sm">
                                Completed
                              </span>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {hasMoreCompletedTransactions && (
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleCompletedTransactions(
                            (previous) =>
                              previous + 3,
                          )
                        }
                        className="px-5 py-2 rounded-lg border border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-white transition text-sm font-medium"
                      >
                        Load more
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
