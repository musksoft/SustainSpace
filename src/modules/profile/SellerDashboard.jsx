import { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import ListingCard from "../listings/ListingsCard";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  User,
  LogOut,
  PlusCircle,
  Bell,
  Menu,
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
  const [completedTransactions, setCompletedTransactions] = useState([]);

  const navigate = useNavigate();

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
        delivery_method,
        payment_method,
        pickup_date,
        pickup_location,
        verification_code,
        status
      )
    `,
      )
      .eq("seller_id", sellerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
  };

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPurchaseRequests(data);
  };

  const loadListings = async (sellerId) => {
    // Get completed transactions
    const { data: completedTransactions } = await supabase
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

    const soldListingIds =
      completedTransactions?.map((t) => t.orders?.listing_id).filter(Boolean) ||
      [];

    // Mark listings sold
    if (soldListingIds.length > 0) {
      await supabase
        .from("listings")
        .update({
          status: "sold",
        })
        .in("id", soldListingIds);
    }

    // Active listings

    const { data: activeData, error: activeError } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", sellerId)
      .neq("status", "sold")
      .order("created_at", {
        ascending: false,
      });

    if (activeError) {
      console.error(activeError);
      return;
    }

    // Sold listings

    const { data: soldData, error: soldError } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("status", "sold")
      .order("created_at", {
        ascending: false,
      });

    if (soldError) {
      console.error(soldError);
      return;
    }

    setListings(activeData || []);

    setSoldListings(soldData || []);
  };

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setCompletedTransactions(data || []);
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

      if (!error) {
        setProfile(data);
      }
      await loadPurchaseRequests(user.id);
      await loadOrders(user.id);
      await loadCompletedTransactions(user.id);
      await loadListings(user.id);
    };

    loadProfile();
  }, [navigate]);

  const acceptRequest = async (requestId, listingId) => {
    // Check if another buyer has already been accepted
    const { data: existing } = await supabase
      .from("purchase_requests")
      .select("id")
      .eq("listing_id", listingId)
      .eq("status", "accepted")
      .maybeSingle();

    if (existing) {
      alert("A buyer has already been accepted.");
      return;
    }

    // Accept purchase request
    const { error: requestError } = await supabase
      .from("purchase_requests")
      .update({
        status: "accepted",
      })
      .eq("id", requestId);

    if (requestError) {
      console.error(requestError);
      return;
    }

    // Reserve listing
    const { data, error: listingError } = await supabase
      .from("listings")
      .update({
        status: "reserved",
      })
      .eq("id", listingId)
      .select();

    console.log("Updated listing:", data);

    if (listingError) {
      console.error("Listing update failed:", listingError);
      return;
    }

    await loadPurchaseRequests(profile.id);
    await loadListings(profile.id);
  };

  const createOrder = async (request) => {
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("listing_id", request.listing_id)
      .maybeSingle();

    if (existing) {
      alert("Order already exists.");
      return;
    }

    const { error } = await supabase.from("orders").insert({
      purchase_request_id: request.id,
      listing_id: request.listing_id,
      buyer_id: request.buyer_id,
      seller_id: request.seller_id,
      title: request.listings.title,
      image_url: request.listings.featured_image,
      agreed_price: request.agreed_price ?? request.listings.price,
    });

    if (error) {
      console.error(error);
      return;
    }

    await supabase
      .from("purchase_requests")
      .update({ status: "completed" })
      .eq("id", request.id);

    await loadOrders(profile.id);
    await loadPurchaseRequests(profile.id);

    alert("Order created successfully!");
  };

  const cancelRequest = async (requestId) => {
    const { data: request } = await supabase
      .from("purchase_requests")
      .select("listing_id,status")
      .eq("id", requestId)
      .single();

    if (!request) return;

    await supabase
      .from("purchase_requests")
      .update({
        status: "cancelled",
      })
      .eq("id", requestId);

    if (request.status === "accepted") {
      await supabase
        .from("listings")
        .update({
          status: "available",
        })
        .eq("id", request.listing_id);
    }

    await loadPurchaseRequests(profile.id);
    await loadListings(profile.id);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F2]">
      {/* SIDEBAR */}
      <SellerSidebar />
      <div className="md:hidden bg-[#FAF7F2] border-b px-4 py-3 flex items-center justify-between">
        <button>
          <Menu />
        </button>

        <h1 className="text-2xl font-serif font-semibold text-[#1F3D2A]">
          Sustain<span className="text-[#8B5E3C]">Space</span>
        </h1>

        <div className="w-8 h-8 rounded-full border flex items-center justify-center">
          {profile?.full_name?.charAt(0) || "U"}
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-50">
        <button className="flex flex-col items-center text-[#1F3D2A]">
          <LayoutDashboard size={20} />
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <ClipboardList size={20} />
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <MessageSquare size={20} />
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <User size={20} />
        </button>
      </div>
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="hidden md:flex bg-[#1F3D2A] text-white px-8 py-5 items-center justify-between">
          {" "}
          <div>
            <p className="font-playfair italic text-lg text-[#FFF9F3]">
              Ready to rehome your furniture,
            </p>
            <h1 className="text-2xl font-semibold">
              {profile?.full_name || "User"}
            </h1>{" "}
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
              onClick={() => navigate("/listings")}
              className="flex items-center gap-2 bg-[#1F3D2A] text-white px-3 md:px-4 py-2 rounded-lg"
            >
              <PlusCircle size={18} />
              <span className="hidden md:block">Add new item</span>
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {" "}
            <div className="bg-white p-4 rounded-xl border">
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <h3 className="text-xl font-semibold">€4,250</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <p className="text-sm text-gray-500">Active Items</p>
              <h3 className="text-xl font-semibold">{listings.length}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border col-span-2 md:col-span-1">
              {" "}
              <p className="text-sm text-gray-500">Verified Seller Badge</p>
              <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                <div className="w-1/5 h-2 bg-[#1F3D2A] rounded-full" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                3 more sales to earn badge
              </p>
            </div>
          </div>

          {/* PICKUP VERIFICATION */}
          {/* <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Pickup Verification</h3>

              <button className="text-sm text-[#8B5E3C]">
                Request QR verification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">...</div>
          </div> */}

          {/* PURCHASE REQUEST */}
          <PurchaseRequests
            requests={purchaseRequests}
            onAccept={acceptRequest}
            onCancel={cancelRequest}
            onCreateOrder={createOrder}
          />

          <Orders orders={orders} />
          {/* <div>
            <h3 className="font-semibold mb-4">Purchase Requests</h3>

            {purchaseRequests.length === 0 ? (
              <div className="bg-white rounded-xl p-5">
                No purchase requests.
              </div>
            ) : (
              purchaseRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl p-5 mb-3">
                  <h4>{request.listings.title}</h4>

                  <p>
                    Buyer:
                    {request.buyer.full_name}
                  </p>

                  <button
                    onClick={() =>
                      acceptRequest(request.id, request.listing_id)
                    }
                  >
                    Accept
                  </button>

                  <button onClick={() => rejectRequest(request.id)}>
                    Reject
                  </button>
                </div>
              ))
            )}
          </div> */}

          {/* ACTIVE LISTINGS */}
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Active Listings</h3>
              <button className="text-sm text-gray-500">View all →</button>
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
              {listings.length === 0 ? (
                <div className="bg-white border rounded-xl p-6 text-center">
                  No listings found.
                </div>
              ) : (
                listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onEdit={(item) => console.log(item)}
                  />
                ))
              )}
            </div>
          </div>
          {/* SOLD LISTINGS */}
          <div>
            <h3 className="font-semibold mb-4">Sold Listings</h3>

            {soldListings.length === 0 ? (
              <div className="bg-white border rounded-xl p-6 text-center">
                No sold listings.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {soldListings.map((listing) => (
                  <div key={listing.id} className="relative opacity-80">
                    <ListingCard listing={listing} />

                    <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      SOLD
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COMPLETED TRANSACTIONS */}
          <div>
            <h3 className="font-semibold mb-3">Completed Transactions</h3>

            {completedTransactions.length === 0 ? (
              <div className="bg-white border rounded-xl p-5">
                No completed transactions.
              </div>
            ) : (
              <div className="space-y-4">
                {completedTransactions.map((transaction) => {
                  const image = Array.isArray(
                    transaction.orders?.listings?.gallery_images,
                  )
                    ? transaction.orders.listings.gallery_images[0]
                    : transaction.orders?.listings?.gallery_images;

                  return (
                    <div
                      key={transaction.id}
                      className="bg-white border rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex gap-4">
                          <img
                            src={image}
                            alt={transaction.orders?.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />

                          <div>
                            <h4 className="font-semibold">
                              {transaction.orders?.title}
                            </h4>

                            <p className="text-sm text-gray-500">
                              Buyer: {transaction.buyer?.full_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Price: €{transaction.orders?.agreed_price}
                            </p>

                            <p className="text-sm text-gray-500">
                              Pickup: {transaction.pickup_date}
                            </p>

                            <p className="text-sm text-gray-500">
                              Payment: {transaction.payment_method}
                            </p>
                          </div>
                        </div>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full h-fit text-sm">
                          Completed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
