import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  ShieldCheck,
  ClipboardList,
  Activity,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { logoutAdmin } from "../auth/adminAuth";

export default function AdminSidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutAdmin();

    navigate("/admin/login");
  }

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={18} />,
    },

    {
      name: "Listings",
      path: "/admin/listings",
      icon: <Package size={18} />,
    },

    {
      name: "Reports",
      path: "/admin/reports",
      icon: <Flag size={18} />,
    },

    {
      name: "Seller Verification",
      path: "/admin/verification",
      icon: <ShieldCheck size={18} />,
    },

    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <ClipboardList size={18} />,
    },

    {
      name: "System Activity",
      path: "/admin/activity",
      icon: <Activity size={18} />,
    },
  ];

  return (
    <aside
      className="
w-64
bg-[#1F3D2A]
text-white
flex
flex-col
border-r
border-[#294C37]
min-h-screen
"
    >
      {/* LOGO */}

      <div
        className="
px-6
py-6
border-b
border-white/10
"
      >
        <h1
          className="
text-2xl
font-serif
font-semibold
"
        >
          Sustain
          <span className="text-[#C89A63]">Space</span>
        </h1>

        <p
          className="
text-xs
text-green-100
mt-1
"
        >
          Administrator Portal
        </p>
      </div>

      {/* MENU */}

      <nav
        className="
flex-1
p-4
space-y-1
"
      >
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
flex
items-center
gap-3
px-4
py-3
rounded-xl
text-sm
transition

${isActive ? "bg-[#C89A63] text-white" : "hover:bg-white/10 text-green-50"}

`
            }
          >
            {item.icon}

            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}

      <div
        className="
p-4
border-t
border-white/10
"
      >
        <button
          onClick={handleLogout}
          className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
text-sm
hover:bg-white/10
transition
"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
