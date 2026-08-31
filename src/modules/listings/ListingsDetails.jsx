import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadListing();
  }, [id]);

  /*
   * ============================================================
   * PURCHASE REQUEST
   * ============================================================
   *
   * A user cannot purchase their own listing.
   *
   * The listing must also still be AVAILABLE.
   */
  const handlePurchaseRequest = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        return;
      }

      if (!user) {
        navigate("/");
        return;
      }

      /*
       * Prevent seller from buying their own listing.
       */
      if (listing.seller_id === user.id) {
        alert("You cannot request to purchase your own listing.");
        return;
      }

      /*
       * Check the CURRENT listing status again.
       *
       * This protects against somebody reserving/selling the
       * listing after the page was opened.
       */
      const {
        data: currentListing,
        error: listingError,
      } = await supabase
        .from("listings")
        .select("id, status, seller_id, price")
        .eq("id", listing.id)
        .single();

      if (listingError) {
        console.error(listingError);
        alert("Unable to check listing availability.");
        return;
      }

      if (currentListing.status !== "available") {
        alert(
          "This item is no longer available for purchase.",
        );

        /*
         * Refresh the listing so the UI also reflects the
         * latest status.
         */
        setListing((current) =>
          current
            ? {
                ...current,
                status: currentListing.status,
              }
            : current,
        );

        return;
      }

      /*
       * Check whether this buyer already has a pending
       * request for this listing.
       */
      const {
        data: existing,
        error: checkError,
      } = await supabase
        .from("purchase_requests")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("buyer_id", user.id)
        .eq("status", "pending")
        .maybeSingle();

      if (checkError) {
        console.error(checkError);
        alert("Unable to check your existing request.");
        return;
      }

      if (existing) {
        alert(
          "You already have a pending request for this item.",
        );
        return;
      }

      /*
       * Create purchase request.
       *
       * Seller is still allowed to make purchase requests
       * for OTHER sellers' listings.
       */
      const { error: insertError } = await supabase
        .from("purchase_requests")
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.seller_id,
          agreed_price: listing.price,
          status: "pending",
        });

      if (insertError) {
        console.error(insertError);
        alert(insertError.message);
        return;
      }

      alert("Purchase request sent!");
    } catch (error) {
      console.error(
        "Purchase request error:",
        error,
      );

      alert(
        "Unable to send purchase request. Please try again.",
      );
    }
  };

  /*
   * ============================================================
   * LOAD LISTING
   * ============================================================
   */

  const loadListing = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUser(user || null);

      /*
       * LOAD LISTING
       */
      const {
        data,
        error,
      } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setListing(data);

      /*
       * LOAD IMAGES
       */
      const images = [
        ...(data.gallery_images || []),
        data.featured_image,
      ].filter(Boolean);

      setSelectedImage(images[0] || "");

      /*
       * CHECK OWNER
       */
      if (user?.id === data.seller_id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }

      /*
       * ========================================================
       * SELLER DATA
       * ========================================================
       */

      const {
        data: sellerData,
        error: sellerError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.seller_id)
        .single();

      if (sellerError) {
        console.error(
          "Seller loading error:",
          sellerError,
        );
      }

      setSeller(sellerData || null);

      /*
       * ========================================================
       * SELLER REVIEWS
       * ========================================================
       */

      const {
        data: reviewData,
        error: reviewError,
      } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          title,
          comment,
          created_at,
          buyer:profiles!reviews_buyer_id_fkey(
            full_name
          )
        `)
        .eq("seller_id", data.seller_id)
        .order("created_at", {
          ascending: false,
        });

      if (reviewError) {
        console.error(
          "Review loading error:",
          reviewError,
        );
      }

      setReviews(reviewData || []);
    } catch (error) {
      console.error(
        "Listing loading error:",
        error,
      );
    }
  };

  /*
   * ============================================================
   * DELETE LISTING
   * ============================================================
   */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this listing?",
    );

    if (!confirmed) return;

    const {
      error,
    } = await supabase
      .from("listings")
      .delete()
      .eq("id", listing.id);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/seller");
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (!listing) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  /*
   * ============================================================
   * IMAGES
   * ============================================================
   */

  const images = [
    ...(listing.gallery_images || []),
    listing.featured_image,
  ].filter(Boolean);

  /*
   * ============================================================
   * RATING
   * ============================================================
   */

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  /*
   * ============================================================
   * LISTING STATUS
   * ============================================================
   */

  const isAvailable =
    listing.status === "available";

  const isReserved =
    listing.status === "reserved";

  const isSold =
    listing.status === "sold";

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="bg-[#F7F5F1] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ==================================================
              LEFT
          =================================================== */}

          <div className="lg:col-span-2">
            {/* MAIN IMAGE */}

            <div className="bg-white rounded-2xl overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={listing.title}
                  className="w-full max-h-[500px] object-contain"
                />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* THUMBNAILS */}

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setSelectedImage(img)
                    }
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
                    <img
                      src={img}
                      alt=""
                      className="w-full h-28 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* DESCRIPTION */}

            <div className="bg-white rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-serif mb-4">
                Description
              </h2>

              <p className="text-gray-600 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* ==================================================
                SELLER REVIEWS
            =================================================== */}

            <div className="bg-white rounded-2xl p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">
                  Seller Reviews
                </h2>

                <div className="text-yellow-500 font-semibold">
                  ⭐ {averageRating}

                  <span className="text-gray-500 ml-2">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500">
                  No reviews yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-5 last:border-none"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-semibold">
                          {review.title ||
                            "Buyer Review"}
                        </h3>

                        <span className="text-yellow-500">
                          {"★".repeat(
                            Number(review.rating || 0),
                          )}

                          {"☆".repeat(
                            Math.max(
                              0,
                              5 -
                                Number(
                                  review.rating || 0,
                                ),
                            ),
                          )}
                        </span>
                      </div>

                      <p className="text-gray-600 mt-2">
                        {review.comment}
                      </p>

                      <p className="text-sm text-gray-400 mt-3">
                        —{" "}
                        {review.buyer?.full_name ||
                          "Anonymous"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              RIGHT
          =================================================== */}

          <div>
            <div className="bg-white rounded-2xl p-6 sticky top-8">
              {/* STATUS */}

              <div className="flex gap-2 mb-4 flex-wrap">
                {isAvailable && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Available
                  </span>
                )}

                {isReserved && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Reserved
                  </span>
                )}

                {isSold && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Sold
                  </span>
                )}

                {isOwner && (
                  <span className="text-xs bg-[#D9F0E0] text-[#1F3D2A] px-2 py-1 rounded">
                    Your Listing
                  </span>
                )}

                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Eco Verified
                </span>
              </div>

              {/* TITLE */}

              <h1 className="text-3xl font-serif">
                {listing.title}
              </h1>

              <p className="text-2xl font-semibold mt-3">
                €{listing.price}
              </p>

              {/* ==================================================
                  SELLER
              =================================================== */}

              <div className="border rounded-xl p-4 mt-6">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-12
                      h-12
                      rounded-full
                      bg-gray-200
                      flex
                      items-center
                      justify-center
                      font-semibold
                      text-[#1F3D2A]
                    "
                  >
                    {seller?.full_name
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </div>

                  <div>
                    <p className="font-medium">
                      {seller?.full_name ||
                        "Seller"}
                    </p>

                    <p className="text-sm text-gray-500">
                      ⭐ {averageRating} (
                      {reviews.length} Reviews)
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  BUY / MESSAGE
              ===================================================
              
                  IMPORTANT:
                  
                  These buttons are ONLY rendered when the
                  current user is NOT the owner of the listing.

                  So:
                  
                  Seller -> own listing:
                    ❌ Buy Now
                    ❌ Message Seller

                  Buyer -> seller's listing:
                    ✅ Buy Now
                    ✅ Message Seller

                  Seller -> another seller's listing:
                    ✅ Buy Now
                    ✅ Message Seller
              =================================================== */}

              {!isOwner && (
                <>
                  <button
                    type="button"
                    onClick={
                      handlePurchaseRequest
                    }
                    disabled={!isAvailable}
                    className="
                      w-full
                      mt-6
                      bg-[#1F3D2A]
                      text-white
                      py-3
                      rounded-xl
                      hover:bg-[#294d36]
                      disabled:bg-gray-300
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                      transition
                    "
                  >
                    {isSold
                      ? "Sold"
                      : isReserved
                        ? "Reserved"
                        : "Buy Now"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/message", {
                        state: {
                          sellerId:
                            listing.seller_id,
                          listingId:
                            listing.id,
                        },
                      })
                    }
                    className="
                      w-full
                      mt-3
                      border
                      py-3
                      rounded-xl
                      hover:bg-gray-50
                      transition
                    "
                  >
                    Message Seller
                  </button>
                </>
              )}

              {/* ==================================================
                  OWNER MESSAGE
              =================================================== */}

              {isOwner && (
                <div className="mt-6 bg-[#F4F8F5] border border-[#D9E8DD] rounded-xl p-4">
                  <p className="text-sm text-[#1F3D2A] font-medium">
                    This is your listing.
                  </p>

                  
                </div>
              )}

              {/* ==================================================
                  LISTING DETAILS
              =================================================== */}

              <div className="mt-8 space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="text-right">
                    {listing.category}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Condition
                  </span>

                  <span className="text-right">
                    {listing.item_condition}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="text-right">
                    {listing.location}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Dimensions
                  </span>

                  <span className="text-right">
                    {listing.width} ×{" "}
                    {listing.height} ×{" "}
                    {listing.depth} cm
                  </span>
                </div>
              </div>

              {/* ==================================================
                  OWNER ACTIONS
              =================================================== */}

              {isOwner && (
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/listing/edit/${listing.id}`,
                      )
                    }
                    className="
                      flex-1
                      bg-[#1F3D2A]
                      text-white
                      py-3
                      rounded-xl
                      hover:bg-[#294d36]
                      transition
                    "
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="
                      flex-1
                      bg-red-600
                      text-white
                      py-3
                      rounded-xl
                      hover:bg-red-700
                      transition
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
