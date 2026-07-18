import  { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const navClass = (path) =>
    location.pathname === path
      ? "text-[#18392B] border-b border-[#18392B] pb-1"
      : "pb-1 hover:text-[#18392B] transition-colors";

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        setProfile(data);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="border-b border-[#E7DED2] bg-[#F7F3EE] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 onClick={() => navigate("/")} className="cursor-pointer">
          <img src={assets.logo} alt="" className="h-[50px]" />
        </h1>

        <div className="hidden md:flex items-center gap-10 text-sm text-[#4F4A45]">
          <button
            onClick={() => navigate("/shop")}
            className={navClass("/shop")}
          >
            Shop
          </button>

          <button
            onClick={() => navigate("/sell")}
            className={navClass("/sell")}
          >
            Sell
          </button>

          <button
            onClick={() => navigate("/sustainability")}
            className={navClass("/sustainability")}
          >
            Sustainability
          </button>

        {user && profile ? (
  <button
    onClick={() => {
      if (profile.role === "seller") {
        const slug = profile.full_name
          .toLowerCase()
          .replace(/\s+/g, "-");

        navigate(`/seller/${user.id}/${slug}`);
      } else {
        navigate(`/buyer/${user.id}`);
      }
    }}
    className="w-9 h-9 rounded-full bg-[#18392B] text-white font-semibold flex items-center justify-center text-lg"
  >
    {profile.full_name?.charAt(0).toUpperCase()}
  </button>
) : (
  <button
    onClick={() => navigate("/auth")}
    className="
      bg-[#18392B]
      text-white
      px-6
      py-2.5
      rounded-full
      font-medium
      shadow-md
      hover:bg-[#145C35]
      hover:shadow-lg
    
    "
  >
    Login / Register
  </button>
)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
