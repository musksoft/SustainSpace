import { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import RatingModal from "../transaction/RatingModal";
import { ChevronRight, CheckCircle, Star } from "lucide-react";

export default function Reviews() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get completed transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(`
        *,
        seller:profiles!transactions_seller_id_fkey(
          id,
          full_name
        ),
        orders(
          listing_id,
          title,
          image_url,
          agreed_price,
          listings(
            gallery_images
          )
        )
      `)
      .eq("buyer_id", user.id)
      .eq("status", "completed")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    // Get all reviews written by this buyer
   const { data: reviews } = await supabase
  .from("reviews")
  .select("transaction_id, rating")
  .eq("buyer_id", user.id);

const reviewMap = new Map(
  (reviews || []).map((review) => [
    review.transaction_id,
    review.rating,
  ])
);

const formatted = transactions.map(
  (transaction) => ({
    ...transaction,
    rating: reviewMap.get(transaction.id) || null,
  })
);


    setTransactions(formatted);
  }

  return (
    <>
      {/* ==================================================
          DESKTOP
      ================================================== */}

      <div className="hidden lg:block">

        <div className="
          bg-white
          border
          border-[#DEDCD5]
          rounded-2xl
          overflow-hidden
          shadow-sm
        ">

          {/* TABLE HEADER */}

          <div className="
            grid
            grid-cols-[2fr_1fr_1.4fr_1fr_1fr]
            items-center
            px-6
            py-4
            bg-[#EFEEE8]
            border-b
            border-[#DEDCD5]
            text-[13px]
            uppercase
            font-semibold
            tracking-[0.12em]
            text-[#634210]
          ">

            <span>Item</span>

            <span>Date</span>

            <span>Seller</span>

            <span>Amount</span>

            <span>Review</span>

          </div>


          {/* TRANSACTIONS */}

          {transactions.map(
            (transaction, index) => {

              // const reviewed =
              //   transaction.reviewed;

              return (

                <div
                  key={transaction.id}
                  className={`
                    grid
                    grid-cols-[2fr_1fr_1.4fr_1fr_1fr]
                    items-center
                    px-6
                    py-4
                    ${
                      index !==
                      transactions.length - 1
                        ? "border-b border-[#E5E3DC]"
                        : ""
                    }
                    hover:bg-[#FAF9F6]
                    transition
                  `}
                >

                  {/* ==============================
                      ITEM
                  ============================== */}

                  <div className="
                    flex
                    items-center
                    gap-4
                    min-w-0
                  ">

                    <img
                      src={
                        transaction.orders
                          ?.image_url ||
                        transaction.orders
                          ?.listings
                          ?.gallery_images
                      }
                      alt=""
                      className="
                        w-20
                        h-20
                        rounded-lg
                        object-cover
                        flex-shrink-0
                      "
                    />

                    <div className="min-w-0">

                      <h3 className="
                        font-semibold
                        text-base
                        text-[#1F3D2A]
                        truncate
                      ">
                        {transaction.orders?.title}
                      </h3>

                      <span className="
                        inline-block
                        mt-1
                        text-[10px]
                        px-2
                        py-0.5
                        rounded-full
                        bg-[#c0edc0]
                        text-[#1F3D2A]
                      ">
                        Completed
                      </span>

                    </div>

                  </div>


                  {/* ==============================
                      DATE
                  ============================== */}

                  <p className="
                    text-sm
                    text-gray-600
                  ">
                    {new Date(
                      transaction.created_at
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>


                  {/* ==============================
                      SELLER
                  ============================== */}

                  <p className="
                    text-sm
                    text-gray-700
                    truncate
                    pr-4
                  ">
                    {transaction.seller?.full_name}
                  </p>


                  {/* ==============================
                      AMOUNT
                  ============================== */}

                  <p className="
                    text-sm
                    font-semibold
                    text-[#1F3D2A]
                  ">
                    €{transaction.orders?.agreed_price}
                  </p>


                  {/* ==============================
                      REVIEW STATUS
                  ============================== */}

                  {transaction.rating ? (

  <div className="
    inline-flex
    items-center
    gap-1.5
    w-fit
    px-3
    py-2
    rounded-full
    bg-[#FFF8E7]
    border
    border-[#F1E2B8]
  ">

    <div className="flex items-center gap-0.5">

      {[1, 2, 3, 4, 5].map((star) => (

        <Star
          key={star}
          size={15}
          className={
            star <= transaction.rating
              ? "fill-[#D6A84F] text-[#D6A84F]"
              : "text-[#D6D1C8]"
          }
        />

      ))}

    </div>

   

  </div>

) : (

  <button
    onClick={() =>
      setSelectedTransaction(
        transaction
      )
    }
    className="
      inline-flex
      items-center
      justify-center
      gap-1
      w-fit
      px-4
      py-2
      rounded-full
      bg-gray-100
      text-gray-600
      hover:bg-gray-200
      hover:text-gray-800
      text-xs
      font-semibold
      transition
    "
  >

    Leave Review

    <ChevronRight
      size={14}
    />

  </button>

)}

                </div>

              );
            }
          )}

        </div>

      </div>


      {/* ==================================================
          MOBILE
      ================================================== */}

      <div className="
        lg:hidden
        space-y-4
      ">

        {transactions.map(
          (transaction) => {

            const reviewed =
              transaction.reviewed;

            return (

              <div
                key={transaction.id}
                className="
                  bg-white
                  border
                  border-[#DEDCD5]
                  rounded-2xl
                  p-4
                  shadow-sm
                "
              >

                {/* ==============================
                    ITEM
                ============================== */}

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <img
                    src={
                      transaction.orders
                        ?.image_url ||
                      transaction.orders
                        ?.listings
                        ?.gallery_images
                    }
                    alt=""
                    className="
                      w-20
                      h-20
                      rounded-xl
                      object-cover
                      flex-shrink-0
                    "
                  />

                  <div className="min-w-0">

                    <h3 className="
                      font-semibold
                      text-[#1F3D2A]
                      truncate
                    ">
                      {transaction.orders?.title}
                    </h3>

                    <p className="
                      text-sm
                      text-gray-500
                      mt-1
                    ">
                      Seller:{" "}
                      {transaction.seller?.full_name}
                    </p>

                    <span className="
                      inline-block
                      mt-2
                      text-[10px]
                      px-2
                      py-0.5
                      rounded-full
                      bg-[#E8EDE8]
                      text-[#1F3D2A]
                    ">
                      Completed
                    </span>

                  </div>

                </div>


                {/* ==============================
                    DETAILS
                ============================== */}

                <div className="
                  grid
                  grid-cols-2
                  gap-4
                  mt-5
                  pt-4
                  border-t
                  border-[#E5E3DC]
                ">

                  <div>

                    <p className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-gray-400
                    ">
                      Date
                    </p>

                    <p className="
                      text-sm
                      text-gray-700
                      mt-1
                    ">
                      {new Date(
                        transaction.created_at
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-gray-400
                    ">
                      Amount
                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-[#1F3D2A]
                      mt-1
                    ">
                      €{transaction.orders?.agreed_price}
                    </p>

                  </div>

                </div>


                {/* ==============================
                    REVIEW STATUS
                ============================== */}

                <div className="mt-5">

                  {reviewed ? (

                    <div className="
                      w-full
                      rounded-xl
                      bg-green-50
                      border
                      border-green-100
                      px-4
                      py-3
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-green-700
                      text-sm
                      font-semibold
                    ">

                      <CheckCircle
                        size={17}
                      />

                      Reviewed

                    </div>

                  ) : (

                    <button
                      onClick={() =>
                        setSelectedTransaction(
                          transaction
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        bg-gray-100
                        text-gray-600
                        hover:bg-gray-200
                        hover:text-gray-800
                        py-3
                        text-sm
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-1
                        transition
                      "
                    >

                      Leave Review

                      <ChevronRight
                        size={16}
                      />

                    </button>

                  )}

                </div>

              </div>

            );
          }
        )}

      </div>


      {/* ==================================================
          RATING MODAL
      ================================================== */}

      <RatingModal
        open={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() =>
          setSelectedTransaction(null)
        }
        onSubmitted={() => {
          setSelectedTransaction(null);
          loadTransactions();
        }}
      />

    </>
  );
}