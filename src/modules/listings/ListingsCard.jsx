import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <img
        src={listing.gallery_images}
        alt={listing.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h4 className="font-medium text-lg">
          {listing.title}
        </h4>

        <p className="text-[#1F3D2A] font-semibold">
          ${listing.price}
        </p>
      </div>
    </div>
  );
}