import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function BuyerGuide() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What if the item doesn't match?",
      answer:
        "Every listing is reviewed and verified. If an item arrives significantly different from its description, our support team will assist with resolution.",
    },
    {
      question: "How do I verify sustainability?",
      answer:
        "Each seller provides sourcing information, restoration details, and sustainability attributes which are reviewed before publishing.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Payments are processed through secure providers and held until the transaction is confirmed.",
    },
  ];

  const journeySteps = [
    {
      number: "01",
      title: "Discovering Your Piece",
      description:
        "Browse curated sustainable furniture and discover the story behind every creation.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
      bg: "bg-[#F3D0C4]",
    },
    {
      number: "02",
      title: "Connecting with Artisans",
      description:
        "Learn the origin of materials and engage directly with makers before purchasing.",
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=600&q=80",
      bg: "bg-[#EFEDE8]",
    },
    {
      number: "03",
      title: "Choosing Your Path",
      description:
        "Select artisan pickup or eco-delivery to reduce environmental impact.",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
      bg: "bg-[#16362D] text-white",
    },
    {
      number: "04",
      title: "Secure Handover",
      description:
        "Finalize your purchase through our protected process and enjoy your new piece.",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80",
      bg: "bg-[#EFEDE8]",
    },
  ];

  return (
    <div className="bg-[#F6F4F1] min-h-screen">

      {/* HERO */}

      <section className="px-6 pt-8">
        <div
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative min-h-[520px] flex items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-white/70"></div>

          <div className="relative z-10 max-w-2xl px-10 md:px-20">

            <span className="bg-[#F5D4C7] text-[#C66B42] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
              Buyer Sanctuary Guide
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-serif text-[#16362D] leading-tight">
              Your Journey to a Conscious Home
            </h1>

            <p className="mt-6 text-gray-700 text-lg leading-relaxed">
              Discover the soul of each object. Our guide helps you navigate
              the path from discovery to a secure handover, ensuring every
              piece in your sanctuary has a story worth telling.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">

              <button
                onClick={() => navigate("/shop")}
                className="bg-[#16362D] text-white px-8 py-3 rounded-xl"
              >
                Start Exploring
              </button>

              <button className="border border-[#16362D] text-[#16362D] px-8 py-3 rounded-xl">
                View Handbook
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* BUYER JOURNEY */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex justify-between items-center mb-10">

          <h2 className="text-4xl font-serif text-[#16362D]">
            The Buyer's Journey
          </h2>

          <span className="uppercase tracking-widest text-xs text-[#8B6D58]">
            Four Steps To Sanctuary
          </span>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {journeySteps.map((step) => (
            <div
              key={step.number}
              className={`${step.bg} rounded-3xl p-8 min-h-[280px] relative overflow-hidden`}
            >
              <div className="flex justify-between items-start">

                <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center font-semibold">
                  {step.number}
                </div>

                <img
                  src={step.image}
                  alt={step.title}
                  className="w-20 h-20 rounded-xl object-cover shadow-lg"
                />

              </div>

              <h3 className="mt-10 text-2xl font-serif">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed opacity-80">
                {step.description}
              </p>

              {step.number === "03" && (
                <div className="mt-6 space-y-3">

                  <button className="w-full border border-white rounded-xl py-3">
                    Eco Delivery
                  </button>

                  <button className="w-full border border-white rounded-xl py-3">
                    Artisan Pickup
                  </button>

                </div>
              )}

              {step.number === "02" && (
                <button className="mt-6 bg-[#16362D] text-white px-6 py-3 rounded-xl">
                  Make Offer
                </button>
              )}

            </div>
          ))}

        </div>

      </section>

      {/* PHILOSOPHY */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
            alt="Sanctuary"
            className="rounded-3xl shadow-lg"
          />

          <div>

            <h2 className="text-5xl font-serif text-[#16362D]">
              Our Sanctuary Philosophy
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Every piece listed on SustainSpace undergoes a rigorous
              transparency check. We believe the story of an object —
              where it was grown, who shaped it, and how it reached you —
              is as important as its aesthetic value.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-white p-5 rounded-xl border">
                <h4 className="font-semibold mb-2">
                  Material Sourcing
                </h4>
                <p className="text-sm text-gray-500">
                  100% verified reclaimed or certified sustainable wood.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border">
                <h4 className="font-semibold mb-2">
                  Low Carbon
                </h4>
                <p className="text-sm text-gray-500">
                  Prioritizing local artisans to reduce shipping impact.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="bg-white py-20">

        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-center text-5xl font-serif text-[#16362D] mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">

            {faqs.map((faq, index) => (

              <div
                key={index}
                className="border-b pb-4"
              >

                <button
                  onClick={() =>
                    setOpenFaq(
                      openFaq === index ? null : index
                    )
                  }
                  className="w-full flex justify-between items-center py-4"
                >

                  <span className="font-medium text-left">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition ${
                      openFaq === index
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {openFaq === index && (
                  <p className="pb-4 text-gray-600">
                    {faq.answer}
                  </p>
                )}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* SUPPORT */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="bg-[#16362D] rounded-3xl text-white text-center py-20 px-6 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-40 h-40 border border-white/10 rounded-full"></div>

          <div className="absolute bottom-0 left-0 w-52 h-52 border border-white/10 rounded-full"></div>

          <h2 className="text-4xl font-serif">
            Still need help?
          </h2>

          <p className="mt-6 text-green-100 max-w-xl mx-auto">
            Our Sanctuary Support team is available daily from
            9am to 6pm for any direct inquiries.
          </p>

          <button
            className="
              mt-8
              bg-white
              text-[#16362D]
              px-8
              py-3
              rounded-xl
              font-medium
            "
          >
            Chat with Support
          </button>

        </div>

      </section>

    </div>
  );
}
