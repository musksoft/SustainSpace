import { ArrowRight, Award, MessageSquare, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F3EE] min-h-screen">
      
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36">
          <span className="bg-[#F1D1C2] text-[#8A5A44] px-4 py-1 rounded-full text-xs tracking-wide">
            SELLER ACADEMY
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl max-w-3xl font-serif text-[#18392B] leading-tight">
            Master the Art of Conscious Selling
          </h1>

          <p className="mt-6 text-[#6E655E] max-w-2xl leading-relaxed">
            Turn your curated finds and handcrafted pieces into a legacy.
            Learn how to bridge aesthetics with impact through our guide for
            modern artisans and conscious sellers.
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
      </section>

      {/* LISTING SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl text-[#18392B]">
            The Anatomy of a Perfect Listing
          </h2>

          <p className="text-[#847A71] mt-3">
            Quality begins before the first click.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* IMAGE CARD */}
          <div className="rounded-3xl overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="h-full object-cover"
            />
          </div>

          {/* CARD 1 */}
          <div className="bg-white rounded-3xl p-8">
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
              <li>• 4–6 high resolution photos</li>
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
                RECLAIMED
              </span>

              <span className="text-xs border border-white/30 px-3 py-1 rounded-full">
                UPCYCLED
              </span>

              <span className="text-xs border border-white/30 px-3 py-1 rounded-full">
                LOCAL
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

            <button
              onClick={() => navigate("/listings")}
              className="mt-8 flex items-center gap-2 text-[#18392B] font-medium"
            >
              Create Listing
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* MESSAGING */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl text-[#18392B] mb-6">
              The Language of Luxury:
              <br />
              Effective Messaging
            </h2>

            <p className="text-[#6B645F] leading-relaxed mb-8">
              Trust is built through transparency and professionalism.
              Conscious buyers value the journey as much as the piece itself.
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
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="rounded-3xl shadow-xl"
          />
        </div>
      </section>

      {/* VERIFIED SELLER */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-[#0E3828] rounded-[32px] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="flex justify-center mb-5">
            <Award size={32} />
          </div>

          <h2 className="font-serif text-5xl mb-5">
            Elevate Your Presence
          </h2>

          <p className="max-w-2xl mx-auto text-[#D9D2CC]">
            Apply for the SustainSpace Verified Seller Badge. Benefit from
            lower transaction fees, priority search placement and enhanced
            buyer trust.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button className="bg-[#D7AFA0] text-[#18392B] px-8 py-3 rounded-lg font-medium">
              Request Approval
            </button>

            <button className="border border-white/20 px-8 py-3 rounded-lg">
              View Requirements
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E7DED2] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl text-[#18392B]">
              SustainSpace
            </h3>

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