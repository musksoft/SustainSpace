import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  ShieldCheck,
  ClipboardList,
  Activity,
  Search,
  Bell,
  Settings,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-stone-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className={`${color} p-4 rounded-xl text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex">

      {/* SIDEBAR */}

      <aside className="w-72 bg-[#17392B] text-white flex flex-col">

        <div className="px-8 py-7 border-b border-white/10">

          <h1 className="text-3xl font-serif">
            Sustain<span className="text-[#C89A63]">Space</span>
          </h1>

          <p className="text-green-100 text-sm mt-2">
            Administrator Portal
          </p>

        </div>

        <div className="flex-1 p-5 space-y-2">

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "dashboard"
                ? "bg-[#C89A63] text-white"
                : "hover:bg-white/10"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "users"
                ? "bg-[#C89A63]"
                : "hover:bg-white/10"
            }`}
          >
            <Users size={20} />
            Users
          </button>

          <button
            onClick={() => setActiveTab("listings")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "listings"
                ? "bg-[#C89A63]"
                : "hover:bg-white/10"
            }`}
          >
            <Package size={20} />
            Listings
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "reports"
                ? "bg-[#C89A63]"
                : "hover:bg-white/10"
            }`}
          >
            <Flag size={20} />
            Reports
          </button>

          <button
            onClick={() => setActiveTab("verification")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "verification"
                ? "bg-[#C89A63]"
                : "hover:bg-white/10"
            }`}
          >
            <ShieldCheck size={20} />
            Seller Verification
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "transactions"
                ? "bg-[#C89A63]"
                : "hover:bg-white/10"
            }`}
          >
            <ClipboardList size={20} />
            Transactions
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
              activeTab === "activity"
                ? "bg-[#C89A63]"
                : "hover:bg-white/10"
            }`}
          >
            <Activity size={20} />
            System Activity
          </button>

        </div>

      </aside>

      {/* CONTENT */}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 bg-[#FAF7F2] overflow-y-auto">

        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-serif text-[#1F3D2A]">
              Admin Control Center
            </h1>

            <p className="text-gray-500 mt-2">
              Manage users, listings and marketplace activities.
            </p>
          </div>

          <button
            className="
            bg-[#1F3D2A]
            text-white
            px-6
            py-3
            rounded-xl
            hover:bg-[#16362D]
            "
          >
            Generate Report
          </button>

        </div>


        {/* Statistics */}

        <div className="grid grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <p className="text-sm text-gray-500">
              Registered Users
            </p>

            <h2 className="text-4xl font-bold mt-3 text-[#1F3D2A]">
              2,451
            </h2>

            <p className="text-green-600 mt-2 text-sm">
              ↑ 8% this month
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <p className="text-sm text-gray-500">
              Active Listings
            </p>

            <h2 className="text-4xl font-bold mt-3 text-[#1F3D2A]">
              518
            </h2>

            <p className="text-green-600 mt-2 text-sm">
              34 added today
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Reports
            </p>

            <h2 className="text-4xl font-bold mt-3 text-red-600">
              12
            </h2>

            <p className="text-red-500 mt-2 text-sm">
              Needs attention
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <p className="text-sm text-gray-500">
              Secure Transactions
            </p>

            <h2 className="text-4xl font-bold mt-3 text-[#1F3D2A]">
              846
            </h2>

            <p className="text-green-600 mt-2 text-sm">
              +18 today
            </p>
          </div>

        </div>


        {/* Pending Verifications */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">

          <div className="flex justify-between mb-5">

            <h2 className="text-2xl font-serif">
              Seller Verification Requests
            </h2>

            <button className="text-[#1F3D2A]">
              View All
            </button>

          </div>

          <table className="w-full">

            <thead className="border-b">

              <tr className="text-left text-gray-500">

                <th className="pb-3">Seller</th>
                <th>ID Proof</th>
                <th>Transactions</th>
                <th>Status</th>
                <th></th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b">

                <td className="py-4 font-medium">
                  Sarah Johnson
                </td>

                <td>Uploaded</td>

                <td>7</td>

                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    Pending
                  </span>
                </td>

                <td className="space-x-2">

                  <button className="bg-[#1F3D2A] text-white px-4 py-2 rounded-lg">
                    Approve
                  </button>

                  <button className="border px-4 py-2 rounded-lg">
                    Reject
                  </button>

                </td>

              </tr>

              <tr>

                <td className="py-4 font-medium">
                  Daniel Lee
                </td>

                <td>Uploaded</td>

                <td>11</td>

                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Ready
                  </span>
                </td>

                <td>

                  <button className="bg-[#1F3D2A] text-white px-4 py-2 rounded-lg">
                    Verify Seller
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* Reported Listings */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">

          <div className="flex justify-between mb-5">

            <h2 className="text-2xl font-serif">
              Reported Listings
            </h2>

            <button className="text-[#1F3D2A]">
              View Reports
            </button>

          </div>

          <div className="space-y-4">

            <div className="border rounded-xl p-5 flex justify-between">

              <div>

                <h3 className="font-semibold">
                  Vintage Oak Chair
                </h3>

                <p className="text-gray-500">
                  Reported for misleading images
                </p>

              </div>

              <div className="space-x-3">

                <button className="border px-4 py-2 rounded-lg">
                  Review
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Remove
                </button>

              </div>

            </div>

            <div className="border rounded-xl p-5 flex justify-between">

              <div>

                <h3 className="font-semibold">
                  Leather Sofa
                </h3>

                <p className="text-gray-500">
                  Spam Listing
                </p>

              </div>

              <div className="space-x-3">

                <button className="border px-4 py-2 rounded-lg">
                  Review
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Remove
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* Activity Feed */}

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <h2 className="text-2xl font-serif mb-6">
              Recent Activity
            </h2>

            <div className="space-y-5">

              <div>
                <p className="font-medium">
                  Emily uploaded a new listing
                </p>

                <span className="text-sm text-gray-500">
                  10 minutes ago
                </span>
              </div>

              <div>
                <p className="font-medium">
                  James completed a secure transaction
                </p>

                <span className="text-sm text-gray-500">
                  35 minutes ago
                </span>
              </div>

              <div>
                <p className="font-medium">
                  Listing reported by buyer
                </p>

                <span className="text-sm text-gray-500">
                  1 hour ago
                </span>
              </div>

              <div>
                <p className="font-medium">
                  Seller verification approved
                </p>

                <span className="text-sm text-gray-500">
                  2 hours ago
                </span>
              </div>

            </div>

          </div>


          {/* Marketplace Overview */}

          <div className="bg-[#1F3D2A] rounded-2xl p-8 text-white">

            <h2 className="text-3xl font-serif mb-5">
              Marketplace Health
            </h2>

            <div className="space-y-5">

              <div>

                <p className="text-green-200">
                  Verified Sellers
                </p>

                <h3 className="text-4xl font-bold">
                  74%
                </h3>

              </div>

              <div>

                <p className="text-green-200">
                  Successful Deliveries
                </p>

                <h3 className="text-4xl font-bold">
                  97%
                </h3>

              </div>

              <div>

                <p className="text-green-200">
                  Buyer Satisfaction
                </p>

                <h3 className="text-4xl font-bold">
                  4.9 ★
                </h3>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

