import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { Search, MapPin, Tag, Sparkles } from "lucide-react";
import Footer from "./Footer";

export default function ShopPage() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const [showcaseModal, setShowcaseModal] = useState(null);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  /*
   * ============================================================
   * CURATED SHOWCASE ITEMS
   * ============================================================
   */

  const showcaseItems = [
    {
      id: "showcase-1",
      title: "Nordic Velvet Sofa",
      category: "Sofas",
      price: 1240,
      status: "available",
      item_condition: "Excellent",
      location: "Copenhagen",
      material: "Velvet",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
      description:
        "Elegant velvet sofa restored using sustainable materials.",
    },

    {
      id: "showcase-2",
      title: "Hand-Carved Oak Table",
      category: "Tables",
      price: 2800,
      status: "sold",
      item_condition: "Excellent",
      location: "Amsterdam",
      material: "Solid Oak",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      description:
        "Beautiful reclaimed oak dining table crafted by artisans.",
    },

    {
      id: "showcase-3",
      title: "Art Lounge Chair",
      category: "Chairs",
      price: 850,
      status: "available",
      item_condition: "Good",
      location: "Berlin",
      material: "Linen",
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200",
      description:
        "Contemporary lounge chair with premium upholstery.",
    },

    {
      id: "showcase-4",
      title: "Walnut Floating Console",
      category: "Storage",
      price: 1100,
      status: "available",
      item_condition: "Excellent",
      location: "Paris",
      material: "Walnut",
      image:
        "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200",
      description:
        "Minimal floating console built from reclaimed walnut.",
    },

    {
      id: "showcase-5",
      title: "Cedar Platform Bed",
      category: "Storage",
      price: 1950,
      status: "available",
      item_condition: "New",
      location: "Stockholm",
      material: "Cedar Wood",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      description:
        "Handcrafted cedar platform bed with timeless design.",
    },

    {
      id: "showcase-6",
      title: "Hand-Woven Rattan Chair",
      category: "Chairs",
      price: 420,
      status: "available",
      item_condition: "Fair",
      location: "Lisbon",
      material: "Rattan",
      image:
        "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200",
      description:
        "Vintage rattan chair carefully restored by artisans.",
    },
  ];

  /*
   * ============================================================
   * LOAD LISTINGS
   * ============================================================
   */

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setListings(data || []);
    } catch (err) {
      console.error(
        "Error loading listings:",
        err,
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ============================================================
   * CATEGORY FILTER
   * ============================================================
   */

  function toggleCategory(category) {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter(
            (item) => item !== category,
          )
        : [...previous, category],
    );
  }

  /*
   * ============================================================
   * COMBINE LIVE + SHOWCASE ITEMS
   * ============================================================
   */

  const allItems = [
    ...listings,
    ...showcaseItems,
  ];

  /*
   * ============================================================
   * FILTER ITEMS
   * ============================================================
   */

  const filteredItems = allItems.filter(
    (item) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        item.title
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText) ||
        item.description
          ?.toLowerCase()
          .includes(searchText) ||
        item.location
          ?.toLowerCase()
          .includes(searchText) ||
        item.material
          ?.toLowerCase()
          .includes(searchText);

      const matchesLocation =
        !locationFilter ||
        item.location
          ?.toLowerCase()
          .includes(
            locationFilter
              .toLowerCase(),
          );

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          item.category,
        );

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      const matchesCondition =
        conditionFilter === "all" ||
        item.item_condition
          ?.toLowerCase() ===
          conditionFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesStatus &&
        matchesCondition
      );
    },
  );

  /*
   * ============================================================
   * CONDITION STYLE
   * ============================================================
   */

  const getConditionStyle = (
    condition,
  ) => {
    switch (
      condition?.toLowerCase()
    ) {
      case "new":
        return "bg-green-100 text-green-700";

      case "excellent":
        return "bg-emerald-100 text-emerald-700";

      case "good":
        return "bg-blue-100 text-blue-700";

      case "fair":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /*
   * ============================================================
   * STATUS STYLE
   * ============================================================
   */

  const getStatusStyle = (status) => {
    switch (status) {
      case "sold":
        return "bg-stone-600";

      case "reserved":
        return "bg-yellow-600";

      case "available":
        return "bg-[#16362D]";

      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4F1]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-10">
          <h1 className="text-4xl font-serif text-[#16362D]">
            Sustain Finds
          </h1>

          <p className="text-gray-500 mt-3 text-base">
            Discover pre-loved furniture pieces
            ready for a new story.
          </p>
        </div>

        <div className="flex gap-8">

          {/* ===================================================
              SIDEBAR
          ==================================================== */}

          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl border p-5 sticky top-6">

              {/* LOCATION */}

              <h3 className="font-semibold mb-4">
                Find Near
              </h3>

              <div className="relative">
                <MapPin
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  placeholder="City or Zip"
                  value={locationFilter}
                  onChange={(e) =>
                    setLocationFilter(
                      e.target.value,
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    p-2
                    pl-9
                    outline-none
                    focus:border-[#16362D]
                  "
                />
              </div>

              {/* CATEGORIES */}

              <div className="mt-8">
                <h3 className="font-semibold mb-3">
                  Categories
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    "Tables",
                    "Chairs",
                    "Sofas",
                    "Storage",
                  ].map(
                    (category) => (
                      <label
                        key={category}
                        className="
                          flex
                          items-center
                          cursor-pointer
                        "
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(
                            category,
                          )}
                          onChange={() =>
                            toggleCategory(
                              category,
                            )
                          }
                          className="accent-[#16362D]"
                        />

                        <span className="ml-2">
                          {category}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* CONDITION */}

              <div className="mt-8">
                <h3 className="font-semibold mb-3">
                  Condition
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    "New",
                    "Excellent",
                    "Good",
                    "Fair",
                  ].map(
                    (condition) => (
                      <label
                        key={condition}
                        className="
                          flex
                          items-center
                          cursor-pointer
                        "
                      >
                        <input
                          type="radio"
                          name="condition"
                          checked={
                            conditionFilter ===
                            condition
                          }
                          onChange={() =>
                            setConditionFilter(
                              condition,
                            )
                          }
                          className="accent-[#16362D]"
                        />

                        <span className="ml-2">
                          {condition}
                        </span>
                      </label>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setConditionFilter(
                        "all",
                      )
                    }
                    className="
                      text-xs
                      text-[#16362D]
                      font-medium
                      hover:underline
                    "
                  >
                    Clear condition
                  </button>
                </div>
              </div>

            </div>
          </aside>

          {/* ===================================================
              MAIN
          ==================================================== */}

          <div className="flex-1 min-w-0">

            {/* SEARCH + STATUS */}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">

              <div
                className="
                  flex
                  items-center
                  flex-1
                  bg-white
                  border
                  rounded-xl
                  px-5
                  shadow-sm
                "
              >
                <Search
                  size={20}
                  className="text-gray-400 mr-3"
                />

                <input
                  placeholder="Search furniture, materials, styles..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value,
                    )
                  }
                  className="
                    w-full
                    py-3
                    outline-none
                    text-sm
                    bg-transparent
                  "
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value,
                  )
                }
                className="
                  bg-white
                  border
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  outline-none
                "
              >
                <option value="all">
                  All Items
                </option>

                <option value="available">
                  Available
                </option>

                <option value="reserved">
                  Reserved
                </option>

                <option value="sold">
                  Sold
                </option>
              </select>

            </div>

            {/* RESULT COUNT */}

            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-gray-500">
                {filteredItems.length}{" "}
                {filteredItems.length === 1
                  ? "piece"
                  : "pieces"}{" "}
                found
              </p>

              {(search ||
                locationFilter ||
                selectedCategories.length >
                  0 ||
                statusFilter !== "all" ||
                conditionFilter !==
                  "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setLocationFilter("");
                    setSelectedCategories(
                      [],
                    );
                    setStatusFilter("all");
                    setConditionFilter(
                      "all",
                    );
                  }}
                  className="
                    text-sm
                    text-[#16362D]
                    font-medium
                    hover:underline
                  "
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* =================================================
                LISTINGS
            ================================================== */}

            {loading ? (
              <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
                Loading furniture...
              </div>
            ) : filteredItems.length ===
              0 ? (
              <div className="bg-white border rounded-xl p-10 text-center">
                <h3 className="font-semibold text-lg">
                  No furniture found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try changing your search or
                  filters.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredItems.map(
                  (item) => {
                    const isLive =
                      !item.image;

                    /*
                     * Supabase listings store images
                     * inside gallery_images.
                     */

                    const image =
                      isLive
                        ? Array.isArray(
                            item.gallery_images,
                          )
                          ? item
                              .gallery_images[0]
                          : item.featured_image
                        : item.image;

                    return (
                      <div
                        key={item.id}
                        className="
                          bg-white
                          rounded-2xl
                          overflow-hidden
                          border
                          hover:shadow-xl
                          transition
                          cursor-pointer
                          group
                        "
                        onClick={() => {
                          if (isLive) {
                            navigate(
                              `/listing/${item.id}`,
                            );
                          } else {
                            setShowcaseModal(
                              item,
                            );
                          }
                        }}
                      >

                        {/* IMAGE */}

                        <div className="relative overflow-hidden">
                          <img
                            src={
                              image ||
                              "https://placehold.co/600x400?text=Furniture"
                            }
                            alt={
                              item.title
                            }
                            className="
                              h-64
                              w-full
                              object-cover
                              group-hover:scale-105
                              transition-transform
                              duration-500
                            "
                          />

                          {/* STATUS */}

                          <span
                            className={`
                              absolute
                              top-3
                              left-3
                              px-3
                              py-1
                              text-xs
                              rounded-full
                              text-white
                              font-medium
                              ${getStatusStyle(
                                item.status,
                              )}
                            `}
                          >
                            {(
                              item.status ||
                              "available"
                            ).toUpperCase()}
                          </span>

                          {/* CONDITION */}

                          {item.item_condition && (
                            <span
                              className={`
                                absolute
                                top-3
                                right-3
                                px-3
                                py-1
                                text-xs
                                rounded-full
                                font-medium
                                ${getConditionStyle(
                                  item.item_condition,
                                )}
                              `}
                            >
                              {
                                item.item_condition
                              }
                            </span>
                          )}
                        </div>

                        {/* CARD CONTENT */}

                        <div className="p-5">

                          {/* TITLE + PRICE */}

                          <div className="flex justify-between gap-3">
                            <h3 className="font-serif text-xl leading-tight">
                              {item.title}
                            </h3>

                            <p className="font-semibold text-[#16362D] whitespace-nowrap">
                              €
                              {Number(
                                item.price ||
                                  0,
                              ).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </p>
                          </div>

                          {/* CATEGORY */}

                          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                            <Tag
                              size={15}
                            />

                            <span>
                              {item.category ||
                                "Furniture"}
                            </span>
                          </div>

                          {/* LOCATION */}

                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <MapPin
                              size={15}
                            />

                            <span>
                              {isLive
                                ? item.location ||
                                  "Location not specified"
                                : item.location ||
                                  "Curated Collection"}
                            </span>
                          </div>

                          {/* CONDITION */}

                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Sparkles
                              size={15}
                            />

                            <span>
                              Condition:{" "}
                              <span className="font-medium text-gray-700">
                                {item.item_condition ||
                                  "Not specified"}
                              </span>
                            </span>
                          </div>

                          {/* MATERIAL */}

                          {item.material && (
                            <div className="mt-4">
                              <span className="inline-flex bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                                {item.material}
                              </span>
                            </div>
                          )}

                          {/* DESCRIPTION */}

                          {item.description && (
                            <p className="
                              text-sm
                              text-gray-500
                              mt-4
                              line-clamp-2
                              leading-relaxed
                            ">
                              {
                                item.description
                              }
                            </p>
                          )}

                          {/* VIEW DETAILS */}

                          <div className="
                            mt-5
                            pt-4
                            border-t
                            flex
                            justify-between
                            items-center
                          ">
                            <span className="text-xs text-gray-400">
                              {isLive
                                ? "Listed by seller"
                                : "Curated piece"}
                            </span>

                            <span className="
                              text-sm
                              font-medium
                              text-[#16362D]
                              group-hover:underline
                            ">
                              View details →
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  },
                )}

              </div>
            )}

            {/* LOAD MORE */}

            <div className="flex justify-center mt-10">
              <button
                type="button"
                className="
                  bg-[#16362D]
                  text-white
                  px-8
                  py-3
                  rounded-full
                  hover:bg-[#214b3e]
                  transition
                "
              >
                Load More Curated Pieces
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          SHOWCASE MODAL
      ====================================================== */}

      {showcaseModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-6
          "
          onClick={() =>
            setShowcaseModal(null)
          }
        >
          <div
            className="
              bg-white
              rounded-2xl
              max-w-2xl
              w-full
              overflow-hidden
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <img
              src={showcaseModal.image}
              alt={
                showcaseModal.title
              }
              className="
                w-full
                h-80
                object-cover
              "
            />

            <div className="p-6">

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-3xl font-serif">
                    {
                      showcaseModal.title
                    }
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    {
                      showcaseModal.category
                    }
                  </p>
                </div>

                <p className="text-2xl font-semibold text-[#16362D]">
                  €
                  {Number(
                    showcaseModal.price ||
                      0,
                  ).toLocaleString()}
                </p>
              </div>

              {/* MODAL DETAILS */}

              <div className="grid grid-cols-2 gap-3 mt-6">

                <div className="bg-[#F6F4F1] rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Condition
                  </p>

                  <p className="font-medium mt-1">
                    {
                      showcaseModal.item_condition
                    }
                  </p>
                </div>

                <div className="bg-[#F6F4F1] rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="font-medium mt-1">
                    {
                      showcaseModal.location
                    }
                  </p>
                </div>

                <div className="bg-[#F6F4F1] rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Material
                  </p>

                  <p className="font-medium mt-1">
                    {
                      showcaseModal.material ||
                      "Not specified"
                    }
                  </p>
                </div>

                <div className="bg-[#F6F4F1] rounded-xl p-4">
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p className="font-medium mt-1 capitalize">
                    {
                      showcaseModal.status
                    }
                  </p>
                </div>

              </div>

              <p className="mt-6 text-gray-600 leading-relaxed">
                {
                  showcaseModal.description
                }
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowcaseModal(null)
                  }
                  className="
                    bg-[#16362D]
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    hover:bg-[#214b3e]
                    transition
                  "
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}
