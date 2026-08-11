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
      <img
        src={
          
          listing.gallery_images?.[0] ||
          "https://placehold.co/600x400?text=Furniture"
        }
        alt={listing.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h4 className="font-medium text-lg">{listing.title}</h4>

        <div className="mt-3 flex justify-between items-center">
          <p className="text-[#1F3D2A] font-semibold">
            €{listing.price}
          </p>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              statusStyles[listing.status] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {listing.status}
          </span>
        </div>
      </div>
    </div>
  );
}
