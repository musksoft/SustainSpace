import { Leaf, Recycle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "./Loader";

export default function HomePage() {
  const navigate = useNavigate();

  const arrivals = [
    {
      id: 1,
      name: "Scandi Arm Chair",
      price: "$530",
      image:
        "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      name: "Floor Lamp",
      price: "$230",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      name: "Travertine Side Table",
      price: "$390",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const categories = [
    {
      title: "Seating",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Tables",
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Lighting",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Storage",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="bg-[#F7F3EE] min-h-screen">
     {/* <Loader/> */}

      {/* HERO */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <img
          src={assets.hero}
          alt="Sustainable Furniture"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="max-w-3xl text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl leading-tight">
              Furniture with a Future
            </h1>

            <p className="mt-5 text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              Discover a curated collection of pre-loved, high-end pieces
              designed to last a lifetime. Conscious aesthetics for modern
              homes.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button
                onClick={() => navigate("/shop")}
                className="
            bg-[#18392B]
            px-5
            py-2.5
            text-sm
            rounded-lg
            hover:opacity-90
            transition
          "
              >
                Shop Collection
              </button>

              <button
                onClick={() => navigate("/sell")}
                className="
            bg-white
            text-[#18392B]
            px-5
            py-2.5
            text-sm
            rounded-lg
            hover:bg-white/90
            transition
          "
              >
                Sell Your Piece
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#18392B] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-white mb-10">New Arrivals</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {arrivals.map((item) => (
              <div
                key={item.id}
                className="bg-[#F7F3EE] rounded-xl p-3 hover:-translate-y-1 transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-72 w-full object-cover rounded-lg"
                />

                <div className="mt-4">
                  <h3 className="font-medium text-[#18392B]">{item.name}</h3>

                  <p className="text-[#6B645F] mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-24 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#18392B]">
            Curation by Category
          </h2>

          <p className="text-[#847A71] mt-2">
            Carefully selected archetypes for every room.
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-10">
            {categories.map((category) => (
              <div
                key={category.title}
                className="relative rounded-xl overflow-hidden h-72 cursor-pointer group"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/25" />

                <h3 className="absolute bottom-5 left-5 text-white font-serif text-2xl">
                  {category.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELLER OF THE WEEK */}
      <section className="max-w-[1480px] mx-auto px-6 py-10">
        <div className="bg-[#274535] rounded-xl overflow-hidden grid md:grid-cols-2 min-h-[540px]">
          {/* Image */}
          <div className="h-[540px]">
            <img
              src={assets.seller}
              alt="Seller of the Week"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#1D3A2C] px-4 py-2 rounded-full relative">
                <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white">
                  Seller of the Week
                </span>

                <div className="absolute left-4 right-4 bottom-1 h-[1px] bg-white/40"></div>
              </div>

              <div className="flex text-[#deefe2] text-xl tracking-[2px]">
                ★★★★★
              </div>
            </div>

            <h2 className="font-serif text-[#fdd5b1] text-3xl mt-3">
              Meet Elena Vance
            </h2>

            <p className="mt-5 text-[18px] leading-[1.8] text-[#B7C0BA] max-w-xl">
              A specialist in Scandinavian restoration, Elena curates pieces
              that bridge historical craftsmanship with modern sustainability.
              Every piece in her collection has been meticulously serviced and
              authenticated.
            </p>

            <div className="flex items-center gap-8 mt-12">
              <button className="bg-[#F3EFE8] text-[#274535] px-10 py-4 rounded-lg font-medium hover:bg-white transition">
                Shop Elena's Studio
              </button>

              <button className="text-white font-medium underline underline-offset-4">
                Read Her Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <Leaf size={28} className="mx-auto text-[#18392B] mb-4" />

              <h3 className="text-4xl font-serif text-[#18392B]">4,200+</h3>

              <p className="mt-3 text-[#6B645F]">
                Trees preserved through shared reuse efforts.
              </p>
            </div>

            <div>
              <Recycle size={28} className="mx-auto text-[#18392B] mb-4" />

              <h3 className="text-4xl font-serif text-[#18392B]">12.5 Tons</h3>

              <p className="mt-3 text-[#6B645F]">
                Carbon footprint reduced this year.
              </p>
            </div>

            <div>
              <ShieldCheck size={28} className="mx-auto text-[#18392B] mb-4" />

              <h3 className="text-4xl font-serif text-[#18392B]">Certified</h3>

              <p className="mt-3 text-[#6B645F]">
                Restoration and quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY */}
      <section className="bg-[#224334] text-white py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-5xl mb-8">SustainSpace</h2>

          <p className="text-xl leading-relaxed text-white/80 max-w-3xl">
            We believe that the most sustainable piece of furniture is the one
            that already exists. Through restoration, resale, and conscious
            curation, we extend the life of exceptional craftsmanship while
            reducing waste and environmental impact.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#F7F3EE]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#18392B] rounded-[32px] p-12 md:p-16 text-center text-white">
            <h2 className="font-serif text-5xl">
              Have Something Worth Preserving?
            </h2>

            <p className="mt-6 text-white/80 max-w-xl mx-auto">
              Join our community of conscious sellers and give exceptional
              furniture a second life.
            </p>

            <button
              onClick={() => navigate("/sell")}
              className="mt-10 bg-[#D7AFA0] text-[#18392B] px-8 py-4 rounded-lg font-medium"
            >
              Start Selling
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E7DED2] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl text-[#18392B]">SustainSpace</h3>

            <p className="text-sm text-[#6B645F] mt-2">
              © 2026 SustainSpace. Consciously Curated Furniture.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-[#6B645F]">
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
            <button>Shipping & Returns</button>
            <button>Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
