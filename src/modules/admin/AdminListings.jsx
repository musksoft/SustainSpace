import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { Eye } from "lucide-react";

export default function AdminListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        seller:profiles!listings_seller_id_fkey(
          id,
          full_name,
          email
        )
      `
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setListings(data || []);
    setLoading(false);
  }

  const statusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";

      case "reserved":
        return "bg-yellow-100 text-yellow-700";

      case "sold":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
<div className="min-h-screen flex bg-[#FAF7F2] overflow-hidden">      <AdminSidebar />

<main className="flex-1 p-8 overflow-hidden flex flex-col">
        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-[#8B5E3C] font-semibold tracking-wider text-sm">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl font-serif text-[#1F3D2A]">
              Seller Listings
            </h1>

            <p className="text-gray-500 mt-1">
              View all listings submitted by sellers.
            </p>
          </div>

          <div className="bg-white rounded-xl border px-5 py-3">
            <p className="text-xs text-gray-500">
              Total Listings
            </p>

            <h2 className="text-2xl font-bold text-[#1F3D2A]">
              {listings.length}
            </h2>
          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading listings...
            </div>

          ) : listings.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No listings found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-[#F7F5F1] border-b">

                  <tr className="text-left">

                    <th className="px-6 py-4 text-sm font-semibold">
                      Gallery
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Title
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Created
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      View
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {listings.map((listing) => {

                    const image =
                      listing.gallery_images?.length > 0
                        ? listing.gallery_images[0]
                        : listing.featured_image;

                    return (

                      <tr
                        key={listing.id}
                        onClick={() =>
                          navigate(`/admin/listings/${listing.id}`)
                        }
                        className="
                          border-b
                          hover:bg-[#FAF7F2]
                          cursor-pointer
                          transition
                        "
                      >

                        {/* IMAGE */}

                        <td className="px-6 py-4">

                          <img
                            src={image}
                            alt={listing.title}
                            className="
                              w-28
                              h-20
                              rounded-xl
                              object-cover
                              border
                            "
                          />

                        </td>

                        {/* TITLE */}

                        <td className="px-6 py-4">

                          <h3 className="font-semibold text-[#1F3D2A]">
                            {listing.title}
                          </h3>

                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {listing.description}
                          </p>

                        </td>

                        {/* SELLER */}

                        <td className="px-6 py-4">

                          <p className="font-medium">
                            {listing.seller?.full_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {listing.seller?.email}
                          </p>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-4">
                          {listing.category}
                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-4 font-semibold">
                          ${listing.price}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span
                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-medium
                              ${statusColor(listing.status)}
                            `}
                          >
                            {listing.status}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4 text-gray-500">

                          {new Date(
                            listing.created_at
                          ).toLocaleDateString()}

                        </td>

                        {/* BUTTON */}

                        <td className="px-6 py-4 text-center">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              navigate(
                                `/admin/listings/${listing.id}`
                              );
                            }}
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

                            View
                          </button>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}