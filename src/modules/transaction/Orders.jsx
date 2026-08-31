import { useState } from "react";
import { supabase } from "../../config/supabaseClient";

export default function Orders({
  orders = [],
  onRefresh,
}) {
  const [completingId, setCompletingId] =
    useState(null);

  /*
   * ============================================================
   * COMPLETE TRANSACTION
   * ============================================================
   */

  const completeTransaction = async (
    order
  ) => {
    if (!order) return;

    const transaction =
      order.transactions?.[0];

    if (!transaction) {
      alert(
        "No transaction was found for this order."
      );

      return;
    }

    const confirmed = window.confirm(
      "Confirm that the furniture has been handed over and the transaction is complete?"
    );

    if (!confirmed) return;

    setCompletingId(order.id);

    try {
      /*
       * ========================================================
       * 1. COMPLETE TRANSACTION
       * ========================================================
       */

      const {
        error: transactionError,
      } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", transaction.id);

      if (transactionError) {
        throw transactionError;
      }

      /*
       * ========================================================
       * 2. COMPLETE ORDER
       * ========================================================
       */

      const {
        error: orderError,
      } = await supabase
        .from("orders")
        .update({
          status: "completed",
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", order.id);

      if (orderError) {
        throw orderError;
      }

      /*
       * ========================================================
       * 3. MARK LISTING AS SOLD
       * ========================================================
       */

      if (order.listing_id) {
        const {
          error: listingError,
        } = await supabase
          .from("listings")
          .update({
            status: "sold",
          })
          .eq(
            "id",
            order.listing_id
          );

        if (listingError) {
          throw listingError;
        }
      }

      /*
       * ========================================================
       * 4. REFRESH SELLER DASHBOARD
       * ========================================================
       */

      if (onRefresh) {
        await onRefresh();
      }

      alert(
        "Transaction completed successfully."
      );
    } catch (error) {
      console.error(
        "Error completing transaction:",
        error
      );

      alert(
        error?.message ||
          "Failed to complete transaction."
      );
    } finally {
      setCompletingId(null);
    }
  };

  /*
   * ============================================================
   * EMPTY STATE
   * ============================================================
   */

  if (orders.length === 0) {
    return (
      <div className="space-y-5">

        <div>
          <h2 className="text-xl font-semibold text-[#1F3D2A]">
            Orders
          </h2>

          <p className="text-sm text-gray-500">
            Manage buyer confirmations and transactions
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E2D8] p-6 text-center">
          <p className="text-gray-500 text-sm">
            No orders yet
          </p>
        </div>

      </div>
    );
  }

  /*
   * ============================================================
   * ORDERS
   * ============================================================
   */

  return (
    <div className="space-y-5">

      <div>
        <h2 className="text-xl font-semibold text-[#1F3D2A]">
          Orders
        </h2>

        <p className="text-sm text-gray-500">
          Manage buyer confirmations and transactions
        </p>
      </div>

      {orders.map((order) => {

        const transaction =
          order.transactions?.[0];

        const isCompleted =
          order.status ===
            "completed" ||
          transaction?.status ===
            "completed";

        const isBuyerConfirmed =
          order.status ===
          "buyer_confirmed";

        const isWaiting =
          order.status ===
          "waiting_for_buyer";

        const isCompleting =
          completingId === order.id;

        return (
          <div
            key={order.id}
            className="
              bg-white
              border
              border-[#E8E2D8]
              rounded-2xl
              p-5
              shadow-sm
              hover:shadow-md
              transition
            "
          >

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

              {/* ==================================================
                  ORDER INFO
              =================================================== */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3 mb-3">

                  <h3 className="
                    text-lg
                    font-semibold
                    text-[#1F3D2A]
                  ">
                    {order.title ||
                      order.listings?.title ||
                      "Furniture"}
                  </h3>

                  {/* STATUS */}

                  <span
                    className={`
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      capitalize
                      font-medium

                      ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : isBuyerConfirmed
                          ? "bg-blue-100 text-blue-700"
                          : isWaiting
                          ? "bg-[#FFF4D6] text-[#8B5E3C]"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {isCompleted
                      ? "Completed"
                      : order.status?.replaceAll(
                          "_",
                          " "
                        )}
                  </span>

                </div>

                {/* ORDER DETAILS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">

                  <p className="text-gray-500">
                    Buyer

                    <span className="block text-gray-800 font-medium">
                      {order.buyer?.full_name ||
                        "Unknown Buyer"}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Email

                    <span className="block text-gray-800 font-medium break-all">
                      {order.buyer?.email ||
                        "No email"}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Amount

                    <span className="
                      block
                      text-[#8B5E3C]
                      font-semibold
                    ">
                      €
                      {Number(
                        order.agreed_price || 0
                      ).toFixed(2)}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Order ID

                    <span className="
                      block
                      text-gray-700
                      font-medium
                    ">
                      #
                      {order.id.slice(
                        0,
                        8
                      )}
                    </span>
                  </p>

                </div>

                {/* TRANSACTION DETAILS */}

                {transaction && (
                  <div className="
                    mt-4
                    bg-[#FAF7F2]
                    rounded-xl
                    p-4
                    text-sm
                    space-y-1
                  ">

                    <p>
                      <span className="text-gray-500">
                        Payment:
                      </span>{" "}
                      <span className="font-medium">
                        {transaction.payment_method ||
                          "Not specified"}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Pickup:
                      </span>{" "}
                      <span className="font-medium">
                        {transaction.pickup_date ||
                          "Not specified"}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Location:
                      </span>{" "}
                      <span className="font-medium">
                        {transaction.pickup_location ||
                          "Not specified"}
                      </span>
                    </p>

                  </div>
                )}

              </div>

              {/* ==================================================
                  ACTION
              =================================================== */}

              <div className="md:w-48">

                {/* WAITING FOR BUYER */}

                {isWaiting && (
                  <button
                    disabled
                    className="
                      w-full
                      bg-[#F3F1EC]
                      text-gray-500
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                      cursor-not-allowed
                    "
                  >
                    Waiting Buyer
                  </button>
                )}

                {/* BUYER CONFIRMED */}

                {isBuyerConfirmed && (
                  <button
                    type="button"
                    onClick={() =>
                      completeTransaction(
                        order
                      )
                    }
                    disabled={isCompleting}
                    className="
                      w-full
                      bg-[#1F3D2A]
                      hover:bg-[#294C37]
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      text-white
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                      transition
                    "
                  >
                    {isCompleting
                      ? "Completing..."
                      : "Complete Transaction"}
                  </button>
                )}

                {/* COMPLETED */}

                {isCompleted && (
                  <div className="
                    w-full
                    bg-green-100
                    text-green-700
                    py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    text-center
                  ">
                    ✓ Completed
                  </div>
                )}

              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}