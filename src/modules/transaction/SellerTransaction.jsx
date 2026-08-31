import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import SellerSidebar from "../profile/SellerSidebar";
import { Bell, Copy, CheckCircle, User, MapPin, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const SellerTransaction = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [order, setOrder] = useState(null);

  const [profile, setProfile] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      await loadTransaction(user.id);

      setLoading(false);
    };

    loadData();
  }, []);

  const loadTransaction = async (sellerId) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
      *,
      buyer:profiles!transactions_buyer_id_fkey(
        full_name,
        email
      ),
      orders(
  id,
  listing_id,
  title,
  image_url,
  agreed_price,
  status,
  listings(
    gallery_images
  )
)


    `,
      )
      .eq("seller_id", sellerId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("TRANSACTION ERROR:", error);
      return;
    }

    setTransaction(data);
  };

  const generateCode = async () => {
    if (!transaction) return;

    if (transaction.verification_code) {
      alert("Verification code already generated.");
      return;
    }

    setGenerating(true);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase
      .from("transactions")
      .update({
        verification_code: code,
      })
      .eq("id", transaction.id);

    setGenerating(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await loadTransaction(profile.id);
  };

  const completeTransaction = async () => {
    if (!transaction) return;

    setGenerating(true);

    // Complete transaction
    const { error: transactionError } = await supabase
      .from("transactions")
      .update({
        status: "completed",
      })
      .eq("id", transaction.id);

    if (transactionError) {
      console.error(transactionError);
      alert(transactionError.message);
      setGenerating(false);
      return;
    }

    // Complete order
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: "completed",
      })
      .eq("id", transaction.order_id);

    if (orderError) {
      console.error(orderError);
      alert(orderError.message);
      setGenerating(false);
      return;
    }

    // Mark listing sold
    const { error: listingError } = await supabase
      .from("listings")
      .update({
        status: "sold",
      })
      .eq("id", transaction.orders.listing_id);

    if (listingError) {
      console.error(listingError);
      alert(listingError.message);
      setGenerating(false);
      return;
    }

    alert("Transaction completed and listing marked as sold.");

    await loadTransaction(profile.id);

    setGenerating(false);
  };

  const copyCode = async () => {
    if (!transaction?.verification_code) return;

    await navigator.clipboard.writeText(transaction.verification_code);

    alert("Verification code copied.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Transaction not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      <SellerSidebar />

      <main className="flex-1 flex flex-col">
        <header className="hidden md:flex bg-[#1F3D2A] text-white px-8 py-5 justify-between items-center">
          <div>
            <p className="italic text-[#FFF9F3]">Transaction Verification</p>

            <h1 className="text-2xl font-semibold">{profile?.full_name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Bell size={20} />

            <div className="w-9 h-9 rounded-full bg-white text-[#1F3D2A] flex items-center justify-center font-semibold">
              {profile?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* PAGE TITLE */}

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-[#1F3D2A]">
                  Pickup Verification
                </h2>

                <p className="text-sm text-gray-500">
                  Share this code with the buyer to confirm pickup.
                </p>
              </div>

              <div
                className={` px-4 py-2 rounded-full text-sm
                  ${
                    transaction.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {transaction.status.replaceAll("_", " ")}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* LEFT SIDE */}

              <div className="lg:col-span-2 space-y-5">
                {/* BUYER CARD */}
                <div className="bg-white border rounded-xl p-5">
                  <p className="text-xs uppercase text-gray-400 mb-4">
                    Buyer Information
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F6F4F1] flex items-center justify-center">
                      <User size={22} className="text-[#1F3D2A]" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">
                        {transaction.buyer?.full_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {transaction.buyer?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PICKUP DETAILS */}

                <div className="bg-white border rounded-xl p-5">
                  <p className="text-xs uppercase text-gray-400 mb-4">
                    Pickup Details
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pickup Date</span>

                      <span className="font-medium">
                        {transaction.pickup_date}
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <MapPin size={17} className="text-[#8B5E3C]" />

                      <span>{transaction.pickup_location}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment</span>

                      <span className="font-medium capitalize">
                        {transaction.payment_method}
                      </span>
                    </div>
                  </div>
                </div>

                {/* VERIFICATION CODE + QR */}

                <div className="bg-white border rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Buyer Verification Code</h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Share the code or let the buyer scan the QR code.
                      </p>
                    </div>

                    {!transaction.verification_code && (
                      <button
                        onClick={generateCode}
                        disabled={generating}
                        className="
          bg-[#1F3D2A]
          text-white
          px-4
          py-2
          rounded-lg
          text-sm
          disabled:opacity-60
        "
                      >
                        {generating ? "Generating..." : "Generate Code"}
                      </button>
                    )}
                  </div>

                  {transaction.verification_code && (
                    <div className="mt-6">
                      {/* OTP DIGITS */}

                      <div className="flex justify-center gap-2">
                        {transaction.verification_code
                          .split("")
                          .map((digit, index) => (
                            <div
                              key={index}
                              className="
                w-11
                h-12
                rounded-lg
                bg-[#1F3D2A]
                text-white
                flex
                items-center
                justify-center
                text-xl
                font-semibold
              "
                            >
                              {digit}
                            </div>
                          ))}
                      </div>

                      {/* COPY BUTTON */}

                      <button
                        onClick={copyCode}
                        className="
          mt-5
          flex
          items-center
          gap-2
          text-[#8B5E3C]
          text-sm
        "
                      >
                        <Copy size={16} />
                        Copy Verification Code
                      </button>

                      {/* DIVIDER */}

                      <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />

                        <span className="text-xs text-gray-400 uppercase">
                          Or scan
                        </span>

                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* QR CODE */}

                      <div className="flex flex-col items-center">
                        <div
                          className="
          p-4
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-sm
        "
                        >
                          <QRCodeCanvas
                            value={transaction.verification_code}
                            size={180}
                            bgColor="#FFFFFF"
                            fgColor="#1F3D2A"
                            level="M"
                            includeMargin={true}
                          />
                        </div>

                        <div
                          className="
          flex
          items-center
          gap-2
          mt-4
          text-[#1F3D2A]
        "
                        >
                          <QrCode size={18} />

                          <p className="text-sm font-medium">
                            Scan to enter verification code
                          </p>
                        </div>

                        <p
                          className="
          text-xs
          text-gray-400
          text-center
          mt-1
          max-w-xs
        "
                        >
                          The buyer can scan this QR code instead of manually
                          entering the 6 digit code.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE */}

              <div className="space-y-5">
                {/* ORDER CARD */}
                <div className="bg-white border rounded-xl p-5">
                  <p className="text-xs uppercase text-gray-400 mb-4">
                    Order Summary
                  </p>

                  <img
                    src={transaction.orders?.listings?.gallery_images}
                    alt={transaction.orders?.title}
                    className="
                      w-full
                      h-40
                      rounded-lg
                      object-cover
                    "
                  />

                  <h3 className="font-semibold mt-4">
                    {transaction.orders?.title}
                  </h3>

                  <div className="border-t mt-4 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Item Price</span>
                      <span>€{transaction.orders?.agreed_price}</span>
                    </div>

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>

                      <span>€{transaction.orders?.agreed_price}</span>
                    </div>
                  </div>
                </div>
                {/* STATUS CARD */}
                <div className="bg-[#1F3D2A] rounded-xl p-5 text-white">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1" size={22} />

                    <div>
                      <h3 className="font-semibold">Secure Pickup</h3>

                      <p className="text-sm text-white/80 mt-1">
                        After the buyer enters the correct verification code,
                        the transaction can continue.
                      </p>
                    </div>
                  </div>
                </div>{" "}
                {transaction.status !== "completed" && (
                  <button
                    onClick={completeTransaction}
                    className="
      w-full
      mt-4
      bg-green-700
      text-white
      py-3
      rounded-xl
      font-semibold
    "
                  >
                    Confirm Pickup Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerTransaction;
