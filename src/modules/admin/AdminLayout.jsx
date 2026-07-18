import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Flag,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-[#F6F4F1]">
      {/* SIDEBAR */}
      <aside
        className="
w-64
bg-[#EFE9DF]
border-r
p-6
hidden md:block
"
      >
        <h1
          className="
text-2xl
font-serif
text-[#16362D]
mb-8
"
        >
          SustainSpace
        </h1>

        <p className="text-xs text-gray-500 mb-5">ADMIN PANEL</p>

        <div className="space-y-2">
          <button className="w-full flex gap-3 items-center bg-[#16362D] text-white p-3 rounded-lg">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="w-full flex gap-3 items-center p-3 hover:bg-white rounded-lg">
            <ShieldCheck size={18} />
            Seller Verification
          </button>

          <button className="w-full flex gap-3 items-center p-3 hover:bg-white rounded-lg">
            <Users size={18} />
            Users
          </button>

          <button className="w-full flex gap-3 items-center p-3 hover:bg-white rounded-lg">
            <ClipboardList size={18} />
            Listings
          </button>

          <button className="w-full flex gap-3 items-center p-3 hover:bg-white rounded-lg">
            <Flag size={18} />
            Reports
          </button>

          <button className="w-full flex gap-3 items-center p-3 hover:bg-white rounded-lg">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div className="flex-1">
        <header
          className="
h-20
bg-white
border-b
flex
items-center
justify-between
px-8
"
        >
          <input
            placeholder="Search system logs..."
            className="
bg-[#EFE9DF]
rounded-full
px-5
py-2
w-80
outline-none
"
          />

          <div
            className="
            w-10
            h-10
            rounded-full
            bg-[#16362D]
            text-white
            flex
            items-center
            justify-center
            "
          >
            A
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
