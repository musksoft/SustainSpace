import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        buyer:profiles!orders_buyer_id_fkey(
          full_name,
          email
        ),
        listings(
          title,
          gallery_images
        ),
        transactions(
          id,
          status
        )
      `)
      .eq("seller_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
  }

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

    {orders.length === 0 ? (
      <div className="bg-white rounded-xl border border-[#E8E2D8] p-6 text-center">
        <p className="text-gray-500 text-sm">
          No orders yet
        </p>
      </div>
    ) : (
      orders.map((order) => {
        const transaction = order.transactions?.[0];

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

              {/* ORDER INFO */}
              <div className="flex-1">

                <div className="flex items-center gap-3 mb-3">

                  <h3 className="
                    text-lg
                    font-semibold
                    text-[#1F3D2A]
                  ">
                    {order.title}
                  </h3>

                  <span
                    className={`
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      capitalize
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          :
                        order.status === "buyer_confirmed"
                          ? "bg-[#E7EFE9] text-[#1F3D2A]"
                          :
                          "bg-[#FFF4D6] text-[#8B5E3C]"
                      }
                    `}
                  >
                    {order.status.replaceAll("_", " ")}
                  </span>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">

                  <p className="text-gray-500">
                    Buyer
                    <span className="block text-gray-800 font-medium">
                      {order.buyer?.full_name}
                    </span>
                  </p>


                  <p className="text-gray-500">
                    Email
                    <span className="block text-gray-800 font-medium">
                      {order.buyer?.email}
                    </span>
                  </p>


                  <p className="text-gray-500">
                    Amount
                    <span className="
                      block
                      text-[#8B5E3C]
                      font-semibold
                    ">
                      €{order.agreed_price}
                    </span>
                  </p>


                  <p className="text-gray-500">
                    Order ID
                    <span className="
                      block
                      text-gray-700
                      font-medium
                    ">
                      #{order.id.slice(0,8)}
                    </span>
                  </p>

                </div>

              </div>


              {/* ACTION */}
              <div className="md:w-44">

                {order.status === "waiting_for_buyer" && (
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
                    "
                  >
                    Waiting Buyer
                  </button>
                )}


                {order.status === "buyer_confirmed" && (
                  <button
                    onClick={() =>
                      navigate("/seller-transaction", {
                        state:{
                          transactionId: transaction?.id
                        }
                      })
                    }
                    className="
                      w-full
                      bg-[#1F3D2A]
                      hover:bg-[#294C37]
                      text-white
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                      transition
                    "
                  >
                    Continue Transaction
                  </button>
                )}


                {order.status === "completed" && (
                  <button
                    disabled
                    className="
                      w-full
                      bg-green-600
                      text-white
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                    "
                  >
                    Completed
                  </button>
                )}

              </div>

            </div>
          </div>
        );
      })
    )}
  </div>
);


}
