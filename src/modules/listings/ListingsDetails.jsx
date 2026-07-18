import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { useLocation } from "react-router-dom";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePurchaseRequest = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate("/");
    return;
  }

  // Check existing pending request
  const { data: existing, error: checkError } = await supabase
    .from("purchase_requests")
    .select("id")
    .eq("listing_id", listing.id)
    .eq("buyer_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (checkError) {
    console.error(checkError);
    return;
  }

  if (existing) {
    alert("You already have a pending request for this item.");
    return;
  }


  // Create request
  const { error } = await supabase
    .from("purchase_requests")
    .insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      agreed_price: listing.price,
    });


  if (error) {
    alert(error.message);
    return;
  }


  alert("Purchase request sent!");
};
  const { sellerId, listingId } = location.state || {};
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setListing(data);

      const images = [...(data.gallery_images || []), data.featured_image];

      setSelectedImage(images[0]);

      if (user?.id === data.seller_id) {
        setIsOwner(true);
      }

      const { data: sellerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.seller_id)
        .single();

      setSeller(sellerData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this listing?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listing.id);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/seller");
  };

  if (!listing) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const images = [...(listing.gallery_images || []), listing.featured_image];

  return (
    <div className="bg-[#F7F5F1] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT SIDE */}

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden">
              <img
                src={selectedImage}
                alt={listing.title}
                className="w-full max-h-[500px] object-contain"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`
                    overflow-hidden
                    rounded-xl
                    border-2
                    ${
                      selectedImage === img
                        ? "border-[#1F3D2A]"
                        : "border-transparent"
                    }
                  `}
                >
                  <img src={img} alt="" className="w-full h-28 object-cover" />
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-serif mb-4">Description</h2>

              <p className="text-gray-600 leading-relaxed">
                {listing.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-serif mb-6">
                Sustainability Impact
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4">
                  <h3 className="font-semibold">FSC Materials</h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Built using responsibly sourced materials.
                  </p>
                </div>

                <div className="border rounded-xl p-4">
                  <h3 className="font-semibold">Reused Resource</h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Extending the life cycle of furniture.
                  </p>
                </div>

                <div className="border rounded-xl p-4">
                  <h3 className="font-semibold">Carbon Savings</h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Reduces manufacturing emissions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div>
            <div className="bg-white rounded-2xl p-6 sticky top-8">
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Available
                </span>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Eco Verified
                </span>
              </div>

              <h1 className="text-3xl font-serif">{listing.title}</h1>

              <p className="text-2xl font-semibold mt-3">${listing.price}</p>

              <div className="border rounded-xl p-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {seller?.full_name?.charAt(0)}
                  </div>

                  <div>
                    <p className="font-medium">{seller?.full_name}</p>

                    <p className="text-sm text-gray-500">Verified Seller</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchaseRequest}
                className="w-full mt-6 bg-[#1F3D2A] text-white py-3 rounded-xl"
              >
                Buy Now
              </button>
              <button
                onClick={() =>
                  navigate("/message", {
                    state: {
                      sellerId: listing.seller_id,
                      listingId: listing.id,
                    },
                  })
                }
                className="
    w-full
    mt-3
    border
    py-3
    rounded-xl
  "
              >
                Message Seller
              </button>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span>{listing.category}</span>
                </div>

                <div className="flex justify-between">
                  <span>Condition</span>
                  <span>{listing.item_condition}</span>
                </div>

                <div className="flex justify-between">
                  <span>Location</span>
                  <span>{listing.location}</span>
                </div>

                <div className="flex justify-between">
                  <span>Dimensions</span>
                  <span>
                    {listing.width} × {listing.height} × {listing.depth} cm
                  </span>
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => navigate(`/listing/edit/${listing.id}`)}
                    className="
                    flex-1
                    bg-[#1F3D2A]
                    text-white
                    py-3
                    rounded-xl
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="
                    flex-1
                    bg-red-600
                    text-white
                    py-3
                    rounded-xl
                    "
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
