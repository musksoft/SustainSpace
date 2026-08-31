import { useState, useEffect } from "react";
import {
  Heart,
  ShieldCheck,
  ArrowRight,
  Flag,
  Bell,
  Search,
} from "lucide-react";

import { assets } from "../../assets/assets";

import { useNavigate } from "react-router-dom";
import ListingCard from "../listings/ListingsCard";
import { supabase } from "../../config/supabaseClient";

import BuyerSidebar from "./BuyerSidebar";
//import BuyerHome from "./BuyerHome";

const BuyerDashboard = () => {
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);

  const [loadingListings, setLoadingListings] = useState(true);

  const [purchaseRequests, setPurchaseRequests] = useState([]);

  const [transactions, setTransactions] = useState([]);

  // ============================================================
  // LOAD MORE CONTROLS
  // ============================================================

  const [visiblePurchaseRequests, setVisiblePurchaseRequests] =
    useState(3);

  const [visibleRequestHistory, setVisibleRequestHistory] =
    useState(3);

  const [visibleOrders, setVisibleOrders] = useState(3);

  const [visibleCompletedTransactions, setVisibleCompletedTransactions] =
    useState(3);

  const [visibleListings, setVisibleListings] = useState(3);

  const loadTransactions = async (buyerId) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        orders(
          listings(*)
        )
        `,
      )
      .eq("buyer_id", buyerId);

    if (!error) {
      setTransactions(data || []);
    }
  };

  const loadPurchaseRequests = async (buyerId) => {
    const { data, error } = await supabase
      .from("purchase_requests")
      .select(
        `
        *,
        listings(*),
        seller:profiles!purchase_requests_seller_id_fkey(
          full_name,
          email
        )
        `,
      )
      .eq("buyer_id", buyerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      return;
    }

    setPurchaseRequests(data || []);
  };

  const loadOrders = async (buyerId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        listings(
          title,
          featured_image,
          gallery_images,
          price
        )
          seller:profiles!orders_seller_id_fkey(
        full_name,
        email
      ),
        `,
      )
      .eq("buyer_id", buyerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      return;
    }

    setOrders(data || []);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");

        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);

        return;
      }

      setProfile(data);

      await loadPurchaseRequests(user.id);

      await loadOrders(user.id);

      await loadTransactions(user.id);
    };

    const loadListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);

        return;
      }

      setListings(data || []);

      setLoadingListings(false);
    };

    loadProfile();

    loadListings();
  }, [navigate]);

  const activeRequests = purchaseRequests.filter(
    (request) => request.status === "pending",
  );

  const requestHistory = purchaseRequests.filter((request) =>
    ["accepted", "cancelled", "completed"].includes(request.status),
  );

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "completed",
  );

  // ============================================================
  // VISIBLE ITEMS
  // ============================================================

  const displayedActiveRequests = activeRequests.slice(
    0,
    visiblePurchaseRequests,
  );

  const hasMoreActiveRequests =
    visiblePurchaseRequests < activeRequests.length;

  const displayedRequestHistory = requestHistory.slice(
    0,
    visibleRequestHistory,
  );

  const hasMoreRequestHistory =
    visibleRequestHistory < requestHistory.length;

  const displayedOrders = orders.slice(
    0,
    visibleOrders,
  );

  const hasMoreOrders = visibleOrders < orders.length;

  const displayedCompletedTransactions =
    completedTransactions.slice(
      0,
      visibleCompletedTransactions,
    );

  const hasMoreCompletedTransactions =
    visibleCompletedTransactions <
    completedTransactions.length;

  const displayedListings = listings.slice(
    0,
    visibleListings,
  );

  const hasMoreListings =
    visibleListings < listings.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* SIDEBAR */}
      <BuyerSidebar />

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* TOP HEADER */}

        <header
          className="
  hidden md:flex
  bg-[#1F3D2A]
  text-white
  px-8
  py-5
  items-center
  justify-between
  "
        >
          <div>
            <p className="font-serif italic text-lg text-[#FFF9F3]">
              Welcome back,
            </p>

            <h1 className="text-2xl font-semibold">
              {profile?.full_name || "User"}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <Bell size={20} />

            <div
              className="
      w-10
      h-10
      rounded-full
      bg-white
      text-[#1F3D2A]
      flex
      items-center
      justify-center
      font-semibold
      "
            >
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div
          className="
p-8
space-y-8
"
        >
          {/* DASHBOARD TITLE */}

          <div className="flex justify-between items-center">
            <div>
              <h2
                className="
text-lg
font-semibold
text-[#8B5E3C]
"
              >
                BUYER DASHBOARD
              </h2>

              <p className="text-gray-500 mt-1">
                Manage your furniture requests and purchases.
              </p>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="
bg-[#1F3D2A]
text-white
px-4
py-2
rounded-lg
hover:bg-[#31523F]
transition
"
            >
              Browse Items
            </button>
          </div>

          {/* STATS */}

          <div
            className="
grid
grid-cols-1
md:grid-cols-3
gap-5
"
          >
            <div
              className="
bg-white
border
rounded-xl
p-6
"
            >
              <p className="text-gray-500">Pending Requests</p>

              <h3 className="text-3xl font-semibold mt-2">
                {
                  purchaseRequests.filter(
                    (r) => r.status === "pending",
                  ).length
                }
              </h3>
            </div>

            <div
              className="
bg-white
border
rounded-xl
p-6
"
            >
              <p className="text-gray-500">Active Orders</p>

              <h3 className="text-3xl font-semibold mt-2">
                {orders.length}
              </h3>
            </div>

            <div
              className="
bg-white
border
rounded-xl
p-6
"
            >
              <p className="text-gray-500">Completed Purchases</p>

              <h3 className="text-3xl font-semibold mt-2">
                {completedTransactions.length}
              </h3>
            </div>
          </div>

          {/* ACTIVE PURCHASE REQUESTS */}

          <section className="bg-white rounded-3xl border border-[#E8DED2] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b bg-[#FCFAF7]">
              <div>
                <p className="uppercase tracking-[0.2em] text-xs text-[#8B5E3C] font-semibold">
                  ACTIVE REQUESTS
                </p>

                <h3 className="text-2xl font-serif text-[#1F3D2A] mt-1">
                  Purchase Requests
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Waiting for sellers to respond to your offers.
                </p>
              </div>

              <div className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-2xl">
                <p className="text-xs uppercase">Pending</p>

                <h4 className="text-2xl font-bold">
                  {activeRequests.length}
                </h4>
              </div>
            </div>

            {activeRequests.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-6xl mb-4">📭</div>

                <h3 className="text-xl font-semibold text-[#1F3D2A]">
                  No active requests
                </h3>

                <p className="text-gray-500 mt-2">
                  Browse the marketplace to send your first purchase request.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {displayedActiveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="group hover:bg-[#FBF9F5] transition-all duration-300 px-8 py-6"
                    >
                      <div className="flex justify-between items-center">
                        {/* LEFT */}

                        <div className="flex gap-5">
                          <img
                            src={
                              request.listings?.featured_image ||
                              "https://placehold.co/120"
                            }
                            className="w-28 h-28 rounded-2xl object-cover"
                          />

                          <div className="flex flex-col justify-center">
                            <h4 className="text-xl font-semibold text-[#1F3D2A] group-hover:text-[#31523F] transition">
                              {request.listings?.title}
                            </h4>

                            <p className="text-gray-500 mt-2">Seller</p>

                            <p className="font-medium text-[#1F3D2A]">
                              {request.seller?.full_name}
                            </p>

                            <p className="mt-3 text-lg font-semibold text-[#8B5E3C]">
                              €{request.agreed_price ?? request.listings?.price}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div className="flex flex-col items-end">
                          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-medium">
                            Waiting Seller
                          </span>

                          <p className="text-sm text-gray-400 mt-4">
                            Request sent
                          </p>

                          <button
                            className="
                mt-5
                bg-[#1F3D2A]
                hover:bg-[#31523F]
                text-white
                px-5
                py-2
                rounded-xl
                transition
                "
                          >
                            View Listing →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreActiveRequests && (
                  <div className="flex justify-center py-5">
                    <button
                      type="button"
                      onClick={() =>
                        setVisiblePurchaseRequests(
                          (previous) => previous + 3,
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
          </section>

          {/* REQUEST HISTORY */}

          <section>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-xl text-[#1F3D2A]">
                  Request History
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Review the outcome of your previous purchase requests.
                </p>
              </div>
            </div>

            {requestHistory.length === 0 ? (
              <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
                No previous requests.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedRequestHistory.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between gap-5">
                        <div className="flex gap-4">
                          <img
                            src={
                              Array.isArray(
                                request.listings?.gallery_images,
                              )
                                ? request.listings.gallery_images[0]
                                : request.listings?.featured_image ||
                                  "https://placehold.co/120"
                            }
                            className="w-24 h-24 rounded-lg object-cover"
                          />

                          <div>
                            <h4 className="font-semibold text-lg text-[#1F3D2A]">
                              {request.listings?.title}
                            </h4>

                            <p className="text-sm text-gray-500 mt-1">
                              Seller: {request.seller?.full_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Price:
                              <span className="ml-2 font-medium text-[#1F3D2A]">
                                €
                                {request.agreed_price ??
                                  request.listings?.price}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          {request.status === "accepted" && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              Accepted
                            </span>
                          )}

                          {request.status === "completed" && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              Completed
                            </span>
                          )}

                          {request.status === "cancelled" && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                              Cancelled
                            </span>
                          )}

                          <p className="text-xs text-gray-400">
                            {request.status === "accepted" &&
                              "Seller approved your request"}

                            {request.status === "completed" &&
                              "Purchase successfully completed"}

                            {request.status === "cancelled" &&
                              "Request was cancelled"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreRequestHistory && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleRequestHistory(
                          (previous) => previous + 3,
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
          </section>

          {/* CURRENT ORDERS */}

          <section className="bg-white rounded-3xl border border-[#E8DED2] shadow-sm overflow-hidden">
            {/* HEADER */}

            <div className="flex justify-between items-center px-8 py-6 border-b bg-[#FCFAF7]">
              <div>
                <p className="uppercase tracking-[0.2em] text-xs font-semibold text-[#8B5E3C]">
                  IN PROGRESS
                </p>

                <h3 className="text-2xl font-serif text-[#1F3D2A] mt-1">
                  Current Orders
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Follow your furniture from acceptance to completion.
                </p>
              </div>

              <button
                onClick={() => navigate("/orders")}
                className="text-[#8B5E3C] font-medium hover:underline"
              >
                View All →
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-6xl mb-4">📦</div>

                <h3 className="text-xl font-semibold text-[#1F3D2A]">
                  No active orders
                </h3>

                <p className="text-gray-500 mt-2">
                  Orders created from accepted requests will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {displayedOrders.map((order) => {
                    const transaction = transactions.find(
                      (t) => t.order_id === order.id,
                    );

                    const completed = transaction?.status === "completed";

                    return (
                      <div
                        key={order.id}
                        className="px-8 py-7 hover:bg-[#FBF9F5] transition"
                      >
                        <div className="flex justify-between">
                          {/* LEFT */}

                          <div className="flex gap-5">
                            <img
                              src={
                                Array.isArray(
                                  order.listings?.gallery_images,
                                )
                                  ? order.listings.gallery_images[0]
                                  : order.listings?.featured_image ||
                                    "https://placehold.co/120"
                              }
                              className="w-24 h-24 rounded-2xl object-cover"
                            />

                            <div>
                              <h4 className="text-xl font-semibold text-[#1F3D2A]">
                                {order.listings?.title}
                              </h4>

                              <p className="text-[#8B5E3C] text-lg font-semibold mt-2">
                                €{order.listings?.price}
                              </p>

                              {/* PURCHASE JOURNEY */}

                              <div className="mt-3 flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                                    ✓
                                  </div>

                                  <span>Accepted</span>
                                </div>

                                <div className="w-12 h-[2px] bg-green-600" />

                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                                    ✓
                                  </div>

                                  <span>Order</span>
                                </div>

                                <div
                                  className={`w-12 h-[2px] ${
                                    completed
                                      ? "bg-green-600"
                                      : "bg-gray-300"
                                  }`}
                                />

                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      completed
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {completed ? "✓" : "3"}
                                  </div>

                                  <span>Completed</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT */}

                          <div className="flex flex-col items-end justify-between">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-medium ${
                                completed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {completed ? "Completed" : "Processing"}
                            </span>

                            <button
                              onClick={() =>
                                navigate("/transaction", {
                                  state: { order },
                                })
                              }
                              className="mt-6 bg-[#1F3D2A] hover:bg-[#31523F] text-white px-5 py-2 rounded-xl transition"
                            >
                              Manage Order →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasMoreOrders && (
                  <div className="flex justify-center py-5">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleOrders(
                          (previous) => previous + 3,
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
          </section>

          {/* TRANSACTION HISTORY */}

          <section>
            <div className="mb-4">
              <p
                className="
  uppercase
  tracking-[0.2em]
  text-xs
  font-semibold
  text-[#8B5E3C]
  "
              >
                COMPLETED PURCHASES
              </p>

              <h3
                className="
  text-2xl
  font-serif
  text-[#1F3D2A]
  mt-1
  "
              >
                Transaction History
              </h3>

              <p
                className="
  text-gray-500
  mt-2
  text-sm
  "
              >
                View your completed furniture purchases.
              </p>
            </div>

            {completedTransactions.length === 0 ? (
              <div
                className="
bg-white
border
rounded-xl
p-6
text-center
text-gray-500
"
              >
                No completed transactions.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedCompletedTransactions.map(
                    (transaction) => {
                      const image = Array.isArray(
                        transaction.orders?.listings?.gallery_images,
                      )
                        ? transaction.orders.listings.gallery_images[0]
                        : transaction.orders?.listings?.featured_image ||
                          "https://placehold.co/120";

                      return (
                        <div
                          key={transaction.id}
                          className="
bg-white
border
rounded-xl
p-5
shadow-sm
hover:shadow-md
transition
"
                        >
                          <div
                            className="
flex
justify-between
gap-5
"
                          >
                            {/* LEFT */}

                            <div
                              className="
flex
gap-4
"
                            >
                              <img
                                src={image}
                                className="
w-24
h-24
rounded-lg
object-cover
"
                              />

                              <div>
                                <h4
                                  className="
font-semibold
text-lg
text-[#1F3D2A]
"
                                >
                                  {transaction.orders?.title ||
                                    transaction.orders?.listings?.title}
                                </h4>

                                <p className="text-sm text-gray-500 mt-2">
                                  Seller:
                                  <span
                                    className="
ml-2
text-[#1F3D2A]
"
                                  >
                                    {transaction.orders?.seller?.full_name ||
                                      "Seller"}
                                  </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                  Price:
                                  <span
                                    className="
ml-2
text-[#1F3D2A]
"
                                  >
                                    €
                                    {transaction.orders?.agreed_price ??
                                      transaction.orders?.listings?.price}
                                  </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                  Payment:
                                  <span
                                    className="
ml-2
text-[#1F3D2A]
"
                                  >
                                    {transaction.payment_method}
                                  </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                  Delivery:
                                  <span
                                    className="
ml-2
text-[#1F3D2A]
"
                                  >
                                    {transaction.delivery_method}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* RIGHT */}

                            <div
                              className="
flex
items-start
"
                            >
                              <span
                                className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-sm
"
                              >
                                Completed
                              </span>
                            </div>
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
                          (previous) => previous + 3,
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
          </section>

          {/* MARKETPLACE LISTINGS */}

          <section className="mb-12">
            <div
              className="
            flex
            justify-between
            items-center
            mb-6
            "
            >
              <h3
                className="
              font-serif
              text-2xl
              text-[#1F3D2A]
              "
              >
                Marketplace Listings
              </h3>

              <button
                onClick={() => navigate("/shop")}
                className="
              text-sm
              text-[#8B5E3C]
              hover:underline
              "
              >
                View More →
              </button>
            </div>

            {loadingListings ? (
              <div className="text-gray-500">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div
                className="
              bg-white
              border
              rounded-3xl
              p-8
              text-center
              text-gray-500
              "
              >
                No listings available.
              </div>
            ) : (
              <>
                <div
                  className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
              "
                >
                  {displayedListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                    />
                  ))}
                </div>

                {hasMoreListings && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleListings(
                          (previous) => previous + 3,
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
          </section>

          {/* REPORT A LISTING */}

          <section className="mt-12 mb-8">
            <div
              className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-red-200
      bg-[#FFF9F7]
      shadow-sm
    "
            >
              {/* GREEN ACCENT */}

              <div
                className="
        absolute
        left-0
        top-0
        bottom-0
        w-1.5
        bg-[#1F3D2A]
      "
              />

              <div className="p-7 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* LEFT */}

                  <div className="flex items-start gap-5">
                    <div
                      className="
              w-12
              h-12
              shrink-0
              rounded-2xl
              bg-red-100
              text-red-700
              flex
              items-center
              justify-center
            "
                    >
                      <Flag size={22} />
                    </div>

                    <div>
                      <p
                        className="
                text-xs
                uppercase
                tracking-[0.18em]
                font-semibold
                text-red-600
              "
                      >
                        COMMUNITY SAFETY
                      </p>

                      <h3
                        className="
                text-xl
                md:text-2xl
                font-serif
                text-[#1F3D2A]
                mt-1
              "
                      >
                        See something that doesn't look right?
                      </h3>

                      <p
                        className="
                text-sm
                md:text-base
                text-gray-500
                mt-2
                max-w-2xl
              "
                      >
                        Help us keep the marketplace safe by reporting listings
                        that may be misleading, suspicious, or against our
                        marketplace guidelines.
                      </p>

                      {/* TRUST MESSAGE */}

                      <div className="flex items-center gap-2 mt-4">
                        <ShieldCheck
                          size={17}
                          className="text-[#1F3D2A]"
                        />

                        <span className="text-sm text-[#1F3D2A]">
                          Reports are reviewed confidentially by our team.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT BUTTON */}

                  <button
                    onClick={() => navigate("/report-listing")}
                    className="
            shrink-0
            flex
            items-center
            justify-center
            gap-2
            bg-[#A84732]
            hover:bg-[#913D2C]
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            transition
            shadow-sm
          "
                  >
                    Report a Listing
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
