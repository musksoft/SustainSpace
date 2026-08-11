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
    return <div className="p-8">No order selected.</div>;
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

    // Generate a simple 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create transaction
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        order_id: order.id,
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        pickup_date: pickupDate,
        pickup_location: pickupLocation,
        verification_code: verificationCode,
        status: "pending",
      });

    if (transactionError) {
      setLoading(false);
      console.error(transactionError);
      alert(transactionError.message);
      return;
    }

    // Update order status
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: "buyer_confirmed",
      })
      .eq("id", order.id);

    setLoading(false);

    if (orderError) {
      console.error(orderError);
      alert(orderError.message);
      return;
    }

    alert("Transaction created successfully.");

    navigate("/buyer-dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F6F4F1] p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Create Transaction
        </h2>

        <div className="mb-5">
          <label className="font-medium">
            Delivery Method
          </label>

          <div className="mt-2 space-y-2">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
              />
              Pickup
            </label>

            <label className="flex gap-2 text-gray-400">
              <input
                type="radio"
                disabled
              />
              Delivery (Coming Soon)
            </label>
          </div>
        </div>

        <div className="mb-5">
          <label className="font-medium">
            Payment Method
          </label>

          <div className="mt-2 space-y-2">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Cash
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
              />
              Bank Transfer
            </label>
          </div>
        </div>

        <div className="mb-5">
          <label className="font-medium">
            Pickup Date
          </label>

          <input
            type="date"
            className="w-full mt-2 border rounded-lg p-3"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="font-medium">
            Pickup Location
          </label>

          <input
            type="text"
            placeholder="Example: Main Gate, University"
            className="w-full mt-2 border rounded-lg p-3"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>

        <button
          onClick={createTransaction}
          disabled={loading}
          className="w-full bg-[#31523F] text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Transaction"}
        </button>
      </div>
    </div>
  );
};

export default Transaction;
