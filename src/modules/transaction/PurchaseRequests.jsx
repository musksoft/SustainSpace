import {
  CheckCircle2,
  Clock3,
  Mail,
  User,
  XCircle,
  PackageCheck,
} from "lucide-react";

export default function PurchaseRequests({
  requests = [],
  onAccept,
  onCancel,
  onCreateOrder,
}) {
  /*
   * ============================================================
   * LISTING STATUS
   * ============================================================
   *
   * A pending request is visible only when the listing is
   * currently available.
   *
   * reserved -> hidden from pending requests
   * sold     -> hidden from pending requests
   * available -> visible
   *
   * We intentionally do NOT filter based on the user's role.
   * Sellers are allowed to create purchase requests.
   */
  const isListingAvailable = (request) => {
    const listingStatus = request?.listings?.status;

    return listingStatus === "available";
  };

  /*
   * ============================================================
   * PENDING REQUESTS
   * ============================================================
   *
   * Only pending requests for AVAILABLE listings appear here.
   *
   * The request itself is NOT deleted from the database when
   * the listing becomes reserved or sold.
   */
  const pending = requests.filter(
    (request) =>
      request?.status === "pending" &&
      isListingAvailable(request),
  );

  /*
   * ============================================================
   * HISTORY
   * ============================================================
   *
   * All non-pending requests remain visible in history.
   *
   * This includes:
   *
   * accepted
   * cancelled
   * completed
   */
  const history = requests.filter(
    (request) => request?.status !== "pending",
  );

  /*
   * ============================================================
   * STATUS BADGE
   * ============================================================
   */

  const statusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            <CheckCircle2 size={14} />
            Accepted
          </span>
        );

      case "cancelled":
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            <XCircle size={14} />
            Cancelled
          </span>
        );

      case "completed":
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            <PackageCheck size={14} />
            Completed
          </span>
        );

      case "pending":
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            <Clock3 size={14} />
            Pending
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            <Clock3 size={14} />
            {status || "Unknown"}
          </span>
        );
    }
  };

  /*
   * ============================================================
   * LISTING IMAGE
   * ============================================================
   */

  const getListingImage = (listing) => {
    return (
      listing?.image_url ||
      listing?.featured_image ||
      "https://placehold.co/120x120?text=Furniture"
    );
  };

  /*
   * ============================================================
   * PRICE
   * ============================================================
   */

  const getPrice = (request) => {
    return (
      request?.agreed_price ??
      request?.listings?.price ??
      0
    );
  };

  /*
   * ============================================================
   * SAFE BUYER NAME
   * ============================================================
   */

  const getBuyerName = (request) => {
    return (
      request?.buyer?.full_name ||
      "Unknown Buyer"
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="space-y-10">
      {/* ======================================================
          PENDING REQUESTS
      ======================================================= */}

      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          <h3 className="text-xl font-semibold text-[#1F3D2A]">
            Purchase Requests
          </h3>

          <span className="bg-[#1F3D2A] text-white px-3 py-1 rounded-full text-sm w-fit">
            {pending.length} Pending
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-3">
              📦
            </div>

            <h4 className="font-semibold text-lg text-[#1F3D2A]">
              No Pending Requests
            </h4>

            <p className="text-gray-500 mt-2">
              Purchase requests for available listings
              will appear here.
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
                  {/* ==================================================
                      LISTING
                  =================================================== */}

                  <div className="flex gap-4">
                    <img
                      src={getListingImage(
                        request.listings,
                      )}
                      alt={
                        request.listings?.title ||
                        "Furniture"
                      }
                      className="w-24 h-24 rounded-lg object-cover border flex-shrink-0"
                    />

                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg text-[#1F3D2A]">
                        {request.listings?.title ||
                          "Untitled Listing"}
                      </h4>

                      <p className="text-[#8B5E3C] font-semibold">
                        Agreed Price: €
                        {getPrice(request)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {statusBadge(
                          request.status,
                        )}

                        <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      BUYER
                  =================================================== */}

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-medium text-[#8B5E3C] mb-3">
                        Buyer Information
                      </h5>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center font-semibold flex-shrink-0">
                          {getBuyerName(
                            request,
                          ).charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {getBuyerName(
                              request,
                            )}
                          </p>

                          <p className="flex items-center gap-1 text-sm text-gray-500 break-all">
                            <Mail
                              size={14}
                              className="flex-shrink-0"
                            />

                            {request?.buyer?.email ||
                              "No email available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ==================================================
                        ACTIONS
                    =================================================== */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          onCancel?.(
                            request.id,
                          )
                        }
                        className="px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onAccept?.(
                            request.id,
                            request.listing_id,
                          )
                        }
                        className="px-5 py-2 rounded-lg bg-[#1F3D2A] text-white hover:bg-[#294d36] transition"
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

      {/* ======================================================
          REQUEST HISTORY
      ======================================================= */}

      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
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
                className="bg-white border rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5"
              >
                {/* ==================================================
                    LISTING INFO
                =================================================== */}

                <div className="flex gap-4 items-center min-w-0">
                  <img
                    src={getListingImage(
                      request.listings,
                    )}
                    alt={
                      request.listings?.title ||
                      "Furniture"
                    }
                    className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <h4 className="font-medium truncate">
                      {request.listings?.title ||
                        "Untitled Listing"}
                    </h4>

                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <User size={14} />

                      {getBuyerName(request)}
                    </p>

                    <p className="text-sm font-medium text-[#8B5E3C]">
                      Agreed Price: €
                      {getPrice(request)}
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    STATUS + ACTIONS
                =================================================== */}

                <div className="flex flex-wrap gap-3 items-center">
                  {statusBadge(request.status)}

                  {/* =================================================
                      ACCEPTED REQUEST
                  ================================================= */}

                  {request.status ===
                    "accepted" && (
                    <>
                      {request.orders?.length ===
                      0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              onCreateOrder?.(
                                request,
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-[#1F3D2A] text-white text-sm font-medium hover:bg-[#294d36] transition"
                          >
                            Create Order
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onCancel?.(
                                request.id,
                              )
                            }
                            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <p className="text-green-600 text-sm font-medium">
                          Order Created
                        </p>
                      )}
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
