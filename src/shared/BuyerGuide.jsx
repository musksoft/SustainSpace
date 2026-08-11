import { useState } from "react";
import {
  ShieldCheck,
  Landmark,
  MessageCircle,
  MapPin,
  Truck,
  CalendarCheck,
  ChevronDown
} from "lucide-react";
import { assets } from "../assets/assets";
import Footer from "./Footer";
export default function BuyerGuide() {
  const [open, setOpen] = useState(null);

  const images = {
    hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",

    splash:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80",

    discover:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",

    connect:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=80",

    pickup:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80",

    home: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",

    philosophy:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  };

  const faq = [
    {
      q: "What should I check before buying?",
      a: "Review photos, dimensions, furniture condition, and ask the seller any questions before purchasing.",
    },
    {
      q: "How does payment work?",
      a: "Payments are completed directly between buyer and seller through online bank-to-bank transfer.",
    },
    {
      q: "How do I arrange pickup?",
      a: "After agreeing with the seller, confirm the pickup location and suitable collection time.",
    },
    {
      q: "Can I inspect furniture before buying?",
      a: "Yes. Local pickup allows buyers to meet sellers and inspect items before completing the transaction.",
    },
  ];

  return (
    <div className="bg-[#F7F3EE] text-[#18392B]">
      {/* HERO */}

      <section className="relative h-[650px] overflow-hidden">
        <img
          src={images.hero}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#18392B]/90 via-[#18392B]/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-xl ml-8 text-white">
            <p className="uppercase tracking-[0.3em] text-xs">Buyer's Guide</p>

            <h1 className="mt-6 font-serif text-5xl leading-tight">
              Bring meaningful furniture
              <br />
              into your home
            </h1>

            <p className="mt-6 text-white/80 text-lg leading-relaxed">
              Discover unique pieces, connect directly with sellers, and give
              quality furniture another chapter.
            </p>

            <button className="mt-8 bg-white text-[#18392B] px-7 py-3 rounded-lg">
              Explore Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* HOW BUYING WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif  uppercase text-3xl">
            Finding your next piece is simple
          </h2>

          <p className="mt-3 text-sm text-[#6E655E]">
            A thoughtful process designed around transparency.
          </p>
        </div>

        <div className="space-y-16">
          {/* 01 */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <img
              src={assets.discover}
              className="rounded-2xl w-[90%] h-[260px] object-cover"
            />

            <div className="max-w-lg">
              <span className="bg-[#18392B] text-white text-xs px-3 py-1 rounded-full">
                01
              </span>

              <h3 className="mt-4 font-playfair font-semibold text-2xl">
                Discover
              </h3>

              <p className="mt-3 text-[#6E655E]">
                Browse curated furniture and explore detailed listings that
                match your style.
              </p>
            </div>
          </div>

          {/* 02 */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="max-w-lg">
              <span className="bg-[#E8D8CA] text-[#18392B] text-xs px-3 py-1 rounded-full">
                02
              </span>

              <h3 className="mt-4 font-playfair font-semibold text-2xl">
                Connect
              </h3>

              <p className="mt-3  text-[#6E655E]">
                Message the seller, ask questions, and learn more about the
                item's story.
              </p>
            </div>

            <img
              src={assets.connect}
              className="rounded-2xl w-[90%] h-[260px] object-cover"
            />
          </div>

          {/* 03 */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <img
              src={assets.gift}
              className="rounded-2xl w-[90%] h-[260px] object-cover"
            />

            <div className="max-w-sm">
              <span className="bg-[#18392B] text-white text-xs px-3 py-1 rounded-full">
                03
              </span>

              <h3 className="mt-4 font-playfair font-semibold text-2xl">
                Arrange Pickup
              </h3>

              <p className="mt-3  text-[#6E655E]">
                Confirm the pickup location and time directly with the seller.
              </p>
            </div>
          </div>

          {/* 04 */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="max-w-lg">
              <span className="bg-[#18392B] text-[#edeecb] text-xs px-3 py-1 rounded-full">
                04
              </span>

              <h3 className="mt-4 font-playfair font-semibold text-2xl">
                Handover
              </h3>

              <p className="mt-3  text-[#6E655E]">
                Recieve your item and welcome it into its new sanctuary. Your
                funds are to be handed until you confirm the item arrived as
                descibed.
              </p>
            </div>

            <img
              src={assets.sofa}
              className="rounded-2xl w-[90%] h-[260px] object-cover"
            />
          </div>
        </div>
      </section>

    {/* BUYING EXPERIENCE */}
<section className="max-w-6xl mx-auto px-6 ">

  <div className="text-center mb-12">

    <span className="uppercase tracking-[0.25em] text-xs text-[#6E655E]">
      Simple & Transparent
    </span>

    <h2 className="font-serif text-4xl mt-4">
      A Better Way To Buy Furniture
    </h2>

    <p className="mt-4 text-sm text-[#6E655E] max-w-xl mx-auto">
      From discovering a piece to bringing it home,
      every step is designed around trust and direct connection.
    </p>

  </div>



  <div className="bg-white rounded-[35px] p-8 md:p-10 shadow-sm">


    {/* TOP ROW */}

    <div className="grid md:grid-cols-3 gap-8 pb-10 border-b border-[#E8DED3]">


      <div>
        <div className="w-11 h-11 rounded-full bg-[#b4ddcc] flex items-center justify-center">
          <ShieldCheck className="text-[#18392B]" size={22}/>
        </div>

        <h3 className="font-serif text-xl mt-5">
          Verified Listings
        </h3>

        <p className="mt-3 text-sm text-[#6E655E]">
          Review furniture details, photos,
          and condition before making a decision.
        </p>
      </div>



      <div>
        <div className="w-11 h-11 rounded-full bg-[#f7ebcc] flex items-center justify-center">
          <MessageCircle className="text-[#18392B]" size={22}/>
        </div>

        <h3 className="font-serif text-xl mt-5">
          Direct Communication
        </h3>

        <p className="mt-3 text-sm text-[#6E655E]">
          Speak directly with sellers,
          ask questions, and agree on details.
        </p>
      </div>



      <div>
        <div className="w-11 h-11 rounded-full bg-[#18392B]/10 flex items-center justify-center">
          <Landmark className="text-[#18392B]" size={22}/>
        </div>

        <h3 className="font-serif text-xl mt-5">
          Direct Payment
        </h3>

        <p className="mt-3 text-sm text-[#6E655E]">
          Complete purchases through direct
          online bank-to-bank transfer.
        </p>
      </div>


    </div>





    {/* COLLECTION */}

    <div className="pt-10">


      <h3 className="font-serif text-2xl mb-6">
        Bringing It Home
      </h3>



      <div className="grid md:grid-cols-3 gap-5">


        <div className="bg-[#0e5637] text-white rounded-2xl p-6">

          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <MapPin size={21}/>
          </div>

          <h4 className="font-serif text-xl mt-5">
            Local Pickup
          </h4>

          <p className="mt-3 text-sm text-white/75">
            Meet the seller, inspect your furniture,
            and collect it at a convenient time.
          </p>

        </div>




        <div className="bg-[#f7ddea] rounded-2xl p-6">

          <div className="w-10 h-10 rounded-full bg-[#18392B]/10 flex items-center justify-center">
            <Truck size={21}/>
          </div>


          <h4 className="font-serif text-xl mt-5">
            Eco Delivery
          </h4>


          <p className="mt-3 text-sm text-[#6E655E]">
            When pickup is not possible,
            arrange delivery directly with the seller.
          </p>


        </div>




        <div className="bg-[#f4dfc6] rounded-2xl p-6">


          <div className="w-10 h-10 rounded-full bg-[#18392B]/10 flex items-center justify-center">
            <CalendarCheck size={21}/>
          </div>


          <h4 className="font-serif text-xl mt-5">
            Confirm Details
          </h4>


          <p className="mt-3 text-sm text-[#6E655E]">
            Agree on pickup location,
            timing, and final arrangements.
          </p>


        </div>


      </div>


    </div>


  </div>


</section>

      {/* FAQ */}

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-[#18392B] rounded-[40px] p-10 md:p-16 text-white">
          <h2 className="font-serif text-4xl text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto mt-10">
            {faq.map((item, index) => (
              <div
                key={index}
                className="border-b border-white/20 py-6 cursor-pointer"
                onClick={() => setOpen(open === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base">{item.q}</h3>

                  <ChevronDown
                    size={20}
                    className={`transition ${
                      open === index ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {open === index && (
                  <p className="mt-4 text-white/70 text-sm leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-[40px] p-14 text-center">
          <h2 className="font-serif text-4xl">Ready to find your piece?</h2>

          <p className="mt-4 text-[#6E655E]">
            Explore furniture that already has a story.
          </p>

          <button className="mt-8 bg-[#18392B] text-white px-8 py-3 rounded-lg">
            Browse Marketplace
          </button>
        </div>
      </section>
          <Footer/>

    </div>

  );
}
