import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { ArrowLeft } from "lucide-react";

export default function AdminTransactionDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  async function loadTransaction() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_transactions")
      .select("*")
      .eq("transaction_id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setTransaction(data);

    setLoading(false);
  }

  const badgeColor = (status) => {
    switch (status) {
      case "pending":
      case "waiting_for_buyer":
      case "waiting_for_seller":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
      case "buyer_confirmed":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex">
        <AdminSidebar />

        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading transaction...</p>
        </main>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex">
        <AdminSidebar />

        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Transaction not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#1F3D2A] mb-3 hover:underline"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <p className="text-[#8B5E3C] font-semibold text-sm tracking-wider">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl font-serif text-[#1F3D2A]">
              Transaction Details
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor every step of this transaction.
            </p>
          </div>

          <div className="bg-white rounded-xl border px-5 py-3">
            <p className="text-xs text-gray-500">Transaction ID</p>

            <h2 className="font-bold text-[#1F3D2A]">
              #{transaction.transaction_id.slice(0, 8)}
            </h2>
          </div>
        </div>
        {/* TOP GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* LISTING */}

          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1F3D2A] mb-5">
              Listing
            </h2>

            <div className="flex gap-6">
              <img
                src={
                  transaction.gallery_images?.length > 0
                    ? transaction.gallery_images[0]
                    : transaction.featured_image
                }
                alt={transaction.title}
                className="
    w-20
    h-20
    rounded-xl
    object-cover
    border
  "
              />

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1F3D2A]">
                  {transaction.title}
                </h3>

                <p className="mt-4 text-gray-500">Agreed Price</p>

                <h2 className="text-3xl font-bold text-green-700">
                  ${transaction.agreed_price}
                </h2>

                <div className="mt-6">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium
                      ${badgeColor(transaction.transaction_status)}
                    `}
                  >
                    {transaction.transaction_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSACTION SUMMARY */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1F3D2A] mb-5">
              Summary
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Delivery Method</p>

                <p className="font-semibold capitalize">
                  {transaction.delivery_method}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Method</p>

                <p className="font-semibold capitalize">
                  {transaction.payment_method.replace("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Pickup Date</p>

                <p className="font-semibold">
                  {transaction.pickup_date || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>

                <p className="font-semibold">
                  {transaction.pickup_location || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Verification Code</p>

                <p className="font-mono text-lg font-bold tracking-widest">
                  {transaction.verification_code || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BUYER + SELLER */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* BUYER */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1F3D2A] mb-5">Buyer</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>

                <p className="font-semibold">{transaction.buyer_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>

                <p className="font-semibold">{transaction.buyer_email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Buyer ID</p>

                <p className="font-mono text-sm break-all">
                  {transaction.buyer_id}
                </p>
              </div>
            </div>
          </div>

          {/* SELLER */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1F3D2A] mb-5">
              Seller
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>

                <p className="font-semibold">{transaction.seller_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>

                <p className="font-semibold">{transaction.seller_email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Seller ID</p>

                <p className="font-mono text-sm break-all">
                  {transaction.seller_id}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* TRANSACTION PROGRESS */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1F3D2A] mb-6">
            Transaction Progress
          </h2>

          <div className="space-y-6">
            {/* Purchase Request */}

            <div className="flex items-start gap-5">
              <div
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  ${
                    transaction.request_status === "completed" ||
                    transaction.request_status === "accepted"
                      ? "bg-green-600"
                      : transaction.request_status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }
                `}
              >
                1
              </div>

              <div className="flex-1 border-b pb-5">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-[#1F3D2A]">
                    Purchase Request
                  </h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${badgeColor(transaction.request_status)}
                    `}
                  >
                    {transaction.request_status}
                  </span>
                </div>

                <p className="text-gray-500 mt-2">
                  Buyer submitted a purchase request to the seller.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  {new Date(transaction.request_created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order */}

            <div className="flex items-start gap-5">
              <div
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  ${
                    transaction.order_status === "completed" ||
                    transaction.order_status === "buyer_confirmed"
                      ? "bg-green-600"
                      : transaction.order_status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }
                `}
              >
                2
              </div>

              <div className="flex-1 border-b pb-5">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-[#1F3D2A]">Order</h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${badgeColor(transaction.order_status)}
                    `}
                  >
                    {transaction.order_status}
                  </span>
                </div>

                <p className="text-gray-500 mt-2">
                  The order was created after the purchase request.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  {new Date(transaction.order_created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Transaction */}

            <div className="flex items-start gap-5">
              <div
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  ${
                    transaction.transaction_status === "completed"
                      ? "bg-green-600"
                      : transaction.transaction_status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }
                `}
              >
                3
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-[#1F3D2A]">Transaction</h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${badgeColor(transaction.transaction_status)}
                    `}
                  >
                    {transaction.transaction_status}
                  </span>
                </div>

                <p className="text-gray-500 mt-2">
                  {transaction.transaction_status === "completed"
                    ? "The buyer has successfully received the product."
                    : transaction.transaction_status === "cancelled"
                      ? "This transaction has been cancelled."
                      : "The transaction is currently awaiting completion."}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  {new Date(
                    transaction.transaction_created_at,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS OVERVIEW */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">Purchase Request</p>

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                ${badgeColor(transaction.request_status)}
              `}
            >
              {transaction.request_status}
            </span>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">Order</p>

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                ${badgeColor(transaction.order_status)}
              `}
            >
              {transaction.order_status}
            </span>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">Transaction</p>

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                ${badgeColor(transaction.transaction_status)}
              `}
            >
              {transaction.transaction_status}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
