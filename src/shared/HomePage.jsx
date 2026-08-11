import { Leaf, Recycle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "./Loader";
import Footer from "./Footer";

export default function HomePage() {
  const navigate = useNavigate();

  const arrivals = [
    {
      id: 1,
      name: "Scandi Arm Chair",
      price: "$530",
      image: assets.new2,
    },
    {
      id: 2,
      name: "Floor Lamp",
      price: "$230",
      image: assets.new1,
    },
    {
      id: 3,
      name: "Travertine Side Table",
      price: "$390",
      image: assets.sidetable,
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
            <h1 className="font-serif text-3xl md:text-6xl ">
              <span className="font-serif italic ">Furniture</span> with a{" "}
              <span className="font-serif italic ">Future</span>
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

      {/* ABOUT */}
      <section className="py-20 bg-[#F7F3EE] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Content */}
            <div>
              <span className="uppercase pl-5 tracking-[3px]  text-sm text-[#884b12]">
                About SustainSpace
              </span>

              <h2 className="font-serif pl-5 text-[40px] text-[#18392B] leading-tight mt-4">
                Timeless Design,
                <br />
                Thoughtfully Reimagined.
              </h2>

              <p className="mt-5 pl-5 leading-6 text-[#6B645F]">
                SustainSpace is more than a marketplace. We carefully curate
                exceptional pre-loved furniture, restoring each piece to
                celebrate craftsmanship while reducing environmental impact.
                Every purchase extends the life of beautiful design and supports
                a more sustainable future.
              </p>

              <div className="grid grid-cols-3 gap-5 mt-10">
                <div className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#18392B]">
                    4.2K
                  </h3>
                  <p className="text-sm text-[#847A71] mt-2">Happy Homes</p>
                </div>

                <div className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#18392B]">
                    98%
                  </h3>
                  <p className="text-sm text-[#847A71] mt-2">Restored</p>
                </div>

                <div className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#18392B]">
                    100%
                  </h3>
                  <p className="text-sm text-[#847A71] mt-2">Authentic</p>
                </div>
              </div>

              <button className="mt-10 bg-[#18392B] text-white px-7 py-3 rounded-lg hover:opacity-90 transition">
                Discover Our Story
              </button>
            </div>
            {/* Images */}
            <div className="relative h-[520px] flex justify-end mr-9">
              {" "}
              <img
                src={assets.hanging}
                alt="Luxury Interior"
                className="rounded-[28px] border-3 border-[#225b39] w-[72%] h-full object-cover shadow-xl"
              />
              {/* Floating Card */}
              <div className="absolute bottom-8 -left-8 bg-white rounded-2xl p-5 shadow-2xl hover:-translate-y-2 transition">
                <p className="text-3xl font-serif text-[#18392B]">12K+</p>
                <p className="text-sm text-[#6B645F]">
                  Furniture Pieces Given a New Home
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#18392B] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="uppercase tracking-[3px] text-[#D7C7B9] text-sm">
                Fresh Finds
              </span>

              <h2 className="font-serif text-4xl text-white mt-2">
                New Arrivals
              </h2>

              <p className="text-white/70 mt-3 max-w-lg">
                Recently restored pieces selected for quality, character and
                timeless design.
              </p>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#18392B] transition"
            >
              Explore Collection →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-9">
            {arrivals.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/shop")}
                className="group bg-[#F7F3EE] rounded-xl overflow-hidden cursor-pointer transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="px-5 py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-[#18392B]">
                        {item.name}
                      </h3>

                      <p className="text-[#6B645F] mt-2">{item.price}</p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#18392B] text-white flex items-center justify-center transition group-hover:rotate-45">
                      →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   {/* CATEGORY GRID */}
<section className="py-14 bg-[#F7F3EE]">
  <div className="max-w-6xl mx-auto px-6">

    <div className="text-center mb-10">
      <span className="uppercase tracking-[3px] text-sm text-[#8D8278]">
        Collections
      </span>

      <h2 className="font-serif text-4xl text-[#18392B] mt-2">
        Explore By Category
      </h2>
    </div>


    <div className="grid md:grid-cols-4 gap-6">

      {categories.map((category, index) => (
        <div
          key={category.title}
          onClick={() => navigate("/shop")}
          className="group cursor-pointer"
        >

          {/* Image */}
          <div className="relative h-[260px] rounded-2xl overflow-hidden">

            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

            <span className="absolute top-4 left-4 text-white/80 text-xs tracking-[3px]">
              0{index + 1}
            </span>

          </div>


          {/* Title */}
          <div className="flex justify-between items-center mt-4">

            <h3 className="font-serif text-2xl text-[#18392B]">
              {category.title}
            </h3>

            <div className="
              w-9 h-9 rounded-full
              border border-[#18392B]
              text-[#18392B]
              flex items-center justify-center
              opacity-0
              group-hover:opacity-100
              transition
            ">
              →
            </div>

          </div>

        </div>
      ))}

    </div>

  </div>
</section>

      {/* SELLER OF THE WEEK */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-[#274535] rounded-xl overflow-hidden grid md:grid-cols-[470px_1fr] min-h-[360px]">
          {/* Image */}
          <div className="h-[420px] w-[400px]">
            <img
              src={assets.seller}
              alt="Seller of the Week"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conent */}
          {/* Content */}
          <div className="flex flex-col justify-center  pr-8 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#1D3A2C] px-4 py-2 rounded-full relative">
                <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white">
                  Seller of the Week
                </span>

                <div className="absolute left-4 right-4 bottom-1 h-[1px] bg-white/40"></div>
              </div>

              <div className="flex text-[#deefe2] text-lg tracking-[2px]">
                ★★★★★
              </div>
            </div>

            <h2 className="font-serif text-[#fdd5b1] text-[30px] mt-2">
              Meet Elena Vance
            </h2>

            <p className="mt-3 text-[16px] leading-7 text-[#B7C0BA] max-w-lg">
              A specialist in Scandinavian restoration, Elena curates pieces
              that bridge historical craftsmanship with modern sustainability.
              Every piece in her collection has been meticulously serviced and
              authenticated.
            </p>

            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <button className="bg-[#F3EFE8] text-[#274535] px-6 py-3 rounded-lg font-medium hover:bg-white transition">
                Shop Elena's Studio
              </button>

              <button className="text-white font-medium underline underline-offset-4">
                Read Her Story
              </button>

              <button
                onClick={() => navigate("/sell")}
                className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition"
              >
                Join as a Seller
              </button>
            </div>
          </div>
        </div>
      </section>

{/* ECO IMPACT STORIES */}
<section className="bg-[#e6dbce] py-20">
  <div className="max-w-6xl mx-auto px-6">

    {/* Heading */}
    <div className="text-center mb-16">

      <h2 className="font-serif text-4xl text-[#18392B]">
        Eco-Impact Stories
      </h2>

      <p className="mt-4 text-[#6B645F]">
        Real homes, real impact. See how our community is redefining luxury
        through circularity.
      </p>

    </div>


    {/* Stories */}
    <div className="grid md:grid-cols-2 gap-8">


      {/* Card 1 */}
      <div className="bg-white rounded-2xl p-6 flex items-center gap-6">

        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=300&q=80"
          alt="Sarah"
          className="w-28 h-28 rounded-full object-cover shrink-0"
        />

        <div>

          <p className="italic text-[#3D3A36] leading-6">
            "Finding a pre-loved Eames chair that was restored with such care
            felt like finding a piece of history. It's the soul of my living
            room now."
          </p>

          <p className="mt-5 text-[#18392B] font-medium">
            — Sarah J., Architect
          </p>

        </div>

      </div>



      {/* Card 2 */}
      <div className="bg-white rounded-2xl p-6 flex items-center gap-6">

        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=300&q=80"
          alt="Marcus"
          className="w-28 h-28 rounded-full object-cover shrink-0"
        />

        <div>

          <p className="italic text-[#3D3A36] leading-6">
            "SustainSpace made it so easy to pass on my vintage sideboard to
            someone who truly appreciates it. Circularity is the only way
            forward."
          </p>

          <p className="mt-5 text-[#18392B] font-medium">
            — Marcus T., Designer
          </p>

        </div>

      </div>


    </div>

  </div>
</section>

      {/* IMPACT */}
      <section className="bg-white ">
        <img src={assets.homebanner} alt="" srcset="" />
        {/* <div className="max-w-7xl mx-auto px-6">
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
        </div> */}
      </section>


      {/* CTA */}
      {/* <section className="py-24 bg-[#F7F3EE]">
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
      </section> */}

      {/* FOOTER */}
     <Footer/>
    </div>
  );
}
