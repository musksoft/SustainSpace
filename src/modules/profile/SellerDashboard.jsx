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
  const navigate = useNavigate();

  const loadOrders = async (sellerId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      buyer:profiles!orders_buyer_id_fkey(
        full_name,
        email
      )
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setOrders(data);
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
      )
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
      const loadListings = async (sellerId) => {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("seller_id", sellerId)
          .eq("status", "available")
          .order("created_at", { ascending: false });

        if (error) {
          console.error(error);
          return;
        }

        setListings(data);
      };
      await loadListings(user.id);
    };

    loadProfile();
  }, [navigate]);

  const acceptRequest = async (requestId, listingId) => {
    // Make sure no other request is currently accepted
    const { data: existing } = await supabase
      .from("purchase_requests")
      .select("id")
      .eq("listing_id", listingId)
      .eq("status", "accepted")
      .maybeSingle();

    if (existing) {
      alert("This listing already has an accepted buyer.");
      return;
    }

    await supabase
      .from("purchase_requests")
      .update({
        status: "accepted",
      })
      .eq("id", requestId);

    await supabase
      .from("listings")
      .update({
        status: "reserved",
      })
      .eq("id", listingId);

    await loadPurchaseRequests(profile.id);
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

  const { error } = await supabase
    .from("orders")
    .insert({
      purchase_request_id: request.id,
      listing_id: request.listing_id,
      buyer_id: request.buyer_id,
      seller_id: request.seller_id,

      title: request.listings.title,
      image_url: request.listings.image_url,
      agreed_price: request.agreed_price ?? request.listings.price,
    });

  if (error) {
    console.error(error);
    alert("Failed to create order.");
    return;
  }

  alert("Order created successfully!");

  await loadOrders(profile.id);
};

  const cancelRequest = async (requestId) => {
    // Get the request first
    const { data: request } = await supabase
      .from("purchase_requests")
      .select("listing_id,status")
      .eq("id", requestId)
      .single();

    if (!request) return;

    // Cancel request
    await supabase
      .from("purchase_requests")
      .update({
        status: "cancelled",
      })
      .eq("id", requestId);

    // If it had been accepted, make the listing available again
    if (request.status === "accepted") {
      await supabase
        .from("listings")
        .update({
          status: "available",
        })
        .eq("id", request.listing_id);
    }

    await loadPurchaseRequests(profile.id);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    navigate("/"); // or "/" if your login page is home
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
            <div className="w-9 h-9 bg-white text-[#1F3D2A] rounded-full flex items-center justify-center font-semibold">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
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
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Pickup Verification</h3>
              <button className="text-sm text-[#8B5E3C]">
                Request QR verification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Mid-Century Lounge</p>
                  <p className="text-sm text-gray-500">Buyer: Julian R.</p>
                </div>

                <div className="bg-[#1F3D2A] text-white px-3 py-1 rounded-lg text-sm">
                  LUM-8291
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Oak Dining Table</p>
                  <p className="text-sm text-gray-500">Buyer: Sarah K.</p>
                </div>

                <div className="bg-[#1F3D2A] text-white px-3 py-1 rounded-lg text-sm">
                  LUM-4402
                </div>
              </div>
            </div>
          </div>

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

          {/* COMPLETED TRANSACTIONS */}
          <div>
            <h3 className="font-semibold mb-3">Completed Transactions</h3>

            <div className="bg-white border rounded-xl p-5">
              <p className="text-sm mb-4">2 Verified</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                <div className="border rounded-lg p-3">
                  <p className="text-sm">Buyer: James Smith</p>
                  <p className="text-sm text-gray-500">$3,000</p>
                  <p className="text-xs text-gray-400">10/04/2026</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm">Buyer: Sara Sally</p>
                  <p className="text-sm text-gray-500">$250</p>
                  <p className="text-xs text-gray-400">12/04/2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
