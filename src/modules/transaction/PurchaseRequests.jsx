import {
  CheckCircle2,
  Clock3,
  Mail,
  User,
  XCircle,
  PackageCheck,
} from "lucide-react";

export default function PurchaseRequests({
  requests,
  onAccept,
  onCancel,
  onCreateOrder,
}) {

  

  const pending = requests.filter((r) => r.status === "pending");

  const history = requests.filter((r) => r.status !== "pending");

  const statusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
            <CheckCircle2 size={14} />
            Accepted
          </span>
        );

      case "cancelled":
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
            <XCircle size={14} />
            Cancelled
          </span>
        );

      case "completed":
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
            <PackageCheck size={14} />
            Completed
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
            <Clock3 size={14} />
            Pending
          </span>
        );
    }
  };

  

  return (
    <div className="space-y-10">
      {/* Pending Requests */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-[#1F3D2A]">
            Purchase Requests
          </h3>

          <span className="bg-[#1F3D2A] text-white px-3 py-1 rounded-full text-sm">
            {pending.length} Pending
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-3">📦</div>

            <h4 className="font-semibold text-lg text-[#1F3D2A]">
              No Pending Requests
            </h4>

            <p className="text-gray-500 mt-2">
              Buyers who request your listings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {pending.map((request) => (
              <div
                key={request.id}
                className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Listing */}
                  <div className="flex gap-4">
                    <img
                      src={
                        request.listings?.image_url ||
                        "https://placehold.co/120x120?text=Furniture"
                      }
                      alt={request.listings?.title}
                      className="w-24 h-24 rounded-lg object-cover border"
                    />

                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg text-[#1F3D2A]">
                        {request.listings?.title}
                      </h4>

                      <p className="text-[#8B5E3C] font-semibold">
                        Agreed Price: €
                        {request.agreed_price ?? request.listings?.price}
                      </p>

                      {statusBadge(request.status)}
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-medium text-[#8B5E3C] mb-3">
                        Buyer Information
                      </h5>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center font-semibold">
                          {request.buyer?.full_name?.charAt(0) || "U"}
                        </div>

                        <div>
                          <p className="font-medium">
                            {request.buyer?.full_name}
                          </p>

                          <p className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail size={14} />
                            {request.buyer?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => onCancel(request.id)}
                        className="px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() =>
                          onAccept(request.id, request.listing_id)
                        }
                        className="px-5 py-2 rounded-lg bg-[#1F3D2A] text-white hover:bg-[#294d36]"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-[#1F3D2A]">
            Request History
          </h3>

          <span className="text-sm text-gray-500">
            {history.length} Total
          </span>
        </div>

        {history.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-8 text-center text-gray-500">
            No previous requests.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((request) => (
              <div
                key={request.id}
                className="bg-white border rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={
                      request.listings?.image_url ||
                      "https://placehold.co/70x70?text=Furniture"
                    }
                    alt={request.listings?.title}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />

                  <div>
                    <h4 className="font-medium">
                      {request.listings?.title}
                    </h4>

                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <User size={14} />
                      {request.buyer?.full_name}
                    </p>

                    <p className="text-sm font-medium text-[#8B5E3C]">
                      Agreed Price: €
                      {request.agreed_price ?? request.listings?.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center mt-4 md:mt-0">
                  {statusBadge(request.status)}

                  {request.status === "accepted" && (
                    <>
                      <button
                        onClick={() => onCreateOrder(request)}
                        className="px-4 py-2 rounded-lg bg-[#1F3D2A] text-white hover:bg-[#294d36]"
                      >
                        Create Order
                      </button>

                      <button
                        onClick={() => onCancel(request.id)}
                        className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}