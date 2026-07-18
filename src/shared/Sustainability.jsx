import { ArrowRight, Leaf, Recycle, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

import {
  UtensilsCrossed,
  Armchair,
  BedDouble,
  Package,
  Lamp,
  Palette,
} from "lucide-react";
import LayoutGrid from "../components/LayoutGrid";
export default function SustainabilityPage() {
  const navigate = useNavigate();

  const cards = [
  {
    id: 1,
    content: (
      <div>
        <h2 className="text-white text-3xl font-serif">
          Crafted Heritage
        </h2>
        <p className="text-white/80 mt-2">
          Furniture built with craftsmanship deserves another generation.
        </p>
      </div>
    ),
    className: "md:col-span-2 h-[350px]",
    thumbnail: assets.hero,
  },

  {
    id: 2,
    content: (
      <div>
        <h2 className="text-white text-3xl font-serif">
          Second Life
        </h2>
        <p className="text-white/80 mt-2">
          Giving furniture a new home instead of a landfill.
        </p>
      </div>
    ),
    className: "h-[350px]",
    thumbnail: assets.login,
  },

  {
    id: 3,
    content: (
      <div>
        <h2 className="text-white text-3xl font-serif">
          Circular Living
        </h2>
        <p className="text-white/80 mt-2">
          Supporting sustainable choices through reuse.
        </p>
      </div>
    ),
    className: "h-[350px]",
    thumbnail: assets.seller,
  },

  {
    id: 4,
    content: (
      <div>
        <h2 className="text-white text-3xl font-serif">
          Quality First
        </h2>
        <p className="text-white/80 mt-2">
          Only durable pieces deserve another chapter.
        </p>
      </div>
    ),
    className: "md:col-span-2 h-[350px]",
    thumbnail: assets.map,
  },

  
];
  const categories = [
    {
      name: "Dining",
      icon: UtensilsCrossed,
    },
    {
      name: "Seating",
      icon: Armchair,
    },
    {
      name: "Beds",
      icon: BedDouble,
    },
    {
      name: "Storage",
      icon: Package,
    },
    {
      name: "Lighting",
      icon: Lamp,
    },
    {
      name: "Décor",
      icon: Palette,
    },
  ];

  return (
    <div className="bg-[#F7F3EE] min-h-screen">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="uppercase tracking-[0.2em] text-xs text-[#6E655E]">
              Our Commitment
            </span>

            <h1 className="mt-5 font-serif text-4xl md:text-5xl text-[#18392B] leading-tight">
              Furniture Deserves
              <br />
              Another Chapter
            </h1>

            <p className="mt-6 text-[#6E655E] text-base md:text-lg leading-relaxed max-w-lg">
              SustainSpace helps quality furniture find new homes, extending its
              lifespan while reducing unnecessary waste and supporting more
              thoughtful living.
            </p>

            <div className="flex gap-4 mt-10 flex-wrap">
              <button
                onClick={() => navigate("/sell")}
                className="bg-[#18392B] text-white px-7 py-3 rounded-lg"
              >
                Start Selling
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="border border-[#D8CDC1] bg-white px-7 py-3 rounded-lg"
              >
                Explore Marketplace
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl h-[500px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={assets.sustain} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-white/20" />
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="bg-[#EFEAE4] py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl text-[#18392B] mb-8">
            The Life of a Piece
          </h2>

          <p className="italic text-[#6E655E] max-w-3xl mx-auto">
            "Every piece of furniture has a story. Our mission is to ensure that
            story doesn't end prematurely in a landfill."
          </p>

          <p className="mt-8 text-[#6E655E] leading-relaxed max-w-4xl mx-auto">
            Furniture contains valuable materials, craftsmanship, and resources.
            When quality pieces are discarded prematurely, those resources are
            lost. By facilitating resale, SustainSpace helps extend product
            lifecycles while encouraging a more thoughtful approach to home
            furnishing.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-5xl text-[#18392B]">
              Sustainability Focus
            </h2>

            <p className="mt-4 text-[#6E655E]">
              We encourage quality furniture and décor that deserve another
              chapter.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="group bg-white rounded-3xl border border-[#E7DED2] p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <Icon
                    size={34}
                    className="mx-auto mb-5 text-[#18392B] group-hover:scale-110 transition"
                  />

                  <p className="font-medium text-[#18392B]">{item.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl text-[#18392B]">
              Condition Standards
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                grade: "A+",
                title: "Excellent",
                color: "bg-[#18392B]",
                desc: "Like-new condition with no visible scratches, dents, or signs of wear.",
              },
              {
                grade: "A",
                title: "Good",
                color: "bg-[#F2D8CE]",
                desc: "Minor cosmetic imperfections that do not affect functionality.",
              },
              {
                grade: "B",
                title: "Fair",
                color: "bg-[#EAE5DE]",
                desc: "Visible signs of use but structurally sound and suitable for everyday use.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[#E7DED2] rounded-3xl p-8"
              >
                <div
                  className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white font-medium`}
                >
                  {item.grade}
                </div>

                <h3 className="mt-6 font-serif text-3xl text-[#18392B]">
                  {item.title}
                </h3>

                <p className="mt-4 text-[#6E655E] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#EFEAE4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <img
              src="https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="rounded-3xl transition duration-700 hover:scale-105 h-[500px] object-cover w-full"
            />

            <div>
              <h2 className="font-serif text-5xl text-[#18392B] mb-8">
                The Seller's Journey
              </h2>

              <p className="text-[#6E655E] leading-relaxed mb-8">
                Every listing contributes to a trusted marketplace. We encourage
                detailed descriptions, transparent condition reporting, and
                high-quality imagery.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="font-serif text-2xl text-[#18392B]">01</span>
                  <div>
                    <h4 className="font-medium">Seller Submission</h4>
                    <p className="text-[#6E655E]">
                      Furniture details and photographs are uploaded.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif text-2xl text-[#18392B]">02</span>
                  <div>
                    <h4 className="font-medium">Quality Review</h4>
                    <p className="text-[#6E655E]">
                      Listings are checked against our standards.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif text-2xl text-[#18392B]">03</span>
                  <div>
                    <h4 className="font-medium">Marketplace Approval</h4>
                    <p className="text-[#6E655E]">
                      Approved listings become discoverable to buyers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif text-2xl text-[#18392B]">04</span>
                  <div>
                    <h4 className="font-medium">A New Home</h4>
                    <p className="text-[#6E655E]">
                      The furniture begins its next chapter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-serif text-4xl text-[#18392B] mb-8">
                Upholstered & Soft Goods
              </h2>

              <div className="border-l-2 border-[#18392B] pl-6">
                <p className="text-[#6E655E] leading-relaxed">
                  Upholstered furniture may be listed if clean, odor-free,
                  structurally sound, and free from mold or infestations.
                </p>

                <p className="mt-5 text-[#6E655E]">
                  Mattresses are generally restricted and may require additional
                  review.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl text-[#B44935] mb-8">
                We Do Not Accept
              </h2>

              <div className="bg-[#FFF3F0] border border-[#F2D8CE] rounded-2xl p-8">
                <ul className="space-y-4 text-[#7C5248]">
                  <li>• Mold-damaged furniture</li>
                  <li>• Pest-infested items</li>
                  <li>• Broken structural components</li>
                  <li>• Water-damaged furniture</li>
                  <li>• Counterfeit products</li>
                  <li>• Unsafe furniture</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT PILLARS */}

<section className="max-w-7xl mx-auto px-6 py-24">
  <div className="grid md:grid-cols-3 gap-6">
    {[
      {
        icon: Leaf,
        title: "Reducing Landfill Waste",
        text: "Millions of furniture items are discarded each year despite remaining usable. Resale keeps quality pieces in circulation and out of landfills.",
        color: "#ebf2b2",
      },
      {
        icon: TreePine,
        title: "Lowering Environmental Impact",
        text: "Extending the life of existing furniture reduces the demand for new manufacturing and helps conserve valuable materials and resources.",
        color: "#f2d5b2",
      },
      {
        icon: Recycle,
        title: "Supporting Circular Living",
        text: "We encourage a circular approach where furniture continues serving new owners rather than following a buy-use-discard cycle.",
        color: "#ace4b5",
      },
    ].map((item, index) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: index * 0.15,
          }}
          className="relative overflow-hidden rounded-3xl border border-[#E7DED2] bg-white p-10"
        >
          {/* Expanding circle */}
          <motion.div
            initial={{
              scale: 0,
            }}
            whileInView={{
              scale: 8,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: index * 0.15,
            }}
            className="absolute -top-16 -left-16 w-40 h-40 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-6 shadow-sm">
              <Icon size={28} className="text-[#18392B]" />
            </div>

            <h3 className="font-serif text-2xl text-[#18392B] mb-4">
              {item.title}
            </h3>

            <p className="text-[#6E655E] leading-relaxed">
              {item.text}
            </p>
          </div>
        </motion.div>
      );
    })}
  </div>
</section>
      {/* STANDARDS SECTION */}
      <section className="bg-gradient-to-r from-[#0E3828] to-[#184633] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h2 className="font-serif text-5xl mb-8">Our Three Pillars</h2>

              <p className="text-white/80 mb-10 leading-relaxed">
                SustainSpace is built around quality, longevity, and
                responsibility. We encourage listings that deserve another
                chapter.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-2">
                    Structural Integrity
                  </h3>

                  <p className="text-white/70">
                    Furniture should remain stable, functional, and suitable for
                    everyday use.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-2">Material Quality</h3>

                  <p className="text-white/70">
                    We prioritize durable materials that age gracefully and
                    maintain long-term value.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-2">
                    Responsible Condition
                  </h3>

                  <p className="text-white/70">
                    Items should be clean, honestly represented, and suitable
                    for continued use.
                  </p>
                </div>
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="rounded-3xl transition duration-700 hover:scale-105 h-[500px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-28 bg-[#F7F3EE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="uppercase tracking-[0.25em] text-xs text-[#6E655E]">
              Heritage
            </span>

            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#18392B]">
              Timeless Furniture Never Goes Out of Style
            </h2>

            <p className="mt-6 text-[#6E655E] leading-relaxed">
              Every quality piece carries years of craftsmanship. By extending
              its journey, we preserve materials, reduce waste and create homes
              filled with stories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl">
              <h3 className="font-serif text-5xl text-[#18392B]">20+</h3>

              <p className="mt-3 text-[#6E655E]">
                Additional years quality furniture can remain in use.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl">
              <h3 className="font-serif text-5xl text-[#18392B]">♻</h3>

              <p className="mt-3 text-[#6E655E]">
                Encouraging circular living through resale.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl">
              <h3 className="font-serif text-5xl text-[#18392B]">∞</h3>

              <p className="mt-3 text-[#6E655E]">
                Every piece deserves more than one home.
              </p>
            </div>
          </div>

          <LayoutGrid cards={cards}/>



          {/* <div className="grid lg:grid-cols-3 gap-6 mt-16">
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl group">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl">
                <p className="italic text-[#18392B]">
                  "Beautiful furniture deserves more than one home."
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                className="rounded-3xl h-[250px] w-full object-cover hover:scale-105 transition duration-700"
              />

              <img
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
                className="rounded-3xl h-[250px] w-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div> */}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#18392B] rounded-[32px] p-12 md:p-20 text-center text-white">
            <h2 className="font-serif text-5xl mb-6">
              Give Furniture Another Life
            </h2>

            <p className="max-w-2xl mx-auto text-white/80 mb-10">
              Whether you're furnishing a home or passing along a piece you no
              longer need, every transaction helps support a more sustainable
              future.
            </p>

            <button
              onClick={() => navigate("/sell")}
              className="bg-[#D7AFA0] text-[#18392B] px-8 py-3 rounded-lg inline-flex items-center gap-2"
            >
              Start Selling
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
