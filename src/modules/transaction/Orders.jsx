import { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase

      .from("orders")

      .select(
        `
                *,
                buyer:profiles!orders_buyer_id_fkey(
                    full_name,
                    email
                )
            `,
      )

      .eq("seller_id", user.id)

      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      return;
    }

    setOrders(data);
  }

  

  async function buyerConfirmed(orderId) {
    const { error } = await supabase

      .from("orders")

      .update({
        status: "buyer_confirmed",
      })

      .eq("id", orderId);

    if (!error) loadOrders();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">No Orders Yet</div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border p-5 shadow-sm"
          >
            <div className="flex gap-5">
              <img
                src={order.image_url}
                className="w-28 h-28 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{order.title}</h3>

                <p>Buyer: {order.buyer?.full_name}</p>

                <p>{order.buyer?.email}</p>

                <p className="font-semibold mt-2">€{order.agreed_price}</p>

                <div className="mt-3">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    {order.status.replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {order.status === "waiting_for_buyer" && (
                  <button
                    className="bg-[#1F3D2A] text-white px-4 py-2 rounded"
                    disabled
                  >
                    Waiting Buyer
                  </button>
                )}

                {order.status === "buyer_confirmed" && (
                  <button className="bg-[#1F3D2A] text-white px-4 py-2 rounded">
                    Start Transaction
                  </button>
                )}

                {order.status === "completed" && (
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    disabled
                  >
                    Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
