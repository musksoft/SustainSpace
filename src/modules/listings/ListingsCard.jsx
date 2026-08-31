import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing }) {
  const navigate = useNavigate();

  const statusStyles = {
    available: "bg-green-100 text-green-700",
    reserved: "bg-yellow-100 text-yellow-700",
    sold: "bg-gray-200 text-gray-700",
  };

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      {/* IMAGE */}

      <div className="relative">
        <img
          src={
            listing.gallery_images?.[0] ||
            listing.featured_image ||
            "https://placehold.co/600x400?text=Furniture"
          }
          alt={listing.title || "Furniture"}
          className="w-full h-52 object-cover"
        />

        {/* STATUS */}

        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium capitalize ${
            statusStyles[listing.status] ||
            "bg-gray-100 text-gray-600"
          }`}
        >
          {listing.status || "available"}
        </span>
      </div>

      {/* CONTENT */}

      <div className="p-4">
        {/* TITLE */}

        <h4 className="font-medium text-lg text-gray-900">
          {listing.title || "Untitled listing"}
        </h4>

        {/* CATEGORY + CONDITION */}

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-[#F4F1EB] text-[#8B5E3C] px-2.5 py-1 rounded-full">
            {listing.category || "Furniture"}
          </span>

          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">
            {listing.item_condition || "Condition not specified"}
          </span>
        </div>

        {/* DESCRIPTION */}

        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
          {listing.description ||
            "No description provided for this item."}
        </p>

        {/* INFORMATION */}

        <div className="mt-4 bg-[#FAF7F2] rounded-lg p-3 space-y-2">
          {/* LOCATION */}

          <div className="flex justify-between gap-3 text-sm">
            <span className="text-gray-500">
              Location
            </span>

            <span className="font-medium text-gray-800 text-right">
              {listing.location || "Not specified"}
            </span>
          </div>

          {/* CONDITION */}

          <div className="flex justify-between gap-3 text-sm">
            <span className="text-gray-500">
              Condition
            </span>

            <span className="font-medium text-gray-800 capitalize text-right">
              {listing.item_condition || "Not specified"}
            </span>
          </div>

          {/* DIMENSIONS */}

          <div className="flex justify-between gap-3 text-sm">
            <span className="text-gray-500">
              Size
            </span>

            <span className="font-medium text-gray-800 text-right">
              {listing.width || "—"} ×{" "}
              {listing.height || "—"} ×{" "}
              {listing.depth || "—"} cm
            </span>
          </div>
        </div>

        {/* PRICE */}

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">
              Price
            </p>

            <p className="text-[#1F3D2A] font-semibold text-xl">
              €{Number(listing.price || 0).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>
          </div>

          <span className="text-sm font-medium text-[#1F3D2A]">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
}
