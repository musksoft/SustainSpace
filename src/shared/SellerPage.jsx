import { ArrowRight, Award, MessageSquare, Shield, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Footer from "./Footer";

export default function SellPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F3EE] min-h-screen">
   

      {/* HERO */}

<section className="relative h-[580px] overflow-hidden">


  {/* Background Image */}

  <img
    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
    alt="Sustainable furniture"
    className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
    "
  />



  {/* Overlay */}

  <div
    className="
    absolute
    inset-0
    bg-black/40
    "
  />



  {/* Content */}

  <div
    className="
    relative
    z-10
    max-w-6xl
    mx-auto
    h-full
    px-6
    flex
    items-center
    justify-center
    text-center
    "
  >


    <div className="max-w-2xl text-white">


      <span
        className="
        uppercase
        tracking-[0.3em]
        text-xs
        text-white/70
        "
      >
        Sustainable Living
      </span>



      <h1
        className="
        mt-4
        font-serif
        text-4xl
        md:text-[56px]
        leading-tight
        "
      >
       Give Good Things a Second Life.
      </h1>



      <p
        className="
        mt-4
        text-white/80
        text-base
        max-w-xl
        mx-auto
        leading-relaxed
        "
      >
        Quality furniture should not end with one home.
        We help meaningful pieces continue their journey
        through reuse, resale, and thoughtful living.
      </p>



      <div
        className="
        mt-7
        flex
        justify-center
        gap-3
        "
      >


        <button
          onClick={()=>navigate("/shop")}
          className="
          bg-white
          text-[#18392B]
          px-7
          py-2.5
          rounded-lg
          text-sm
          font-medium
          "
        >
          Explore Furniture
        </button>



        <button
          onClick={()=>navigate("/sell")}
          className="
          border
          border-white/40
          text-white
          px-7
          py-2.5
          rounded-lg
          text-sm
          "
        >
          Give Yours A New Home
        </button>


      </div>


    </div>


  </div>


</section>
      {/* <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
        </div>

        <div className="relative max-w-7xl mx-auto  pl-14 px-6 py-24 md:py-36">
          <span className="bg-[#F1D1C2] text-[#8A5A44] px-4 py-1 rounded-full text-xs tracking-wide">
            SELLER ACADEMY
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl max-w-3xl font-serif text-[#18392B] leading-tight">
            Master the Art of Conscious Selling
          </h1>

          <p className="mt-6 text-[#6E655E] max-w-2xl leading-relaxed">
            Turn your curated finds and handcrafted pieces into a legacy. Learn
            how to bridge aesthetics with impact through our guide for modern
            artisans and conscious sellers.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <button className="bg-[#18392B] text-white px-7 py-3 rounded-lg hover:opacity-90 transition">
              Start Learning
            </button>

            <button className="border border-[#D8CDC1] bg-white px-7 py-3 rounded-lg">
              View Handbook
            </button>
          </div>
        </div>
      </section> */}

      {/* LISTING SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl text-[#18392B]">
            The Guide to a Perfect Listing
          </h2>

          <p className="text-[#847A71] mt-3">
            Quality begins before the first click.
          </p>
        </div>

        <div className="grid px-6 lg:grid-cols-3 gap-6">
          {/* IMAGE CARD */}
          <div className="rounded-3xl overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="h-full object-cover"
            />
          </div>

          {/* CARD 1 */}
          <div className="bg-white rounded-3xl p-6">
            <div className="w-9 h-9 rounded-full bg-[#18392B] text-white flex items-center justify-center mb-6">
              1
            </div>

            <h3 className="font-serif text-2xl text-[#18392B] mb-4">
              Capture the Essence
            </h3>

            <p className="text-[#6B645F] leading-relaxed">
              Natural lighting is your best tool. Photograph in daylight and
              showcase textures and true colors without harsh shadows.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[#6B645F]">
              <li>• 2–3 high resolution photos</li>
              <li>• Macro shots of details</li>
              <li>• Lifestyle angle included</li>
            </ul>
          </div>

          {/* CARD 2 */}
          <div className="bg-[#F2D8CE] rounded-3xl p-8">
            <div className="w-9 h-9 rounded-full bg-[#8A5A44] text-white flex items-center justify-center mb-6">
              2
            </div>

            <h3 className="font-serif text-2xl text-[#18392B] mb-4">
              Tell the Story
            </h3>

            <p className="text-[#6B645F] leading-relaxed">
              Beyond dimensions, share provenance, materials, and the journey
              behind the piece. Buyers value authenticity.
            </p>

            <blockquote className="italic mt-8 text-[#8A5A44]">
              “This isn't just a table. It's 40 years of careful preservation
              and restoration.”
            </blockquote>
          </div>

          {/* IMPACT CARD */}
          <div className="bg-[#18392B] text-white rounded-3xl p-8">
            <div className="w-9 h-9 rounded-full bg-white text-[#18392B] flex items-center justify-center mb-6">
              3
            </div>

            <h3 className="font-serif text-2xl mb-4">Impact Tagging</h3>

            <p className="text-[#DAD3CC]">
              Our sustainability system highlights meaningful environmental
              impact and material recovery.
            </p>

            <div className="flex gap-2 mt-6 flex-wrap">
              <span className="text-xs border border-white/30 px-3 py-1 rounded-full">
                EXCELLENT
              </span>

              <span className="text-xs border border-white/30 px-3 py-1 rounded-full">
                GOOD CONDITION
              </span>

              <span className="text-xs border border-white/30 px-3 py-1 rounded-full">
                FAIR
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-10 flex flex-col justify-center">
            <h3 className="font-serif text-3xl text-[#18392B] mb-3">
              Ready to Start?
            </h3>

            <p className="text-[#6B645F]">
              Your dashboard is waiting for your first creation.
            </p>

            <p className="text-[#285533] italic">
              Earn by selling, Promote sustainability by helping...
            </p>

            <button
              onClick={() => navigate("/listings")}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-[#18392B] px-4 py-2 text-base font-lg text-white hover:bg-[#0f2b1f] transition-colors"
            >
              Create Listing
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* MESSAGING */}
      <section className="max-w-7xl mx-auto px-6 py-1">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="pl-10">
            <h2 className="font-serif text-4xl text-[#18392B] mb-6">
              The Language of Luxury:
              <br />
              Effective Messaging
            </h2>

            <p className="text-[#6B645F] leading-relaxed mb-8">
              Trust is built through transparency and professionalism. Conscious
              buyers value the journey as much as the piece itself.
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-[#E7DED2]">
                <div className="flex gap-3">
                  <MessageSquare size={18} />
                  <div>
                    <h4 className="font-medium">Responsive Grace</h4>
                    <p className="text-sm text-[#6B645F]">
                      Aim for thoughtful replies within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E7DED2]">
                <div className="flex gap-3">
                  <Shield size={18} />
                  <div>
                    <h4 className="font-medium">Transparency First</h4>
                    <p className="text-sm text-[#6B645F]">
                      Always disclose wear, repairs, and imperfections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <img
            src={assets.new1}
            alt=""
            className="w-[470px] ml-2 aspect-square rounded-3xl object-cover shadow-xl "
          />
        </div>
      </section>

      {/* MATERIAL CARE ARCHIVES */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif text-4xl text-[#18392B]">
                The Material Care Archives
              </h2>

              <p className="mt-3 text-[#6B645F] max-w-lg leading-6">
                Preserving longevity through informed stewardship. Learn how to
                maintain the tactile beauty of your curated pieces.
              </p>
            </div>

            <button
              className="
        text-sm 
        text-[#18392B]
        font-medium
        border-b
        border-[#18392B]/40
        pb-1
        hover:border-[#18392B]
        transition
      "
            >
              View All Guides
            </button>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "The Oak Stewardship",
                material: "Solid Oak",
                image: assets.oak,
                text: "Understanding the seasonal expansion and natural oiling of solid European oak.",
              },
              {
                title: "Velvet Restoration",
                material: "Recycled Velvet",
                image: assets.velvet,
                text: "Maintenance techniques for high-density recycled fibers and pile recovery.",
              },
              {
                title: "Walnut Luster",
                material: "Solid Walnut",
                image: assets.walnut,
                text: "Deep-conditioning methods to preserve the dark, rich character of American walnut.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                {/* Image */}
                <div className="relative h-[365px] rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                w-full
                h-full
                object-cover
                transition
                duration-700
                group-hover:scale-105
              "
                  />

                  {/* Material Tag */}
                  <span
                    className="
              absolute
              top-5
              left-5
              bg-white
              text-[#18392B]
              text-xs
              font-medium
              px-4
              py-1.5
              rounded-full
            "
                  >
                    {item.material}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5">
                  <h3
                    className="
              font-serif
              text-2xl
              text-[#18392B]
            "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
              mt-4
              text-sm
              leading-6
              text-[#6B645F]
            "
                  >
                    {item.text}
                  </p>

                  <button
                    className="
              mt-5
              flex
              items-center
              gap-2
              text-sm
              text-[#884b12]
              hover:gap-4
              transition-all
            "
                  >
                    Read Guide
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-12 bg-[#123726]">
        <div className="container mx-auto px-6">
          {/* Manifesto */}
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="flex justify-center mb-5">
              <Leaf className="w-5 h-5 text-[#8AA08E]" strokeWidth={1.5} />
            </div>

            <h2 className="font-playfair text-3xl md:text-[2.3rem] font-semibold tracking-tight">
              The Manifesto of Permanence
            </h2>

            <div className="w-14 h-px bg-[#8AA08E] mx-auto my-5" />

            <p className="max-w-2xl mx-auto font-serif italic text-base md:text-lg leading-8 text-gray-200">
              "We believe the home is a living sanctuary. By choosing materials
              that age with grace and prioritizing ethical sourcing over rapid
              consumption, we create spaces that nourish the soul and honor the
              earth."
            </p>

            <div className="mt-10">
              <h4 className="uppercase tracking-[0.22em] text-[11px] font-semibold text-[#8AA08E]">
                MUSKAN NISAR
              </h4>

              <p className="mt-1 text-xs text-gray-300">
                Founder, SustainSpace
              </p>
            </div>
          </div>

          {/* Newsletter Card */}
          <div className="max-w-5xl mx-auto mt-10">
            <div className="rounded-xl bg-[#E9E4DE] px-8 py-8 md:px-10 md:py-9">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-sm">
                  <h3 className="font-playfair text-2xl md:text-[1.9rem] font-semibold text-[#123726]">
                    Join the Sanctuary
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#4E5B53]">
                    Receive monthly editorial pieces on sustainable living,
                    material science, and exclusive collection previews.
                  </p>
                </div>

                <form className="flex w-full max-w-md flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 h-11 rounded-md border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#123726]"
                  />

                  <button
                    type="submit"
                    className="h-11 rounded-md bg-[#123726] px-7 text-sm font-medium text-white transition hover:bg-[#0f2f20]"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
