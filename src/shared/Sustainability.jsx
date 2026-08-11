import { ArrowRight, Leaf, Recycle, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";


export default function SustainabilityPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F3EE] min-h-screen">
  {/* HERO */}

{/* HERO SECTION */}

{/* =========================================
    HERO SECTION
========================================= */}

<section
  className="
    max-w-7xl
    mx-auto
    px-5
    sm:px-8
    lg:px-10
    py-12
    md:py-16
    lg:py-20
  "
>

  {/* =========================================
      BACKGROUND SHAPES
  ========================================= */}

  <div
    className="
      absolute
      top-20
      right-10
      w-64
      h-64
      bg-[#DDE9DF]
      rounded-full
      blur-3xl
      opacity-40
      -z-10
    "
  />

  <div
    className="
      absolute
      bottom-10
      left-10
      w-56
      h-56
      bg-[#E9DDD0]
      rounded-full
      blur-3xl
      opacity-30
      -z-10
    "
  />


  {/* =========================================
      HERO GRID
  ========================================= */}

  <div
    className="
      grid
      grid-cols-1
      lg:grid-cols-[0.95fr_1.15fr]
      items-center
      gap-6
      lg:gap-8
    "
  >


    {/* =========================================
        LEFT CONTENT
    ========================================= */}

    <motion.div

      initial={{
        opacity: 0,
        x: -30
      }}

      animate={{
        opacity: 1,
        x: 0
      }}

      transition={{
        duration: 0.7
      }}

      className="
        max-w-xl
      "
    >

      {/* LABEL */}

      <span
        className="
          inline-flex
          items-center
          gap-2
          px-3.5
          py-1.5
          rounded-full
          bg-[#117a4e]/30
          text-[#18392B]
          text-[11px]
          uppercase
          tracking-[0.22em]
          font-medium
          lg:ml-5
        "
      >
        ♻ Sustainable Furniture
      </span>


      {/* HEADING */}

      <h1
        className="
          mt-6
          font-serif
          text-4xl
          sm:text-5xl
          md:text-[50px]
          lg:text-[52px]
          leading-[1.06]
          text-[#18392B]
          ml-5
        "
      >
        Furniture
        <br />
        With A Story
        <br />
        Worth Continuing.
      </h1>


      {/* DESCRIPTION */}

      <p
        className="
          mt-5
          max-w-md
          text-[#6E655E]
          text-base
          md:text-[17px]
          leading-relaxed
          lg:  ml-5
        "
      >
        Every piece carries craftsmanship, memories,
        and materials that deserve another chapter.
        Discover furniture designed to live longer.
      </p>


      {/* BUTTONS */}

      <div
        className="
          mt-7
          flex
          flex-wrap
          gap-3
          lg:  ml-5
        "
      >

        <button
          onClick={() => navigate("/shop")}
          className="
            bg-[#18392B]
            text-white
            px-6
            py-2.5
            rounded-xl
            text-sm
            font-medium
            hover:bg-[#294C37]
            transition
          "
        >
          Explore Furniture
        </button>


        <button
          onClick={() => navigate("/sell")}
          className="
            border
            border-[#18392B]
            text-[#18392B]
            px-6
            py-2.5
            rounded-xl
            text-sm
            font-medium
            hover:bg-[#18392B]
            hover:text-white
            transition
          "
        >
          Sell Your Piece
        </button>

      </div>

    </motion.div>


    {/* =========================================
        RIGHT IMAGE AREA
    ========================================= */}

    <motion.div

      initial={{
        opacity: 0,
        scale: 0.97
      }}

      animate={{
        opacity: 1,
        scale: 1
      }}

      transition={{
        duration: 0.7
      }}

      className="
        relative
        w-full
        max-w-[620px]
        ml-auto
        pr-5
        sm:pr-7
        lg:pr-8
      "
    >


      {/* =====================================
          MAIN IMAGE
      ===================================== */}

      <img
        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
        className="
          w-full
          h-[340px]
          sm:h-[380px]
          lg:h-[410px]
          object-cover
          rounded-[30px]
          shadow-xl
        "
        alt="Sustainable furniture interior"
      />


      {/* =====================================
          FLOATING CARD
      ===================================== */}

      <div
        className="
          absolute
          -bottom-6
          -left-4
          sm:-left-5
          bg-white
          rounded-2xl
          shadow-lg
          p-4
          sm:p-5
          w-52
          sm:w-56
        "
      >

        <p
          className="
            text-[10px]
            uppercase
            tracking-widest
            text-[#8B5E3C]
            font-semibold
          "
        >
          Circular Living
        </p>


        <h3
          className="
            mt-2
            font-serif
            text-lg
            sm:text-xl
            text-[#18392B]
            leading-snug
          "
        >
          Give furniture another life
        </h3>


        <p
          className="
            mt-2
            text-xs
            sm:text-sm
            text-[#6E655E]
            leading-relaxed
          "
        >
          Reuse quality pieces instead of replacing them.
        </p>

      </div>


      {/* =====================================
          SMALL IMAGE
      ===================================== */}

      <img
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80"
        className="
          absolute
          -top-5
          -right-1
          sm:-top-6
          sm:-right-2
          w-28
          h-28
          sm:w-32
          sm:h-32
          object-cover
          rounded-2xl
          border-[6px]
          border-[#F7F3EE]
          shadow-lg
        "
        alt="Vintage chair"
      />

    </motion.div>

  </div>

</section>

      {/* WHY IT MATTERS */}
      <section className="bg-[#EFEAE4] py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl text-[#18392B]">
            The Life of a Piece
          </h2>

          <p className="italic mt-5 text-[#6E655E] max-w-3xl mx-auto">
            "Every piece of furniture has a story. Our mission is to make sure
            that story continues."
          </p>

          <p className="mt-6 text-[#6E655E] leading-relaxed max-w-4xl mx-auto">
            Furniture carries craftsmanship, materials, and memories. By keeping
            quality pieces in circulation, we reduce waste and encourage a more
            thoughtful way of furnishing homes.
          </p>
        </div>
      </section>

{/* CIRCULAR PILLARS */}

<section className="max-w-6xl mx-auto px-6 py-12">

  <div className="text-center mb-10">

    <h2 className="font-serif text-4xl text-[#18392B]">
      Why Circular Furniture Matters
    </h2>

    <p className="mt-3 text-[#436937]">
      Small choices create longer lives for quality furniture.
    </p>

  </div>


  <div className="grid md:grid-cols-3 gap-5">

    {[
      {
        icon: Leaf,
        title: "Less Waste",
        text: "Keeping furniture in use reduces unnecessary disposal.",
        color: "#DDF2D8",
      },

      {
        icon: Recycle,
        title: "Reuse First",
        text: "Quality pieces deserve another owner before replacement.",
        color: "#F4D8D8",
      },

      {
        icon: TreePine,
        title: "Better Resources",
        text: "Extending furniture life reduces demand for new materials.",
        color: "#ece6ad",
      },

    ].map((item, index) => {

      const Icon = item.icon;


      return (

        <motion.div
          key={item.title}

          initial={{
            opacity:0,
            y:40,
          }}

          whileInView={{
            opacity:1,
            y:0,
          }}

          viewport={{
            once:true,
            amount:0.3,
          }}

          transition={{
            duration:0.5,
            delay:index * 0.15,
          }}

          className="
            relative
            overflow-hidden
            bg-white
            rounded-3xl
            p-7
            border
            border-[#E7DED2]
            min-h-[200px]
          "
        >


          {/* PASTEL FILL ANIMATION */}

          <motion.div

            initial={{
              scale:0,
            }}

            whileInView={{
              scale:1,
            }}

            viewport={{
              once:true,
              amount:0.5,
            }}

            transition={{
              duration:1,
              delay:index * 0.15,
              ease:"easeOut",
            }}

            style={{
              backgroundColor:item.color,
            }}

            className="
              absolute
              top-0
              left-0
              w-full
              h-full
              origin-top-left
              rounded-3xl
              z-0
            "

          />



          {/* CONTENT */}

          <div className="relative z-10">


            <motion.div

              initial={{
                x:-30,
                opacity:0,
              }}

              whileInView={{
                x:0,
                opacity:1,
              }}

              viewport={{
                once:true,
              }}

              transition={{
                duration:0.6,
                delay:index * 0.15 + 0.3,
              }}

              className="
                w-12
                h-12
                rounded-full
                bg-[#18392B]/10
                flex
                items-center
                justify-center
              "

            >

              <Icon
                size={25}
                className="text-[#18392B]"
              />

            </motion.div>



            <h3
              className="
                font-serif
                text-xl
                mt-5
                text-[#18392B]
              "
            >
              {item.title}
            </h3>



            <p
              className="
                mt-3
                text-sm
                text-[#6E655E]
                leading-relaxed
              "
            >
              {item.text}
            </p>


          </div>


        </motion.div>

      );

    })}

  </div>


</section>
{/* CONDITION STANDARDS */}

<section className="max-w-6xl mx-auto px-6 py-16">

  <div className="text-center mb-10">

    <h2 className="font-serif text-4xl text-[#18392B]">
      Condition Standards
    </h2>

    <p className="mt-3 text-[#6E655E]">
      Every piece should be honest, functional, and ready for another home.
    </p>

  </div>



  <div className="grid md:grid-cols-3 gap-5">


    {[
      {
        grade: "A+",
        title: "Excellent",
        text:
          "Like-new condition with minimal signs of use and strong structural quality.",
        color: "bg-[#DDEEDB]",
        badge: "bg-[#18392B]",
      },

      {
        grade: "A",
        title: "Good",
        text:
          "Minor cosmetic marks while remaining fully functional and well maintained.",
        color: "bg-[#F2D7D5]",
        badge: "bg-[#C98F8F]",
      },

      {
        grade: "B",
        title: "Fair",
        text:
          "Visible signs of use but still suitable for everyday living.",
        color: "bg-[#DCE8D5]",
        badge: "bg-[#A8BD92]",
      },

    ].map((item,index)=>(


      <motion.div

        key={item.title}

        initial={{
          opacity:0,
          y:40
        }}

        whileInView={{
          opacity:1,
          y:0
        }}

        viewport={{
          once:true
        }}

        transition={{
          duration:.5,
          delay:index*.15
        }}


        className="
        group
        relative
        overflow-hidden
        bg-white
        rounded-3xl
        p-7
        border
        border-[#E7DED2]
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-500
        "


      >


        {/* SLIDING COLOR BACKGROUND */}

        <div

          className={`
          absolute
          inset-y-0
          left-0
          w-0
          ${item.color}
          group-hover:w-full
          transition-all
          duration-700
          ease-out
          `}

        />



        {/* CONTENT */}

        <div className="relative z-10">



          {/* GRADE BADGE */}

          <motion.div

            className={`
            w-12
            h-12
            rounded-full
            ${item.badge}
            flex
            items-center
            justify-center
            text-white
            font-semibold
            transition-all
            duration-500
            group-hover:scale-110
            `}

          >

            {item.grade}

          </motion.div>





          <h3
            className="
            mt-5
            font-serif
            text-2xl
            text-[#18392B]
            "
          >

            {item.title}

          </h3>




          <p
            className="
            mt-3
            text-sm
            text-[#6E655E]
            leading-relaxed
            "
          >

            {item.text}

          </p>



        </div>



      </motion.div>


    ))}


  </div>


</section>
      {/* BUILT TO LAST */}
      <section className="bg-[#EFEAE4] py-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <img
            src={assets.new2}
            className="rounded-3xl h-[420px] w-full object-cover"
            alt="Furniture interior"
          />

          <div>
            <span className="uppercase tracking-[0.25em] text-xs text-[#6E655E]">
              Longevity
            </span>

            <h2 className="mt-4 font-serif text-4xl text-[#18392B]">
              Built For More Than One Home
            </h2>

            <p className="mt-5 text-[#6E655E] leading-relaxed">
              Quality furniture represents valuable materials, craftsmanship,
              and time. Extending its life means fewer resources are wasted and
              more homes gain pieces with character.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-4">
                <span className="font-serif text-xl text-[#18392B]">01</span>

                <p className="text-sm text-[#6E655E]">
                  Preserve craftsmanship and materials.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="font-serif text-xl text-[#18392B]">02</span>

                <p className="text-sm text-[#6E655E]">
                  Reduce unnecessary furniture disposal.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="font-serif text-xl text-[#18392B]">03</span>

                <p className="text-sm text-[#6E655E]">
                  Create homes filled with meaningful pieces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* IMPACT */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl text-[#18392B]">Our Impact</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-8 border border-[#E7DED2]">
            <h3 className="font-serif text-5xl text-[#18392B]">20+</h3>

            <p className="mt-3 text-[#6E655E]">
              Years quality furniture can continue serving homes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E7DED2]">
            <h3 className="font-serif text-5xl text-[#18392B]">♻</h3>

            <p className="mt-3 text-[#6E655E]">
              Encouraging reuse instead of unnecessary replacement.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E7DED2]">
            <h3 className="font-serif text-5xl text-[#18392B]">∞</h3>

            <p className="mt-3 text-[#6E655E]">
              Every piece has the potential for another chapter.
            </p>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-[#18392B] rounded-[32px] p-10 md:p-16 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl">
            Give Furniture Another Life
          </h2>

          <p className="mt-5 max-w-xl mx-auto text-white/75">
            Whether you are selling a piece or finding one, every choice
            supports a more thoughtful way of furnishing homes.
          </p>

          <button
            onClick={() => navigate("/sell")}
            className="mt-8 bg-[#D7AFA0] text-[#18392B] px-8 py-3 rounded-lg inline-flex items-center gap-2"
          >
            Start Selling
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
