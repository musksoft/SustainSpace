import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { supabase } from "../../config/supabaseClient";

export default function RatingModal({
  open,
  onClose,
  transaction,
  onSubmitted,
  inline = false,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  /*
  ==========================================
  DON'T RENDER
  ==========================================
  */

  if (!inline && (!open || !transaction)) {
    return null;
  }

  if (inline && !transaction) {
    return null;
  }

  /*
  ==========================================
  DATA
  ==========================================
  */

  const review =
    transaction.reviews &&
    transaction.reviews.length > 0
      ? transaction.reviews[0]
      : null;

  const seller = transaction.seller;
  const order = transaction.orders;

  /*
  ==========================================
  SUBMIT REVIEW
  ==========================================
  */

  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);

    /*
    PREVENT DUPLICATE REVIEW
    */

    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("transaction_id", transaction.id)
      .maybeSingle();

    if (existing) {
      alert(
        "You have already reviewed this purchase."
      );

      setLoading(false);

      onSubmitted?.();

      return;
    }

    /*
    INSERT REVIEW
    */

    const { error } = await supabase
      .from("reviews")
      .insert({
        transaction_id: transaction.id,
        listing_id: transaction.orders?.listing_id,
        seller_id: transaction.seller_id,
        buyer_id: transaction.buyer_id,
        rating,
        title,
        comment,
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Thank you for your review!");

    onSubmitted?.();

    if (!inline) {
      onClose?.();
    }
  };

  /*
  ==========================================
  CONTENT
  ==========================================
  */

  const content = (
    <div className="
      bg-white
      rounded-3xl
      w-full
      p-6
      shadow-sm
      border
    ">

      {/* ==================================
          TRANSACTION HEADER
      ================================== */}

      <div className="
        flex
        items-center
        justify-between
        gap-4
        mb-6
      ">

        <div className="flex items-center gap-3">

          {/* SELLER IMAGE */}

          {seller?.avatar_url ? (
            <img
              src={seller.avatar_url}
              alt={seller.full_name}
              className="
                w-14
                h-14
                rounded-full
                object-cover
              "
            />
          ) : (
            <div className="
              w-14
              h-14
              rounded-full
              bg-[#E8EDE8]
              flex
              items-center
              justify-center
              text-[#1F3D2A]
              text-lg
              font-semibold
            ">
              {seller?.full_name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}

          <div>
            <p className="
              text-xs
              uppercase
              tracking-wide
              text-gray-400
            ">
              Seller
            </p>

            <h2 className="
              text-lg
              font-semibold
              text-[#1F3D2A]
            ">
              {seller?.full_name || "Seller"}
            </h2>
          </div>
        </div>

        {/* COMPLETED BADGE */}

        <span className="
          bg-green-100
          text-green-700
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          flex
          items-center
          gap-1
        ">
          <CheckCircle size={14} />
          Completed
        </span>
      </div>

      {/* ==================================
          ITEM
      ================================== */}

      {order && (
        <div className="
          border
          rounded-2xl
          p-3
          flex
          items-center
          gap-4
          mb-6
        ">

          {order.image_url ? (
            <img
              src={order.image_url}
              alt={order.title}
              className="
                w-20
                h-20
                rounded-xl
                object-cover
              "
            />
          ) : (
            <div className="
              w-20
              h-20
              rounded-xl
              bg-gray-100
            " />
          )}

          <div className="flex-1">
            <p className="
              font-semibold
              text-[#1F3D2A]
            ">
              {order.title}
            </p>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Agreed price: ${order.agreed_price}
            </p>
          </div>
        </div>
      )}

      {/* ==================================
          ALREADY REVIEWED
      ================================== */}

      {review ? (
        <div>

          <div className="flex items-center justify-between">
            <h2 className="
              text-xl
              font-semibold
              text-[#1F3D2A]
            ">
              Your Review
            </h2>

            <span className="
              text-sm
              text-gray-500
            ">
              {review.rating}/5
            </span>
          </div>

          {/* STARS */}

          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={24}
                  className={
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              )
            )}
          </div>

          {review.title && (
            <h3 className="
              font-semibold
              mt-5
            ">
              {review.title}
            </h3>
          )}

          {review.comment && (
            <p className="
              text-gray-600
              mt-2
              leading-relaxed
            ">
              {review.comment}
            </p>
          )}

          <p className="
            text-xs
            text-gray-400
            mt-4
          ">
            You have already reviewed this transaction.
          </p>

        </div>
      ) : (
        /* ==================================
           REVIEW FORM
        ================================== */

        <div>

          <h2 className="
            text-2xl
            font-serif
            text-[#1F3D2A]
            text-center
          ">
            Rate Your Seller
          </h2>

          <p className="
            text-center
            text-gray-500
            mt-2
          ">
            How was your buying experience?
          </p>

          {/* STARS */}

          <div className="
            flex
            justify-center
            gap-2
            mt-8
          ">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  onMouseEnter={() =>
                    setHover(star)
                  }
                  onMouseLeave={() =>
                    setHover(0)
                  }
                >
                  <Star
                    size={34}
                    className={`
                      transition
                      ${
                        star <=
                        (hover || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    `}
                  />
                </button>
              )
            )}
          </div>

          {/* TITLE */}

          <div className="mt-8">
            <label className="
              text-sm
              font-medium
            ">
              Review Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Excellent seller..."
              className="
                w-full
                mt-2
                border
                rounded-xl
                p-3
                outline-none
                focus:ring-2
                focus:ring-[#1F3D2A]
              "
            />
          </div>

          {/* COMMENT */}

          <div className="mt-5">
            <label className="
              text-sm
              font-medium
            ">
              Comment
            </label>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Tell others about your experience..."
              className="
                w-full
                mt-2
                border
                rounded-xl
                p-3
                resize-none
                outline-none
                focus:ring-2
                focus:ring-[#1F3D2A]
              "
            />
          </div>

          {/* BUTTONS */}

          <div className="flex gap-3 mt-8">

            {inline && (
              <button
                onClick={() => {
                  setRating(0);
                  setTitle("");
                  setComment("");
                }}
                className="
                  flex-1
                  border
                  rounded-xl
                  py-3
                "
              >
                Clear
              </button>
            )}

            {!inline && (
              <button
                onClick={onClose}
                className="
                  flex-1
                  border
                  rounded-xl
                  py-3
                "
              >
                Later
              </button>
            )}

            <button
              disabled={loading}
              onClick={submitReview}
              className="
                flex-1
                bg-[#1F3D2A]
                text-white
                rounded-xl
                py-3
                hover:bg-[#294C37]
                disabled:opacity-60
              "
            >
              {loading
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </div>
        </div>
      )}
    </div>
  );

  /*
  ==========================================
  INLINE VERSION
  ==========================================
  */

  if (inline) {
    return content;
  }

  /*
  ==========================================
  POPUP VERSION
  ==========================================
  */

  return (
    <div className="
      fixed
      inset-0
      z-50
      bg-black/40
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-4
    ">
      <div className="
        w-full
        max-w-md
        max-h-[90vh]
        overflow-y-auto
      ">
        {content}
      </div>
    </div>
  );
}