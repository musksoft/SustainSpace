import { useEffect, useState } from "react";
import {
  Search,
  User,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Eye,
} from "lucide-react";

import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  }

  const filteredUsers = users.filter((user) => {
    const value = `
      ${user.full_name}
      ${user.email}
      ${user.role}
    `.toLowerCase();

    return value.includes(search.toLowerCase());
  });

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
              Users Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage marketplace accounts.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}

            <div className="bg-white rounded-xl border px-4 py-3 flex items-center gap-2">
              <Search size={18} className="text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="outline-none text-sm w-56 bg-transparent"
              />
            </div>

            {/* Total */}

            <div className="bg-white rounded-xl border px-5 py-3">
              <p className="text-xs text-gray-500">
                Total Users
              </p>

              <h2 className="text-2xl font-bold text-[#1F3D2A]">
                {users.length}
              </h2>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F7F5F1] border-b">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold">
                      User
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Role
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      View
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="
                        border-b
                        hover:bg-[#FAF7F2]
                        transition
                      "
                    >
                      {/* USER */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                              w-12
                              h-12
                              rounded-full
                              bg-[#F5E6D3]
                              flex
                              items-center
                              justify-center
                              text-[#1F3D2A]
                              font-semibold
                              text-lg
                            "
                          >
                            {user.full_name?.charAt(0)}
                          </div>

                          <div>
                            <h3 className="font-semibold text-[#1F3D2A]">
                              {user.full_name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {user.email}
                        </span>
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "seller"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        {user.role === "seller" ? (
                          user.is_verified_seller ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <ShieldCheck size={16} />
                              Verified
                            </span>
                          ) : (
                            <span className="text-yellow-600">
                              Pending
                            </span>
                          )
                        ) : (
                          <span className="text-gray-500">
                            Buyer
                          </span>
                        )}
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>

                      {/* VIEW */}

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedUser(user)}
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

        {/* USER DETAILS MODAL */}

        {selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-[450px] p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[#1F3D2A]">
                  User Details
                </h2>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#F5E6D3] flex items-center justify-center text-3xl font-bold text-[#1F3D2A]">
                  {selectedUser.full_name?.charAt(0)}
                </div>

                <h3 className="mt-4 text-xl font-semibold text-[#1F3D2A]">
                  {selectedUser.full_name}
                </h3>

                <span
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.role === "seller"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedUser.role}
                </span>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  {selectedUser.email}
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  {selectedUser.phone || "No phone"}
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  {selectedUser.location || "No location"}
                </div>

                <div className="flex items-center gap-3">
                  <User size={18} />
                  Joined{" "}
                  {new Date(
                    selectedUser.created_at
                  ).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />

                  {selectedUser.role === "seller"
                    ? selectedUser.is_verified_seller
                      ? "Verified Seller"
                      : "Verification Pending"
                    : "Buyer Account"}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="
                    bg-[#1F3D2A]
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    hover:bg-[#294C37]
                    transition
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}