import { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  ShieldCheck,
  BadgeDollarSign,
  CheckCircle,
  Loader2,
  QrCode,
  X,
} from "lucide-react";

import RatingModal from "./RatingModal";
import BuyerSidebar from "../profile/BuyerSidebar";
import Reviews from "../listings/Reviews";

import { Html5Qrcode } from "html5-qrcode";

export default function BuyerTransaction() {
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

const [showScanner, setShowScanner] = useState(false);
const [scanner, setScanner] = useState(null);
const [scanError, setScanError] = useState("");
  const [showRatingModal, setShowRatingModal] =
    useState(false);
    

  const [code, setCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  /*
  ==========================================
  LOAD ACTIVE TRANSACTION
  ==========================================
  */

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        seller:profiles!transactions_seller_id_fkey(
          full_name,
          email
        ),
        orders(
          id,
          listing_id,
          title,
          image_url,
          agreed_price
        ),
        reviews(
          id,
          rating,
          comment
        )
      `)
      .eq("buyer_id", user.id)
      .neq("status", "completed")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Transaction error:",
        error
      );

      setTransaction(null);
      setLoading(false);
      return;
    }

    setTransaction(data || null);
    setLoading(false);
  };

  /*
  ==========================================
  OTP INPUT
  ==========================================
  */

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const updated = [...code];

    updated[index] = value;

    setCode(updated);

    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  /*
  ==========================================
  BACKSPACE
  ==========================================
  */

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }
  };

  // VERIFY QR
  const stopScanner = async () => {
  if (!scanner) {
    setShowScanner(false);
    return;
  }

  try {
    await scanner.stop();
    await scanner.clear();
  } catch (error) {
    console.error("Scanner stop error:", error);
  }

  setScanner(null);
  setShowScanner(false);
};

const startScanner = async () => {
  setScanError("");
  setShowScanner(true);

  const html5QrCode = new Html5Qrcode("qr-reader");

  setScanner(html5QrCode);

  try {
    await html5QrCode.start(
      {
        facingMode: "environment",
      },
      {
        fps: 10,
        qrbox: {
          width: 220,
          height: 220,
        },
      },
      async (decodedText) => {
        const scannedCode = decodedText.trim();

        /*
         * QR should contain exactly
         * the 6 digit verification code.
         */

        if (!/^\d{6}$/.test(scannedCode)) {
          setScanError(
            "Invalid QR code. Please scan the seller's verification QR code."
          );

          return;
        }

        /*
         * Put scanned code into OTP fields.
         */

        setCode(scannedCode.split(""));

        /*
         * Stop scanner.
         */

        try {
          await html5QrCode.stop();
          await html5QrCode.clear();
        } catch (error) {
          console.error(
            "Scanner cleanup error:",
            error
          );
        }

        setScanner(null);
        setShowScanner(false);
        setScanError("");
      },
      () => {
        /*
         * Ignore normal scanning failures.
         *
         * The scanner continuously tries
         * to detect a QR code.
         */
      }
    );
  } catch (error) {
    console.error("QR scanner error:", error);

    setScanError(
      "Unable to access the camera. Please allow camera permission or enter the code manually."
    );

    setScanner(null);
  }
};

  /*
  ==========================================
  VERIFY OTP
  ==========================================
  */

  const verifyCode = async () => {
    if (!transaction) {
      return;
    }

    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      alert(
        "Please enter the complete 6 digit code."
      );
      return;
    }

    setVerifying(true);

    /*
    COMPARE WITH DATABASE
    */

    if (
      enteredCode !==
      transaction.verification_code
    ) {
      setVerifying(false);

      alert(
        "Invalid verification code."
      );

      return;
    }

    /*
    COMPLETE TRANSACTION
    */

    const {
      error: transactionError,
    } = await supabase
      .from("transactions")
      .update({
        status: "completed",
      })
      .eq("id", transaction.id);

    if (transactionError) {
      console.error(transactionError);

      setVerifying(false);

      alert(
        transactionError.message
      );

      return;
    }

    /*
    COMPLETE ORDER
    */

    const {
      error: orderError,
    } = await supabase
      .from("orders")
      .update({
        status: "completed",
      })
      .eq(
        "id",
        transaction.order_id
      );

    if (orderError) {
      console.error(orderError);

      setVerifying(false);

      alert(
        orderError.message
      );

      return;
    }

    /*
    MARK LISTING AS SOLD
    */

    const {
      error: listingError,
    } = await supabase
      .from("listings")
      .update({
        status: "sold",
      })
      .eq(
        "id",
        transaction.orders.listing_id
      );

    if (listingError) {
      console.error(listingError);

      setVerifying(false);

      alert(
        listingError.message
      );

      return;
    }

    setVerifying(false);

    /*
    CHECK EXISTING REVIEW
    */

    const {
      data: existingReview,
    } = await supabase
      .from("reviews")
      .select("id")
      .eq(
        "transaction_id",
        transaction.id
      )
      .maybeSingle();

    if (existingReview) {
      alert(
        "Transaction completed successfully."
      );

      navigate("/buyer-dashboard");

      return;
    }

    /*
    OPEN RATING MODAL
    */

    setShowRatingModal(true);
  };

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {
    return (
      <div className="
        min-h-screen
        bg-[#FAF7F2]
        flex
        items-center
        justify-center
      ">
        <Loader2
          size={35}
          className="
            animate-spin
            text-[#1F3D2A]
          "
        />
      </div>
    );
  }

  /*
  ==========================================
  PAGE
  ==========================================
  */

  return (
    <div className="
      min-h-screen
      bg-[#FAF7F2]
      flex
      flex-col
      lg:flex-row
    ">

      {/* =====================================
          BUYER SIDEBAR
          ===================================== */}

      <BuyerSidebar />


      {/* =====================================
          MAIN CONTENT
          ===================================== */}

      <main className="
        flex-1
        w-full
        px-4
        py-6
        sm:px-6
        lg:px-10
        xl:px-12
      ">

        <div className="
          max-w-6xl
          mx-auto
        ">

          {/* =================================
              PAGE TITLE
              ================================= */}

          <div className="mb-7">

            <div className="mb-7 lg:mb-8">

          <h1 className="
            text-3xl
            lg:text-4xl
            font-serif
            text-[#1F3D2A]
          ">
            Transactions
          </h1>

          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Manage your secure handovers and reviews.
          </p>

        </div>


         

          </div>


          {/* =================================
              ACTIVE TRANSACTION
              ================================= */}

          {transaction ? (

            <div className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              shadow-sm
              overflow-hidden
            ">

              {/* ==============================
                  DESKTOP TRANSACTION HEADER
                  ============================== */}

              <div className="
                px-6
                py-5
                lg:px-8
                border-b
                border-gray-100
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              ">

                <div>

                  <p className="
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    text-gray-400
                    font-medium
                  ">
                    Active Secure Handover
                  </p>

                  <h2 className="
                    text-xl
                    font-semibold
                    text-gray-900
                    mt-1
                  ">
                    {transaction.orders?.title}
                  </h2>

                </div>

                <span className="
                  self-start
                  sm:self-auto
                  inline-flex
                  items-center
                  gap-1.5
                  bg-green-100
                  text-green-700
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                ">

                  <ShieldCheck size={16} />

                  Verified

                </span>

              </div>


          

              <div className="
                p-5
                sm:p-6
                lg:p-8
                grid
                grid-cols-1
                lg:grid-cols-[1fr_1.15fr_1fr]
                gap-8
                lg:gap-10
                items-start
              ">


                {/* ===============================
                    SELLER
                    =============================== */}

                <div>

                  <p className="
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    text-gray-400
                    font-medium
                  ">
                    Seller Information
                  </p>

                  <h3 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                    mt-2
                  ">
                    {transaction.seller?.full_name}
                  </h3>

                  <div className="
                    flex
                    items-start
                    gap-2
                    mt-4
                    text-gray-500
                    text-sm
                  ">

                    <MapPin
                      size={19}
                      className="
                        flex-shrink-0
                        mt-0.5
                      "
                    />

                    <span>
                      {transaction.pickup_location}
                    </span>

                  </div>

                  {/* PRODUCT */}

                  <div className="
                    mt-7
                    flex
                    items-center
                    gap-4
                  ">

                    {transaction.orders?.image_url && (
                      <img
                        src={
                          transaction
                            .orders
                            .image_url
                        }
                        alt={
                          transaction
                            .orders
                            .title
                        }
                        className="
                          w-20
                          h-16
                          rounded-xl
                          object-cover
                          border
                        "
                      />
                    )}

                    <div>

                      <p className="
                        text-xs
                        text-gray-400
                      ">
                        Item
                      </p>

                      <p className="
                        font-medium
                        text-gray-800
                        mt-1
                      ">
                        {transaction.orders?.title}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ===============================
                    OTP
                    =============================== */}

                <div>

                  <h2 className="
                    text-xl
                    font-semibold
                    text-gray-900
                    mb-5
                  ">
                    Enter Seller Code
                  </h2>

                  <div className="
                    flex
                    justify-between
                    gap-2
                  ">

                    {code.map(
                      (digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleChange(
                              index,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(
                              index,
                              e
                            )
                          }
                          className="
                            h-14
                            w-10
                            sm:w-12
                            lg:w-11
                            xl:w-12
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-center
                            text-xl
                            font-bold
                            text-gray-900
                            outline-none
                            transition
                            focus:border-[#1F3D2A]
                            focus:ring-2
                            focus:ring-[#1F3D2A]/10
                          "
                        />
                      )
                    )}

                  </div>

                  <button
  type="button"
  onClick={startScanner}
  className="
    mt-5
    w-full
    rounded-xl
    border
    border-[#1F3D2A]
    text-[#1F3D2A]
    py-3
    px-4
    font-medium
    flex
    items-center
    justify-center
    gap-2
    hover:bg-[#1F3D2A]
    hover:text-white
    transition
  "
>
  <QrCode size={19} />

  Scan Seller QR Code
</button>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-4
                    leading-relaxed
                  ">
                    Ask the seller for the
                    6 digit pickup code.
                  </p>

                </div>


                {/* ===============================
                    PAYMENT + VERIFY
                    =============================== */}

                <div className="
                  flex
                  flex-col
                  gap-5
                ">

                  {/* PAYMENT */}

                  <div className="
                    rounded-2xl
                    bg-[#95633E]
                    text-white
                    p-5
                  ">

                    <div className="
                      flex
                      justify-between
                      items-center
                    ">

                      <div>

                        <p className="
                          text-sm
                          text-white/75
                        ">
                          Payment Method
                        </p>

                        <h2 className="
                          text-xl
                          font-bold
                          mt-1
                        ">
                          {transaction.payment_method}
                        </h2>

                      </div>

                      <BadgeDollarSign
                        size={38}
                      />

                    </div>

                    <p className="
                      text-sm
                      mt-4
                      text-white/80
                      leading-relaxed
                    ">
                      Confirm cash/payment only
                      after checking the item.
                    </p>

                  </div>


                  {/* VERIFY BUTTON */}

                  <button
                    onClick={verifyCode}
                    disabled={verifying}
                    className="
                      w-full
                      rounded-2xl
                      bg-[#1F3D2A]
                      hover:bg-[#173021]
                      py-4
                      text-white
                      font-semibold
                      flex
                      justify-center
                      items-center
                      gap-2
                      transition
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >

                    {verifying ? (
                      <>
                        <Loader2
                          size={21}
                          className="
                            animate-spin
                          "
                        />

                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle
                          size={21}
                          className="ml-3"
                        />

                        Verify & Confirm Payment
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          ) : (

            /* =================================
               NO ACTIVE TRANSACTION
               ================================= */

            <div className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              shadow-sm
              p-8
              text-center
            ">

              <h2 className="
                text-xl
                font-semibold
                text-[#1F3D2A]
              ">
                No Active Transaction
              </h2>

              <p className="
                text-gray-500
                mt-2
                text-sm
              ">
                You don't currently have an
                active transaction waiting
                for verification.
              </p>

            </div>

          )}


          {/* =================================
              REVIEWS

              IMPORTANT:
              This is OUTSIDE the transaction
              card, so it is ALWAYS BELOW it.
              ================================= */}

          <section className="
            mt-10
            lg:mt-12
          ">

            
          <div className="
            flex
            items-end
            justify-between
            mb-5
          ">

            <div>

              <h2 className="
                text-2xl
                lg:text-3xl
                font-serif
                text-[#1F3D2A]
              ">
                Reviews
              </h2>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Your completed transactions and seller
                reviews.
              </p>

            </div>

          </div>

            {/* 
              Reviews keeps its existing logic.
              It is simply placed below the
              transaction now.
            */}

            <div className="
              w-full
            ">
              <Reviews />
            </div>

          </section>

        </div>

      </main>


      {/* =====================================
          RATING MODAL
          ===================================== */}

      <RatingModal
        open={showRatingModal}
        transaction={transaction}
        onClose={() => {
          setShowRatingModal(false);
          navigate("/buyer-dashboard");
        }}
        onSubmitted={() => {
          setShowRatingModal(false);
          navigate("/buyer/:id");
        }}
      />
{/* =====================================
    QR SCANNER MODAL
    ===================================== */}

{showScanner && (
  <div className="
    fixed
    inset-0
    z-50
    bg-black/60
    flex
    items-center
    justify-center
    p-4
  ">

    <div className="
      w-full
      max-w-md
      bg-white
      rounded-2xl
      shadow-2xl
      overflow-hidden
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        justify-between
        px-5
        py-4
        border-b
      ">

        <div>
          <h2 className="
            text-lg
            font-semibold
            text-[#1F3D2A]
          ">
            Scan Verification QR
          </h2>

          <p className="
            text-xs
            text-gray-500
            mt-1
          ">
            Point your camera at the seller's QR code.
          </p>
        </div>

        <button
          type="button"
          onClick={stopScanner}
          className="
            w-9
            h-9
            rounded-full
            bg-gray-100
            flex
            items-center
            justify-center
            text-gray-600
            hover:bg-gray-200
          "
        >
          <X size={20} />
        </button>

      </div>

      {/* CAMERA */}

      <div className="p-5">

        <div
          id="qr-reader"
          className="
            w-full
            overflow-hidden
            rounded-xl
            bg-black
          "
        />

        {scanError && (
          <div className="
            mt-4
            bg-red-50
            border
            border-red-100
            text-red-600
            text-sm
            rounded-xl
            p-3
          ">
            {scanError}
          </div>
        )}

        <button
          type="button"
          onClick={stopScanner}
          className="
            w-full
            mt-4
            py-3
            rounded-xl
            bg-gray-100
            text-gray-700
            font-medium
            hover:bg-gray-200
          "
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}