import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  User,
  LogOut,
  VerifiedIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "../../config/supabaseClient";

export default function SellerSidebar({
  isDeactivated = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(null);

  /*
   * =====================================
   * GET CURRENT USER
   * =====================================
   */
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };

    getCurrentUser();

    /*
     * Listen for login/logout changes.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /*
   * =====================================
   * LOGOUT
   * =====================================
   */
  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout failed:",
        error,
      );
      return;
    }

    navigate("/");
  };

  /*
   * =====================================
   * PROFILE PATH
   * =====================================
   */
  const profilePath = userId
    ? `/profile/${userId}`
    : "/profile";

  /*
   * =====================================
   * NAVIGATION ITEMS
   * =====================================
   */
  const navigationItems = [
    {
      label: "Dashboard",
      mobileLabel: "Dashboard",
      icon: LayoutDashboard,
      path: userId
        ? `/seller/${userId}`
        : "/seller",
      allowWhenDeactivated: false,
    },
    {
      label: "Sales History",
      mobileLabel: "Sales",
      icon: ClipboardList,
      path: "/seller/sales",
      allowWhenDeactivated: false,
    },
    {
      label: "Messages",
      mobileLabel: "Messages",
      icon: MessageSquare,
      path: "/message",
      allowWhenDeactivated: false,
    },
    {
      label: "Seller Verification",
      mobileLabel: "Verify",
      icon: VerifiedIcon,
      path: "/seller-verification",
      allowWhenDeactivated: false,
    },
    {
      label: "Profile",
      mobileLabel: "Profile",
      icon: User,
      path: profilePath,
      allowWhenDeactivated: true,
    },
  ];

  /*
   * =====================================
   * CHECK ACTIVE ROUTE
   * =====================================
   */
  const isActive = (path) => {
    if (
      path === "/seller" ||
      path.startsWith("/seller/")
    ) {
      return (
        location.pathname === path ||
        location.pathname.startsWith(
          path,
        )
      );
    }

    if (
      path === "/profile" ||
      path.startsWith("/profile/")
    ) {
      return location.pathname.startsWith(
        "/profile",
      );
    }

    return location.pathname.startsWith(
      path,
    );
  };

  /*
   * =====================================
   * NAVIGATE
   * =====================================
   */
  const handleNavigation = (item) => {
    /*
     * If seller is deactivated,
     * only Profile is allowed.
     */
    if (
      isDeactivated &&
      !item.allowWhenDeactivated
    ) {
      return;
    }

    navigate(item.path);
  };

  return (
    <>
      {/* =====================================
          DESKTOP SIDEBAR
          ===================================== */}

      <aside
        className="
          hidden
          md:flex
          w-64
          min-w-64
          h-screen
          sticky
          top-0
          bg-[#fcf4e6]
          border-r
          flex-col
          justify-between
          p-5
          flex-shrink-0
        "
      >
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const active = isActive(
              item.path,
            );

            const disabled =
              isDeactivated &&
              !item.allowWhenDeactivated;

            return (
              <button
                key={item.label}
                type="button"
                disabled={disabled}
                onClick={() =>
                  handleNavigation(item)
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  transition-colors

                  ${
                    disabled
                      ? "text-gray-400 opacity-50 cursor-not-allowed"
                      : active
                      ? "bg-[#1F3D2A] text-white"
                      : "text-gray-700 hover:bg-[#f3eadb]"
                  }
                `}
              >
                <Icon size={18} />

                <span>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* =====================================
            LOGOUT
            ALWAYS ENABLED
            ===================================== */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2
            text-red-500
            hover:bg-red-50
            px-3
            py-2
            rounded-lg
            transition-colors
          "
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </aside>

      {/* =====================================
          MOBILE LOGOUT
          ALWAYS ENABLED
          ===================================== */}

      <button
        type="button"
        onClick={handleLogout}
        className="
          fixed
          bottom-[4.5rem]
          right-4
          md:hidden
          z-50
          flex
          items-center
          gap-2
          bg-white
          border
          border-red-100
          text-red-500
          shadow-md
          px-3
          py-2
          rounded-lg
          text-sm
        "
      >
        <LogOut size={17} />

        <span>Logout</span>
      </button>

      {/* =====================================
          MOBILE BOTTOM NAVIGATION
          ===================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          md:hidden
          h-16
          bg-[#fcf4e6]
          border-t
          flex
          items-center
          justify-around
          z-50
          px-1
          sm:px-3
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const active = isActive(
            item.path,
          );

          const disabled =
            isDeactivated &&
            !item.allowWhenDeactivated;

          return (
            <button
              key={item.label}
              type="button"
              disabled={disabled}
              onClick={() =>
                handleNavigation(item)
              }
              className={`
                flex
                flex-col
                items-center
                justify-center
                text-xs
                min-w-0
                flex-1
                h-full
                px-1
                transition-colors

                ${
                  disabled
                    ? "text-gray-400 opacity-40 cursor-not-allowed"
                    : active
                    ? "text-[#1F3D2A]"
                    : "text-gray-600"
                }
              `}
            >
              <Icon
                size={22}
                strokeWidth={
                  active && !disabled
                    ? 2.5
                    : 2
                }
              />

              <span className="mt-1 whitespace-nowrap">
                {item.mobileLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
