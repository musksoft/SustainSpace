import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { ArrowLeft } from "lucide-react";

export default function AdminListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    loadListing();
  }, [id]);

  async function loadListing() {
    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        seller:profiles!listings_seller_id_fkey(
          id,
          full_name,
          email,
          created_at,
          role
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setListing(data);
    setSeller(data.seller);
    setSelectedImage(data.featured_image);
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex bg-[#FAF7F2]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          Loading...
        </main>
      </div>
    );
  }

  const gallery = listing.gallery_images || [];

  const statusColor = {
    available: "bg-green-100 text-green-700",
    reserved: "bg-yellow-100 text-yellow-700",
    sold: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">

      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <button
          onClick={() => navigate("/admin/listings")}
          className="flex items-center gap-2 text-[#1F3D2A] mb-6"
        >
          <ArrowLeft size={18} />
          Back to Listings
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">

            {/* Featured */}

            <div className="bg-white rounded-2xl border overflow-hidden">

              <img
                src={selectedImage}
                alt={listing.title}
                className="w-full h-[520px] object-contain bg-[#F7F5F1]"
              />

            </div>

            {/* Gallery */}

            {gallery.length > 0 && (

              <div className="bg-white rounded-2xl border p-6">

                <h2 className="font-semibold mb-5">
                  Gallery
                </h2>

                <div className="grid grid-cols-5 gap-4">

                  {gallery.map((img, index) => (

                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`
                        rounded-xl
                        overflow-hidden
                        border-2
                        ${
                          selectedImage === img
                            ? "border-[#1F3D2A]"
                            : "border-transparent"
                        }
                      `}
                    >

                      <img
                        src={img}
                        alt=""
                        className="w-full h-24 object-cover"
                      />

                    </button>

                  ))}

                </div>

              </div>

            )}

            {/* Description */}

            <div className="bg-white rounded-2xl border p-6">

              <h2 className="text-xl font-semibold mb-4">
                Description
              </h2>

              <p className="text-gray-600 leading-7">
                {listing.description}
              </p>

            </div>

            {/* Furniture Details */}

            <div className="bg-white rounded-2xl border p-6">

              <h2 className="text-xl font-semibold mb-6">
                Furniture Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <p className="text-gray-500 text-sm">
                    Category
                  </p>

                  <p className="font-medium">
                    {listing.category}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Condition
                  </p>

                  <p className="font-medium">
                    {listing.item_condition}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Width
                  </p>

                  <p>{listing.width} cm</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Height
                  </p>

                  <p>{listing.height} cm</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Depth
                  </p>

                  <p>{listing.depth} cm</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Location
                  </p>

                  <p>{listing.location}</p>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* Listing */}

            <div className="bg-white rounded-2xl border p-6 sticky top-8">

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[listing.status]}`}
              >
                {listing.status}
              </span>

              <h1 className="text-3xl font-serif mt-5">
                {listing.title}
              </h1>

              <p className="text-3xl font-bold mt-4 text-[#1F3D2A]">
                ${listing.price}
              </p>

              <div className="border-t mt-6 pt-6 space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Created
                  </span>

                  <span>
                    {new Date(
                      listing.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Listing ID
                  </span>

                  <span className="text-xs">
                    {listing.id.slice(0, 8)}...
                  </span>
                </div>

              </div>

            </div>

            {/* Seller */}

            <div className="bg-white rounded-2xl border p-6">

              <h2 className="font-semibold mb-5">
                Seller Information
              </h2>

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center text-lg font-bold">

                  {seller?.full_name?.charAt(0)}

                </div>

                <div>

                  <h3 className="font-semibold">
                    {seller?.full_name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {seller?.email}
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Role
                  </span>

                  <span className="capitalize">
                    {seller?.role}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Joined
                  </span>

                  <span>

                    {seller?.created_at
                      ? new Date(
                          seller.created_at
                        ).toLocaleDateString()
                      : "-"}

                  </span>

                </div>

                <div>

                  <p className="text-gray-500 text-sm mb-1">
                    Seller ID
                  </p>

                  <p className="text-xs break-all">
                    {seller?.id}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}