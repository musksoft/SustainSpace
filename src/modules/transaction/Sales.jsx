import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Leaf,
  TrendingUp,
  Download,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

import { supabase } from "../../config/supabaseClient";
import SellerSidebar from "../profile/SellerSidebar";
function StatCard({ icon, title, value, bg = "bg-white", dark = false }) {
  return (
    <div
      className={`
        rounded-2xl
        p-4
        border
        ${
          dark
            ? "bg-[#1F3D2A] text-white border-[#1F3D2A]"
            : `${bg} border-[#E8E2D8]`
        }
      `}
    >
      <div
        className="
        flex
        items-center
        gap-2
        text-sm
        opacity-80
      "
      >
        {icon}

        <span>{title}</span>
      </div>

      <h3
        className="
        text-2xl
        font-semibold
        mt-4
      "
      >
        {value}
      </h3>
    </div>
  );
}
export default function Sales() {
  const [sales, setSales] = useState([]);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    revenue: 0,

    orders: 0,

    average: 0,

    co2: 0,
  });

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase

      .from("transactions")

      .select(
        `

      id,

      created_at,

      payment_method,

      delivery_method,


      buyer:profiles!transactions_buyer_id_fkey(
        full_name,
        email
      ),


      orders(

        title,

        image_url,

        agreed_price,
        listings(
        gallery_images)

      )


    `,
      )

      .eq("seller_id", user.id)

      .eq("status", "completed")

      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      return;
    }

    setSales(data || []);

    const total = data.reduce(
      (sum, item) => sum + Number(item.orders?.agreed_price || 0),

      0,
    );

    setStats({
      revenue: total,

      orders: data.length,

      average: data.length ? total / data.length : 0,

      // estimated reuse impact

      co2: data.length * 18,
    });

    setLoading(false);
  }

  //Calculate the verfied seller sold items
  const VERIFIED_TARGET = 5;

  const completedSales = stats.orders;

  const badgeProgress = Math.min((completedSales / VERIFIED_TARGET) * 100, 100);

  const salesLeft = Math.max(VERIFIED_TARGET - completedSales, 0);

  const verified = completedSales >= VERIFIED_TARGET;

  // Revenue grouped by month

  const revenueData = useMemo(() => {
    const months = {};

    sales.forEach((sale) => {
      const month = new Date(sale.created_at).toLocaleString("en-US", {
        month: "short",
      });

      months[month] =
        (months[month] || 0) + Number(sale.orders?.agreed_price || 0);
    });

    return Object.entries(months)

      .map(([name, value]) => ({
        name,

        revenue: value,
      }));
  }, [sales]);

  // Sales count chart

  const salesChart = useMemo(() => {
    const result = {};

    sales.forEach((sale) => {
      const month = new Date(sale.created_at).toLocaleString("en-US", {
        month: "short",
      });

      result[month] = (result[month] || 0) + 1;
    });

    return Object.entries(result)

      .map(([name, value]) => ({
        name,

        sales: value,
      }));
  }, [sales]);

  function exportCSV() {
    const rows = [
      ["Item", "Buyer", "Price", "Payment"],

      ...sales.map((item) => [
        item.orders?.title,

        item.buyer?.full_name,

        item.orders?.agreed_price,

        item.payment_method,
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "sales-report.csv";

    link.click();

    URL.revokeObjectURL(url);
  }
  return (
    <div
      className="
    min-h-screen
    flex
    bg-[#FAF7F2]
  "
    >
      {/* SIDEBAR */}

      <SellerSidebar />

      {/* MAIN CONTENT */}

      <main
        className="
      flex-1
      overflow-y-auto
      p-5
      md:p-8
    "
      >
        <div
          className="
        max-w-6xl
        mx-auto
      "
        >
          <div
            className="
        max-w-6xl
        mx-auto
      "
          >
            {/* HEADER */}

            <div
              className="
          flex
          items-center
          justify-between
          mb-7
        "
            >
              <div>
                <h1
                  className="
              text-3xl
              font-serif
              font-semibold
              text-[#1F3D2A]
            "
                >
                  Sales
                </h1>

                <p
                  className="
              text-sm
              text-gray-500
              mt-1
            "
                >
                  Track your furniture sales and impact
                </p>
              </div>

              <button
                onClick={exportCSV}
                className="
              flex
              items-center
              gap-2
              bg-[#1F3D2A]
              text-white
              px-4
              py-2.5
              rounded-xl
              text-sm
              hover:bg-[#294C37]
              transition
            "
              >
                <Download size={16} />
                Export
              </button>
            </div>

            {/* STATS */}

            <div
              className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          mb-6
        "
            >
              <StatCard
                bg="bg-[#FCEDEE]" // pastel pink
                icon={<DollarSign size={18} />}
                title="Revenue"
                value={`€${stats.revenue.toLocaleString()}`}
              />

              <StatCard
                bg="bg-[#FFF6DA]" // pastel yellow
                icon={<ShoppingBag size={18} />}
                title="Sales"
                value={stats.orders}
              />

              <StatCard
                bg="bg-[#FFE9D9]" // pastel orange
                icon={<TrendingUp size={18} />}
                title="Average"
                value={`€${stats.average.toFixed(0)}`}
              />

              <StatCard
                dark
                icon={<Leaf size={18} />}
                title="CO₂ Saved"
                value={`${stats.co2}kg`}
              />
            </div>

            {/* CHART AREA */}

            <div
              className="
          grid
          lg:grid-cols-3
          gap-5
        "
            >
              {/* REVENUE CHART */}

              <div
                className="
            lg:col-span-2
            bg-white
            border
            border-[#E8E2D8]
            rounded-2xl
            p-5
          "
              >
                <div
                  className="
              flex
              justify-between
              items-center
              mb-5
            "
                >
                  <div>
                    <h2
                      className="
                  font-semibold
                  text-[#1F3D2A]
                "
                    >
                      Revenue Overview
                    </h2>

                    <p
                      className="
                  text-xs
                  text-gray-400
                "
                    >
                      Monthly performance
                    </p>
                  </div>
                </div>

                <div
                  className="
              h-[230px]
            "
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid stroke="#eee" vertical={false} />

                      <XAxis dataKey="name" fontSize={12} stroke="#999" />

                      <YAxis fontSize={12} stroke="#999" />

                      <Tooltip formatter={(value) => `€${value}`} />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1F3D2A"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#8B5E3C",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* VERIFIED SELLER PROGRESS */}

              <div
                className="
    bg-[#F5F0EA]
    border
    border-[#E8E2D8]
    rounded-3xl
    p-6
    flex
    flex-col
    justify-between
  "
              >
                <div className="flex justify-center mb-6">
                  <div className="relative w-44 h-44">
                    <svg
                      className="absolute inset-0"
                      width="176"
                      height="176"
                      viewBox="0 0 176 176"
                    >
                      {/* background */}
                      <circle
                        cx="88"
                        cy="88"
                        r="70"
                        fill="none"
                        stroke="#DDD9D2"
                        strokeWidth="10"
                      />

                      {/* progress */}
                      <circle
                        cx="88"
                        cy="88"
                        r="70"
                        fill="none"
                        stroke="#1F3D2A"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * badgeProgress) / 100}
                        transform="rotate(-90 88 88)"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="text-4xl text-[#1F3D2A]">
                        {Math.round(badgeProgress)}%
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Verified Seller
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-3xl text-[#1F3D2A] mb-3">
                    Seller Milestone
                  </h3>

                  {verified ? (
                    <p className="text-gray-700 leading-7">
                      🎉 Congratulations! You have unlocked the
                      <strong> Verified Seller Badge.</strong>
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-700 leading-7">
                        You have completed
                        <span className="font-semibold text-[#1F3D2A]">
                          {" "}
                          {completedSales} / {VERIFIED_TARGET}
                        </span>{" "}
                        required sales.
                      </p>

                      <p className="mt-3 text-sm text-gray-500">
                        Only
                        <span className="font-semibold text-[#1F3D2A]">
                          {" "}
                          {salesLeft}
                        </span>{" "}
                        more {salesLeft === 1 ? "sale" : "sales"} to unlock the
                        <strong> Verified Seller Badge.</strong>
                      </p>
                    </>
                  )}

                  <button
                    className="
        mt-6
        font-playfair
        text-[#1F3D2A]
        underline
        underline-offset-4
      "
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* RECENT ORDERS */}

            <div
              className="
    mt-6
    bg-white
    border
    border-[#E8E2D8]
    rounded-2xl
    overflow-hidden
  "
            >
              {/* HEADER */}

              <div
                className="
      px-6
      py-5
      flex
      items-center
      justify-between
      border-b
      bg-[#1F3D2A]
      border-[#8c8578]
    "
              >
                <h2
                  className="
        text-xl
        font-serif
        font-semibold
        text-[#fbe8d3]
      "
                >
                  Recent Sales
                </h2>

                <div
                  className="
        flex
        items-center
        gap-3
      "
                ></div>
              </div>

              {/* TABLE HEADER */}

              <div
                className="
      hidden
      md:grid
      grid-cols-12
      px-6
      py-4
      bg-[#FAF7F2]
      text-sm
      font-bold
      text-black
    "
              >
                <div className="col-span-4">Item</div>

                <div className="col-span-2">Order ID</div>

                <div className="col-span-2">Date</div>

                <div className="col-span-2">Buyer</div>

                <div className="col-span-1">Payment</div>

                <div className="col-span-1 text-right">Amount</div>
              </div>

              {/* ORDERS */}

              <div
                className="
      divide-y
      divide-[#E8E2D8]
    "
              >
                {loading ? (
                  <div
                    className="
          p-8
          text-center
          text-gray-500
          text-sm
        "
                  >
                    Loading orders...
                  </div>
                ) : sales.length === 0 ? (
                  <div
                    className="
          p-8
          text-center
          text-gray-500
          text-sm
        "
                  >
                    No completed orders yet.
                  </div>
                ) : (
                  sales.map((sale) => {
                    const orderId = sale.id?.slice(0, 6).toUpperCase();

                    return (
                      <div
                        key={sale.id}
                        className="
          grid
          md:grid-cols-12
          items-center
          gap-4
          px-6
          py-5
          hover:bg-[#FAF7F2]
          transition
        "
                      >
                        {/* ITEM */}

                        <div
                          className="
            md:col-span-4
            flex
            items-center
            gap-3
          "
                        >
                          <img
                            src={
                              sale.orders?.listings?.gallery_images ||
                              "/placeholder.png"
                            }
                            className="
              w-16
              h-16
              rounded-lg
              object-cover
            "
                          />

                          <div>
                            <h3
                              className="
                font-semibold
                text-[#1F3D2A]
                text-sm
              "
                            >
                              {sale.orders?.title}
                            </h3>
                          </div>
                        </div>

                        {/* ORDER ID */}

                        <div
                          className="
            md:col-span-2
            text-sm
            text-gray-600
          "
                        >
                          <span className="md:hidden text-gray-400">
                            Order ID:
                          </span>
                          #{orderId}
                        </div>

                        {/* DATE */}

                        <div
                          className="
            md:col-span-2
            text-sm
            text-gray-600
          "
                        >
                          {new Date(sale.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>

                        {/* BUYER */}

                        <div
                          className="
            md:col-span-2
            flex
            items-center
            gap-2
          "
                        >
                          <div
                            className="
              w-8
              h-8
              rounded-full
              bg-[#F6D8D0]
              flex
              items-center
              justify-center
              text-xs
              font-semibold
              text-[#8B5E3C]
            "
                          >
                            {sale.buyer?.full_name?.charAt(0)}
                          </div>

                          <div>
                            <p
                              className="
                text-sm
                text-gray-700
              "
                            >
                              {sale.buyer?.full_name}
                            </p>
                            <p className=" text-xs text-gray-400 ">
                              {sale.buyer?.email}
                            </p>
                          </div>
                        </div>

                        {/* STATUS */}
{/* 
                        <div
                          className="
            md:col-span-1
          "
                        >
                          <span
                            className="
              bg-[#1F3D2A]
              text-white
              text-[10px]
              font-semibold
              px-3
              py-1
              rounded-full
              uppercase
            "
                          >
                            Completed
                          </span>
                        </div> */}
                        <div className=" text-sm ">
                    <p className=" text-gray-700 capitalize mt-1 ">
                      {sale.payment_method?.replace("_", " ")}
                    </p>
                  </div>

                        {/* AMOUNT */}

                       <p className=" text-xl font-semibold text-[#8B5E3C] ">
                      €{sale.orders?.agreed_price}
                    </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}

              <div
                className="
      px-6
      py-4
      bg-[#FAF7F2]
      text-sm
      text-gray-500
    "
              >
                Showing {sales.length} completed orders
              </div>
            </div>
          </div>
        </div>
       
      </main>
    </div>
  );
}
