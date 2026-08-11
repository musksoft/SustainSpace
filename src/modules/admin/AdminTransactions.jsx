import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { Eye, Search } from "lucide-react";

export default function AdminTransactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_transactions")
      .select("*")
      .order("transaction_created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setTransactions(data || []);
    setLoading(false);
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        t.title?.toLowerCase().includes(keyword) ||
        t.buyer_name?.toLowerCase().includes(keyword) ||
        t.seller_name?.toLowerCase().includes(keyword);

      const matchesFilter =
        filter === "all"
          ? true
          : t.transaction_status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const total = transactions.length;

  const pending = transactions.filter(
    (t) => t.transaction_status === "pending"
  ).length;

  const completed = transactions.filter(
    (t) => t.transaction_status === "completed"
  ).length;

  const cancelled = transactions.filter(
    (t) => t.transaction_status === "cancelled"
  ).length;

  const badgeColor = (status) => {
    switch (status) {
      case "pending":
      case "waiting_for_buyer":
      case "waiting_for_seller":
        return "bg-yellow-100 text-yellow-700";

      case "buyer_confirmed":
      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-hidden flex flex-col">
                {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <p className="text-[#8B5E3C] font-semibold tracking-wider text-sm">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl font-serif text-[#1F3D2A]">
              Transactions
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor purchase requests, orders, and transactions across the marketplace.
            </p>

          </div>

          <div className="bg-white rounded-xl border px-5 py-3 shadow-sm">

            <p className="text-xs text-gray-500">
              Total Transactions
            </p>

            <h2 className="text-2xl font-bold text-[#1F3D2A]">
              {total}
            </h2>

          </div>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl border shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Total
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#1F3D2A]">
              {total}
            </h2>

          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-5">

            <p className="text-sm text-yellow-700">
              Pending
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-700">
              {pending}
            </h2>

          </div>

          <div className="bg-green-50 rounded-2xl border border-green-200 p-5">

            <p className="text-sm text-green-700">
              Completed
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-700">
              {completed}
            </h2>

          </div>

          <div className="bg-red-50 rounded-2xl border border-red-200 p-5">

            <p className="text-sm text-red-700">
              Cancelled
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-700">
              {cancelled}
            </h2>

          </div>

        </div>

        {/* SEARCH + FILTER */}

        <div className="bg-white rounded-2xl border shadow-sm p-5 mb-8">

          <div className="flex flex-col md:flex-row gap-4 justify-between">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search buyer, seller or listing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  rounded-xl
                  border
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#1F3D2A]
                "
              />

            </div>

            {/* FILTER */}

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="
                px-5
                py-3
                rounded-xl
                border
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#1F3D2A]
              "
            >

              <option value="all">
                All Transactions
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>
                {/* TRANSACTIONS TABLE */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex-1">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading transactions...
            </div>

          ) : filteredTransactions.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No transactions found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-[#F7F5F1] border-b">

                  <tr className="text-left">

                    <th className="px-6 py-4 text-sm font-semibold">
                      Listing
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Buyer
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Request
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Order
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Transaction
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Delivery
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Created
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      View
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredTransactions.map((transaction) => (

                    <tr
                      key={transaction.transaction_id}
                      onClick={() =>
                        navigate(
                          `/admin/transactions/${transaction.transaction_id}`
                        )
                      }
                      className="
                        border-b
                        hover:bg-[#FAF7F2]
                        transition
                        cursor-pointer
                      "
                    >

                      {/* LISTING */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">
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

                          <div>

                            <h3 className="font-semibold text-[#1F3D2A]">
                              {transaction.title}
                            </h3>

                            <p className="text-sm text-gray-500">
                              #{transaction.transaction_id.slice(0,8)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* BUYER */}

                      <td className="px-6 py-4">

                        <p className="font-medium">
                          {transaction.buyer_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {transaction.buyer_email}
                        </p>

                      </td>

                      {/* SELLER */}

                      <td className="px-6 py-4">

                        <p className="font-medium">
                          {transaction.seller_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {transaction.seller_email}
                        </p>

                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-4 font-semibold text-[#1F3D2A]">
                        ${transaction.agreed_price}
                      </td>

                      {/* REQUEST */}

                      <td className="px-6 py-4">

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

                      </td>

                      {/* ORDER */}

                      <td className="px-6 py-4">

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

                      </td>

                      {/* TRANSACTION */}

                      <td className="px-6 py-4">

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

                      </td>

                      {/* DELIVERY */}

                      <td className="px-6 py-4 capitalize">
                        {transaction.delivery_method}
                      </td>

                      {/* PAYMENT */}

                      <td className="px-6 py-4 capitalize">
                        {transaction.payment_method.replace("_", " ")}
                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-4 text-gray-500">

                        {new Date(
                          transaction.transaction_created_at
                        ).toLocaleDateString()}

                      </td>

                      {/* VIEW BUTTON */}

                      <td className="px-6 py-4 text-center">

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(
                              `/admin/transactions/${transaction.transaction_id}`
                            );
                          }}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            bg-[#1F3D2A]
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            hover:bg-[#294C37]
                            transition
                          "
                        >

                          <Eye size={16} />

                          View

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
              </main>
    </div>
  );
}