import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { Search } from "lucide-react";
export default function ShopPage() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showcaseModal, setShowcaseModal] = useState(null);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const showcaseItems = [
    {
      id: "showcase-1",
      title: "Nordic Velvet Sofa",
      category: "Sofas",
      price: 1240,
      status: "available",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
      description: "Elegant velvet sofa restored using sustainable materials.",
    },
    {
      id: "showcase-2",
      title: "Hand-Carved Oak Table",
      price: 2800,
      category: "Sofas",
      status: "sold",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      description: "Beautiful reclaimed oak dining table crafted by artisans.",
    },
    {
      id: "showcase-3",
      title: "Art Lounge Chair",
      price: 850,
      status: "available",
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200",
      description: "Contemporary lounge chair with premium upholstery.",
    },
    {
      id: "showcase-4",
      title: "Walnut Floating Console",
      price: 1100,
      status: "available",
      image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200",
      description: "Minimal floating console built from reclaimed walnut.",
    },
    {
      id: "showcase-5",
      title: "Cedar Platform Bed",
      price: 1950,
      status: "available",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      description: "Handcrafted cedar platform bed with timeless design.",
    },
    {
      id: "showcase-6",
      title: "Hand-Woven Rattan Chair",
      price: 420,
      status: "available",
      image:
        "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200",
      description: "Vintage rattan chair carefully restored by artisans.",
    },
  ];

  useEffect(() => {
    loadListings();
  }, []);

  function toggleCategory(category) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  }

  async function loadListings() {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setListings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const allItems = [...listings, ...showcaseItems];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      item.location?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
  });
  return (
    <div className="min-h-screen bg-[#F6F4F1]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-[#16362D]">Sustain Finds</h1>

          <p className="text-gray-500 mt-3 text-base">
            Discover pre-loved furniture pieces ready for a new story.
          </p>

          
        </div>
        <div className="flex gap-8">
          {/* SIDEBAR */}

          <aside className="hidden lg:block w-64">
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold mb-4">Find Near</h3>

              <input
                placeholder="City or Zip"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <div className="mt-8">
                <h3 className="font-semibold mb-3">Categories</h3>

                <div className="space-y-2 text-sm">
                  {["Tables", "Chairs", "Sofas", "Storage"].map((category) => (
                    <label key={category} className="block">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />

                      <span className="ml-2">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-3">Material</h3>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    Solid Oak
                  </span>

                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    Walnut
                  </span>

                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    Reclaimed Steel
                  </span>

                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    Linen
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN */}

          {/* MAIN */}

<div className="flex-1">

  {/* SEARCH + STATUS FILTER */}

  <div className="flex gap-4 mb-8">

    <div className="
      flex
      items-center
      flex-1
      bg-white
      border
      rounded-xl
      px-5
      shadow-sm
    ">

      <Search
        size={20}
        className="text-gray-400 mr-3"
      />

      <input
        placeholder="Search furniture, materials, styles..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
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
      onChange={(e)=>setStatusFilter(e.target.value)}
      className="
        bg-white
        border
        rounded-xl
        px-5
        text-sm
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
            
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isLive = !item.image;

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
                      "
                      onClick={() => {
                        if (isLive) {
                          navigate(`/listing/${item.id}`);
                        } else {
                          setShowcaseModal(item);
                        }
                      }}
                    >
                      <div className="relative">
                        <img
                          src={isLive ? item.gallery_images : item.image}
                          alt={item.title}
                          className="h-72 w-full object-cover"
                        />

                        <span
                          className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full text-white 
                            ${
                              item.status === "sold"
                                ? "bg-stone-500"
                                : item.status === "reserved"
                                  ? "bg-yellow-600"
                                  : "bg-[#16362D]"
                            }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between">
                          <h3 className="font-serif text-xl">{item.title}</h3>

                          <p className="font-semibold">${item.price}</p>
                        </div>

                        <p className="text-sm text-gray-500 mt-3">
                          {isLive ? item.location : "Verified Seller"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center mt-10">
              <button
                className="
                  bg-[#16362D]
                  text-white
                  px-8
                  py-3
                  rounded-full
                "
              >
                Load More Curated Pieces
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWCASE MODAL */}

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
          "
          onClick={() => setShowcaseModal(null)}
        >
          <div
            className="
              bg-white
              rounded-2xl
              max-w-2xl
              w-full
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={showcaseModal.image}
              alt={showcaseModal.title}
              className="w-full h-80 object-cover"
            />

            <div className="p-6">
              <h2 className="text-3xl font-serif">{showcaseModal.title}</h2>

              <p className="text-2xl font-semibold mt-3">
                ${showcaseModal.price}
              </p>

              <p className="mt-4 text-gray-600">{showcaseModal.description}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowcaseModal(null)}
                  className="
                    bg-[#16362D]
                    text-white
                    px-6
                    py-3
                    rounded-xl
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
