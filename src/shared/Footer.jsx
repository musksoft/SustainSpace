import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <>
    {/* FOOTER */}
<footer className="bg-[#1e4837] text-white">

 <div className="max-w-6xl mx-auto px-6 py-14">

  <div className="grid md:grid-cols-5 gap-10">

    {/* Logo + Description */}
    <div className="-mt-4 md:col-span-2 mr-12">

      <img
        className="h-[80px] -ml-3 object-contain"
        src={assets.footerlogo}
        alt="SustainSpace"
      />

      <p className=" text-white/70 max-w-sm leading-6">
        We believe the most sustainable piece of furniture is the one that
        already exists. Restoring timeless pieces for a more conscious future.
      </p>

    </div>


    {/* Explore */}
    <div>
      <h3 className="text-sm uppercase tracking-[3px] text-[#f6e1bb] mb-5">
        Explore
      </h3>

      <ul className="space-y-3 text-white/80">

        <li className="hover:text-white cursor-pointer">
          Shop Collection
        </li>

        <li className="hover:text-white cursor-pointer">
          Sell Your Piece
        </li>

        <li className="hover:text-white cursor-pointer">
          About Us
        </li>

      </ul>
    </div>


    {/* Support */}
    <div>
      <h3 className="text-sm uppercase tracking-[3px] text-[#f6e1bb] mb-5">
        Support
      </h3>

      <ul className="space-y-3 text-white/80">

        <li className="hover:text-white cursor-pointer">
          Privacy Policy
        </li>

        <li className="hover:text-white cursor-pointer">
          Terms of Service
        </li>

        <li className="hover:text-white cursor-pointer">
          Contact Us
        </li>

      </ul>
    </div>


    {/* Company */}
    <div>
      <h3 className="text-sm uppercase tracking-[3px] text-[#f6e1bb] mb-5">
        Company
      </h3>

      <ul className="space-y-3 text-white/80">

        <li className="hover:text-white cursor-pointer">
          Our Story
        </li>

        <li className="hover:text-white cursor-pointer">
          Sustainability
        </li>

        <li className="hover:text-white cursor-pointer">
          Seller Community
        </li>

        <li className="hover:text-white cursor-pointer">
          Careers
        </li>

      </ul>
    </div>


  </div>

</div>


  {/* Bottom Bar */}
  <div className="border-t border-white/20">

    <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between gap-4 text-sm text-white">

      <p>
        © 2026 SustainSpace. Consciously Curated Furniture.
      </p>

      <p>
        Designed by Muskan with Sustainability in Mind. 🍃
      </p>

    </div>

  </div>

</footer></>
  )
}

export default Footer
