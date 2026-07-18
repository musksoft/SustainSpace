import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function SellerSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      navigate("/");
    }
  };

  return (
    <aside className="hidden md:flex w-64 bg-[#fcf4e6] border-r flex-col justify-between p-5">
      <div>
        <div className="text-2xl font-serif font-semibold text-[#1F3D2A] mb-8">
          Sustain<span className="text-[#8B5E3C]">Space</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => navigate("/seller")}
            className="w-full flex items-center gap-3 bg-[#1F3D2A] text-white px-4 py-3 rounded-lg"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/seller/sales")}
            className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg"
          >
            <ClipboardList size={18} />
            Sales History
          </button>

          <button
            onClick={() => navigate("/message")}
            className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg"
          >
            <MessageSquare size={18} />
            Messages
          </button>

          <button
            onClick={() => navigate("/profile/:id")}
            className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg"
          >
            <User size={18} />
            Profile
          </button>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
