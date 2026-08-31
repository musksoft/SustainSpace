
import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navClass = (path) =>
    location.pathname === path
      ? "text-[#18392B] border-b border-[#18392B] pb-1"
      : "pb-1 hover:text-[#18392B] transition-colors";

  const mobileNavClass = (path) =>
    location.pathname === path
      ? "text-[#18392B] bg-[#F3F1EC]"
      : "text-[#4F4A45] hover:bg-[#F8F6F2]";

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
      } else {
        setProfile(null);
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

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const goToProfile = () => {
    if (!user || !profile) return;

    if (profile.role === "seller") {
      const slug = profile.full_name
        ?.toLowerCase()
        .replace(/\s+/g, "-");

      navigate(`/seller/${user.id}`);
    } else {
      navigate(`/buyer/${user.id}`);
    }

    setMobileMenuOpen(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="relative w-full bg-[#f6eee3] border-b border-[#E8E3DC] z-50">
      {/* =========================
          MAIN NAVBAR
          ========================= */}
      <div className="w-full px-6 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto h-[82px] flex items-center justify-between">
          {/* LOGO */}
          <h1
            onClick={() => navigateTo("/")}
            className="cursor-pointer flex-shrink-0"
          >
            <img
              src={assets.logo}
              alt="SustainSpace"
              className="h-[42px] sm:h-[50px] w-auto"
            />
          </h1>

          {/* =========================
              DESKTOP NAVIGATION
              ========================= */}
          <div className="hidden md:flex items-center gap-8 text-sm text-[#4F4A45]">
            <button
              onClick={() => navigateTo("/shop")}
              className={navClass("/shop")}
            >
              Shop
            </button>

            <button
              onClick={() => navigateTo("/sell")}
              className={navClass("/sell")}
            >
              Sell
            </button>

            <button
              onClick={() => navigateTo("/buyer-guide")}
              className={navClass("/buyer-guide")}
            >
              Buyer Guide
            </button>

            <button
              onClick={() => navigateTo("/sustainability")}
              className={navClass("/sustainability")}
            >
              Sustainability
            </button>

            {user && profile ? (
              <button
                onClick={goToProfile}
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-[#18392B]
                  text-white
                  font-semibold
                  flex
                  items-center
                  justify-center
                  text-lg
                  hover:bg-[#102A20]
                  transition-colors
                "
                aria-label="Open profile"
              >
                {profile.full_name?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => navigateTo("/auth")}
                className="
                  px-5
                  py-2.5
                  rounded-full
                  bg-[#18392B]
                  text-white
                  hover:bg-[#102A20]
                  transition-colors
                "
              >
                Login / Register
              </button>
            )}
          </div>

          {/* =========================
              MOBILE RIGHT SIDE
              ========================= */}
          <div className="md:hidden flex items-center gap-3">
            {/* PROFILE */}
            {user && profile && (
              <button
                onClick={goToProfile}
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-[#18392B]
                  text-white
                  font-semibold
                  flex
                  items-center
                  justify-center
                  text-base
                "
                aria-label="Open profile"
              >
                {profile.full_name?.charAt(0).toUpperCase()}
              </button>
            )}

            {/* HAMBURGER */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="
                w-10
                h-10
                rounded-lg
                flex
                items-center
                justify-center
                text-[#18392B]
                hover:bg-[#F3F1EC]
                transition-colors
              "
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={25} strokeWidth={2} />
              ) : (
                <Menu size={25} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
          ========================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E3DC] bg-[#FFFDF9] shadow-sm">
          <div className="px-4 py-4 space-y-1">
            <button
              onClick={() => navigateTo("/shop")}
              className={`
                ${mobileNavClass("/shop")}
                w-full
                text-left
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium
                transition-colors
              `}
            >
              Shop
            </button>

            <button
              onClick={() => navigateTo("/sell")}
              className={`
                ${mobileNavClass("/sell")}
                w-full
                text-left
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium
                transition-colors
              `}
            >
              Sell
            </button>

            <button
              onClick={() => navigateTo("/buyer-guide")}
              className={`
                ${mobileNavClass("/buyer-guide")}
                w-full
                text-left
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium
                transition-colors
              `}
            >
              Buyer Guide
            </button>

            <button
              onClick={() => navigateTo("/sustainability")}
              className={`
                ${mobileNavClass("/sustainability")}
                w-full
                text-left
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium
                transition-colors
              `}
            >
              Sustainability
            </button>

            {/* MOBILE ACCOUNT */}
            <div className="pt-3 mt-3 border-t border-[#E8E3DC]">
              {user && profile ? (
                <button
                  onClick={goToProfile}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    text-left
                    hover:bg-[#F8F6F2]
                    transition-colors
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-[#18392B]
                      text-white
                      flex
                      items-center
                      justify-center
                      font-semibold
                    "
                  >
                    {profile.full_name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#18392B]">
                      {profile.full_name}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                      {profile.role} profile
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo("/auth")}
                  className="
                    w-full
                    bg-[#18392B]
                    text-white
                    py-3
                    rounded-lg
                    text-sm
                    font-semibold
                    hover:bg-[#102A20]
                    transition-colors
                  "
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

