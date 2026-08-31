import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

const Transaction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [loading, setLoading] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F6F4F1] p-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            No order selected.
          </p>
        </div>
      </div>
    );
  }

  const createTransaction = async () => {
    if (!pickupDate) {
      alert("Please select a pickup date.");
      return;
    }

    if (!pickupLocation.trim()) {
      alert("Please enter a pickup location.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Check if a transaction already exists.
       */

      const {
        data: existingTransaction,
        error: existingError,
      } = await supabase
        .from("transactions")
        .select("id,status")
        .eq("order_id", order.id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existingTransaction) {
        alert("A transaction already exists for this order.");
        setLoading(false);
        return;
      }

      /*
       * Generate 6 digit verification code.
       */

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      /*
       * Create transaction.
       */

      const { error: transactionError } =
        await supabase
          .from("transactions")
          .insert({
            order_id: order.id,
            buyer_id: order.buyer_id,
            seller_id: order.seller_id,
            delivery_method: deliveryMethod,
            payment_method: paymentMethod,
            pickup_date: pickupDate,
            pickup_location: pickupLocation.trim(),
            verification_code: verificationCode,
            status: "pending",
          });

      if (transactionError) {
        throw transactionError;
      }

      /*
       * Buyer has confirmed the order.
       *
       * The order is NOT completed yet.
       * Seller will complete it after handover.
       */

      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "buyer_confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (orderError) {
        throw orderError;
      }

      alert(
        "Transaction created successfully. The seller can now continue the transaction."
      );

      navigate("/buyer-dashboard");
    } catch (error) {
      console.error(
        "Transaction creation error:",
        error
      );

      alert(
        error?.message ||
          "Failed to create transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4F1] p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border p-6">

        {/* HEADER */}

        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold">
            ORDER TRANSACTION
          </p>

          <h2 className="text-2xl font-semibold text-[#1F3D2A] mt-2">
            Complete Your Order Details
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Confirm the pickup and payment details for your order.
          </p>
        </div>

        {/* ORDER */}

        <div className="bg-[#FAF7F2] rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">
            Furniture
          </p>

          <p className="font-semibold text-[#1F3D2A]">
            {order.title ||
              order.listings?.title ||
              "Furniture"}
          </p>

          <p className="text-[#8B5E3C] font-semibold mt-1">
            €
            {Number(
              order.agreed_price ??
                order.listings?.price ??
                0
            ).toFixed(2)}
          </p>
        </div>

        {/* DELIVERY */}

        <div className="mb-5">
          <label className="font-medium text-gray-800">
            Delivery Method
          </label>

          <div className="mt-3 space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="deliveryMethod"
                checked={
                  deliveryMethod === "pickup"
                }
                onChange={() =>
                  setDeliveryMethod("pickup")
                }
              />

              <span>Pickup</span>
            </label>

            <label className="flex items-center gap-3 text-gray-400">
              <input
                type="radio"
                disabled
              />

              <span>
                Delivery — Coming Soon
              </span>
            </label>

          </div>
        </div>

        {/* PAYMENT */}

        <div className="mb-5">
          <label className="font-medium text-gray-800">
            Payment Method
          </label>

          <div className="mt-3 space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={
                  paymentMethod === "cash"
                }
                onChange={() =>
                  setPaymentMethod("cash")
                }
              />

              <span>Cash</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={
                  paymentMethod ===
                  "bank_transfer"
                }
                onChange={() =>
                  setPaymentMethod(
                    "bank_transfer"
                  )
                }
              />

              <span>
                Bank Transfer
              </span>
            </label>

          </div>
        </div>

        {/* DATE */}

        <div className="mb-5">
          <label className="font-medium text-gray-800">
            Pickup Date
          </label>

          <input
            type="date"
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            className="w-full mt-2 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#1F3D2A]"
            value={pickupDate}
            onChange={(e) =>
              setPickupDate(e.target.value)
            }
          />
        </div>

        {/* LOCATION */}

        <div className="mb-6">
          <label className="font-medium text-gray-800">
            Pickup Location
          </label>

          <input
            type="text"
            placeholder="Example: Main Gate, University"
            className="w-full mt-2 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#1F3D2A]"
            value={pickupLocation}
            onChange={(e) =>
              setPickupLocation(e.target.value)
            }
          />
        </div>

        {/* BUTTON */}

        <button
          type="button"
          onClick={createTransaction}
          disabled={loading}
          className="
            w-full
            bg-[#31523F]
            hover:bg-[#1F3D2A]
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-white
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          {loading
            ? "Creating Transaction..."
            : "Confirm Transaction"}
        </button>

      </div>
    </div>
  );
};

export default Transaction;
