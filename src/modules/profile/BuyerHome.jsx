import { Bell, Search } from "lucide-react";
import { assets } from "../../assets/assets";

export default function BuyerHome({ profile }) {
  return (
    <main
      className="
        flex-1
        bg-[#FAF7F2]
        overflow-y-auto
      "
    >
      {/* GREEN HEADER */}

      <header className="hidden md:flex bg-[#1F3D2A] text-white px-8 py-5 items-center justify-between">
        {" "}
        <div>
          <p className="font-playfair italic text-lg text-[#FFF9F3]">
            Ready to rehome your furniture,
          </p>
          <h1 className="text-2xl font-semibold">
            {profile?.full_name || "User"}
          </h1>{" "}
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} />
          <div className="w-9 h-9 bg-white text-[#1F3D2A] rounded-full flex items-center justify-center font-semibold">
            {profile?.full_name?.charAt(0) || "U"}
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}

      <div
        className="
          p-8
          space-y-4
        "
      >
        {/* TITLE */}

        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-[#8B5E3C]
            "
          >
            BUYER DASHBOARD
          </h2>
        </div>

        {/* SEARCH */}

        <div
          className="
            relative
            mb-3
          "
        >
         

      
        </div>

        {/* IMPACT CARD */}

        <section
          className="
            bg-[#31523F]
            rounded-xl
            p-7
            text-white
            relative
            overflow-hidden
          "
        >
          <img
            src={assets.leafbanner}
            className="
              absolute
              right-0
              bottom-0
              w-56
              opacity-30
            "
          />

          <div className="relative z-10">
            <h2
              className="
                font-serif
                text-3xl
                mb-3
              "
            >
              Your Impact
            </h2>

            <p
              className="
                text-sm
                text-gray-300
                max-w-md
                leading-relaxed
              "
            >
              By choosing curated pre-owned furniture, you've significantly
              reduced your environmental footprint this year.
            </p>

            <div
              className="
                flex
                gap-14
                mt-8
              "
            >
              <div>
                <h3
                  className="
                    text-3xl
                    font-bold
                  "
                >
                  34kg
                </h3>

                <p
                  className="
                    text-xs
                    text-gray-300
                  "
                >
                  CO₂ SAVED
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-3xl
                    font-bold
                  "
                >
                  12
                </h3>

                <p
                  className="
                    text-xs
                    text-gray-300
                  "
                >
                  TREES PLANTED
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
