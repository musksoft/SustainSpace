import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Package,
  Heart,
  MessageSquare,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../listings/ListingsCard";
import { supabase } from "../../config/supabaseClient";

const BuyerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [purchaseRequests, setPurchaseRequests] = useState([]);

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
    };

    const loadListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

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

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) {
  //       navigate("/");
  //       return;
  //     }

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", user.id)
  //       .single();

  //     if (error) {
  //       console.error(error);
  //       return;
  //     }

  //     setProfile(data);
  //   };

  //   loadProfile();
  // }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    navigate("/");
  };

  const savedItems = [
    {
      name: "Scandi Oak Dining Table",
      brand: "Curated Studio",
      price: "$890.00",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
    },
    {
      name: "Boucle Lounge Chair",
      brand: "Eco-Living Collective",
      price: "$845.00",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
    },
    {
      name: "Platform Bed Frame",
      brand: "The Reclaimed Shop",
      price: "$1,200.00",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4F1] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F6F4F1] border-r border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-10">
          <Menu size={18} />
          <h1 className="text-xl font-serif font-semibold">
            {profile?.full_name || "Loading..."}
          </h1>
        </div>

        <nav className="space-y-3">
          <button className="w-full bg-[#31523F] text-white rounded-lg px-4 py-3 flex items-center gap-3">
            <Leaf size={18} />
            Overview
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white rounded-lg">
            <Package size={18} />
            Orders
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white rounded-lg">
            <Heart size={18} />
            Saved Items
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white rounded-lg">
            <MessageSquare size={18} />
            Messages
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white rounded-lg">
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500 text-white rounded-lg px-4 py-3"
          >
            Logout
          </button>
        </nav>

        {/* Sustainability Card */}
        <div className="mt-12 bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-sm mb-3">Sustainability Milestone</h3>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full w-[85%] bg-[#31523F] rounded-full"></div>
          </div>

          <p className="mt-2 text-xs text-gray-600">
            Forest Keeper <span className="float-right">85%</span>
          </p>

          <p className="mt-3 text-xs text-gray-500">
            2 more purchases to earn the Earth Advocate badge.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-[450px]">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search curated furniture..."
              className="w-full bg-white rounded-full pl-10 pr-4 py-3 border outline-none"
            />
          </div>

          <div className="flex items-center gap-5">
            <Bell size={20} />
            <User size={20} />
          </div>
        </div>

        {/* Impact Banner */}
        <div className="bg-gradient-to-r from-[#355844] to-[#274132] text-white rounded-2xl p-8 mb-8">
          <h2 className="text-4xl font-serif font-bold mb-3">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Guest"}
          </h2>

          <p className="text-gray-200 max-w-lg mb-8">
            By choosing curated pre-owned furniture, you've significantly
            reduced your environmental footprint this year.
          </p>

          <div className="flex gap-12">
            <div>
              <h3 className="text-3xl font-bold">34kg</h3>
              <p className="text-sm text-gray-300">CO₂ SAVED</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">12</h3>
              <p className="text-sm text-gray-300">TREES PLANTED</p>
            </div>
          </div>
        </div>

        {/* Purchase request */}
        <div className="mb-10">
          <h3 className="font-semibold text-gray-800 mb-4">
            My Purchase Requests
          </h3>

          {purchaseRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              No purchase requests yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {purchaseRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        request.listings?.featured_image ||
                        "https://placehold.co/100"
                      }
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div>
                      <h4 className="font-semibold">
                        {request.listings?.title}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Seller:
                        {request.seller?.full_name}
                      </p>

                      <p className="font-medium mt-2">
                        €{request.agreed_price ?? request.listings?.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {request.status === "pending" && (
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                        Waiting for seller
                      </span>
                    )}

                    {request.status === "accepted" && (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        Accepted - Waiting for order
                      </span>
                    )}

                    {request.status === "cancelled" && (
                      <div>
                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                          Cancelled
                        </span>

                        <button
                          className="block mt-3 text-[#31523F]"
                          onClick={() =>
                            navigate("/message", {
                              state: {
                                sellerId: request.seller_id,
                                listingId: request.listing_id,
                              },
                            })
                          }
                        >
                          Message Seller
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Orders */}
        <div className="mb-10">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Current Orders</h3>
            <button className="text-sm text-gray-500">View all orders</button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300"
                alt="Chair"
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h4 className="font-medium">Teak Lounge Chair</h4>
                <p className="text-sm text-gray-500">
                  Arriving by Thursday, Oct 24
                </p>

                <div className="flex justify-between mt-3">
                  <span className="font-semibold">$420.00</span>
                  <button className="text-[#31523F] font-medium">
                    Track →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300"
                alt="Lamp"
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="grid md:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-5">
                    <h3>{order.listings.title}</h3>

                    <p>${order.listings.price}</p>

                    <p>
                      Status:
                      {order.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-gray-800">
              Marketplace Listings
            </h3>

            <button
              onClick={() => navigate("/shop")}
              className="text-sm text-gray-500"
            >
              View All
            </button>
          </div>

          {loadingListings ? (
            <div>Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              No listings available.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 6).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Saved Items */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold">Saved For Later</h3>

            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>

              <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {savedItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-64 w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full">
                    <Heart size={16} fill="red" className="text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                  <p className="font-semibold">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
