import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  Send,
  Flag,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "../../config/supabaseClient";

export default function ReportListing() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [transactions, setTransactions] = useState([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [reason, setReason] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // ==========================================
  // REPORT REASONS
  // ==========================================

  const reasons = [
    "Misrepresented Condition",
    "Non-Sustainable Materials",
    "Inauthentic or Counterfeit",
    "Suspicious Activity",
    "Other",
  ];


  // ==========================================
  // LOAD BUYER TRANSACTIONS
  // ==========================================

  useEffect(() => {
    loadTransactions();
  }, []);


  async function loadTransactions() {
    setLoading(true);

    setErrorMessage("");

    // Get logged-in user

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();


    if (userError || !user) {
      navigate("/");
      return;
    }


    /*
      Only completed transactions are shown.

      The buyer can therefore only report something
      that they actually purchased.
    */

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
          id,
          status,
          payment_method,
          delivery_method,
          created_at,

          orders(
            id,
            listing_id,
            agreed_price,
            status,

            listings(
              id,
              title,
              description,
              price,
              category,
              item_condition,
              location,
              featured_image,
              gallery_images,

              seller:profiles!listings_seller_id_fkey(
                id,
                full_name,
                email
              )
            )
          )
        `,
      )
      .eq("buyer_id", user.id)
      .eq("status", "completed")
      .order("created_at", {
        ascending: false,
      });


    if (error) {
      console.error(
        "Error loading transactions:",
        error,
      );

      setErrorMessage(
        "Unable to load your transactions.",
      );

      setLoading(false);

      return;
    }


    /*
      Remove transactions where the order/listing
      relationship is missing.
    */

    const validTransactions = (data || []).filter(
      (transaction) =>
        transaction.orders &&
        transaction.orders.listings,
    );


    setTransactions(validTransactions);

    setLoading(false);
  }


  // ==========================================
  // SELECTED LISTING
  // ==========================================

  const selectedOrder =
    selectedTransaction?.orders || null;

  const listing =
    selectedOrder?.listings || null;


  // ==========================================
  // LISTING IMAGE
  // ==========================================

  const listingImage =
    listing?.gallery_images?.[0] ||
    "https://placehold.co/400x300";


  // ==========================================
  // SUBMIT REPORT
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");


    // Make sure transaction was selected

    if (!selectedTransaction) {
      setErrorMessage(
        "Please select a listing to report.",
      );

      return;
    }


    // Make sure reason was selected

    if (!reason) {
      setErrorMessage(
        "Please select a reason for your report.",
      );

      return;
    }


    setSubmitting(true);


    // Get current user

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();


    if (userError || !user) {
      navigate("/");
      return;
    }


    /*
      Insert report.

      The database RLS policy should verify that:

      buyer_id
      ↓
      transaction_id
      ↓
      order_id
      ↓
      listing_id

      all belong together.
    */

    const { error } = await supabase
      .from("reports")
      .insert({
        buyer_id: user.id,

        listing_id: selectedOrder.listing_id,

        transaction_id:
          selectedTransaction.id,

        order_id: selectedOrder.id,

        reason: reason,

        description:
          description.trim() || null,

        status: "pending",
      });


    if (error) {
      console.error(
        "Error submitting report:",
        error,
      );


      /*
        If you later add a unique constraint for
        one report per transaction, this will also
        catch duplicate reports.
      */

      if (
        error.code === "23505"
      ) {
        setErrorMessage(
          "You have already reported this transaction.",
        );
      } else {
        setErrorMessage(
          "Unable to submit your report. Please try again.",
        );
      }


      setSubmitting(false);

      return;
    }


    setSuccessMessage(
      "Your report has been submitted successfully.",
    );


    /*
      Small delay so the success message can be seen.
    */

    setTimeout(() => {
      navigate("/buyer-dashboard");
    }, 1000);
  }


  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="min-h-screen bg-[#FAF8F4]">


      {/* ==========================================
          TOP NAVIGATION
      ========================================== */}

      <div
        className="
          max-w-6xl
          mx-auto
          px-5
          md:px-8
          pt-6
        "
      >

        <button
          onClick={() => navigate(-1)}
          className="
            flex
            items-center
            gap-2
            text-sm
            text-gray-500
            hover:text-[#1F3D2A]
            transition
          "
        >

          <ArrowLeft size={16} />

          Back

        </button>

      </div>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main
        className="
          max-w-6xl
          mx-auto
          px-5
          md:px-8
          py-6
          md:py-10
        "
      >


        {/* ========================================
            BREADCRUMB
        ======================================== */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-2
            text-xs
            text-gray-500
            mb-5
          "
        >

          <span>Home</span>

          <span>›</span>

          <span>Buyer Dashboard</span>

          <span>›</span>

          <span className="text-[#1F3D2A] font-medium">
            Report Listing
          </span>

        </div>


        {/* ========================================
            MAIN REPORT CARD
        ======================================== */}

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-[#E7DED4]
            shadow-sm
            overflow-hidden
            grid
            grid-cols-1
            lg:grid-cols-[40%_60%]
          "
        >


          {/* ======================================
              LEFT SIDE
          ====================================== */}

          <aside
            className="
              bg-[#F5F1EB]
              p-7
              md:p-8
              lg:p-9
              border-b
              lg:border-b-0
              lg:border-r
              border-[#E7DED4]
            "
          >


            {/* TITLE */}

            <p
              className="
                text-xs
                uppercase
                tracking-[0.18em]
                text-[#8B5E3C]
                font-semibold
              "
            >
              Report Listing
            </p>


            <h1
              className="
                text-2xl
                font-serif
                text-[#1F3D2A]
                mt-2
              "
            >
              Choose a listing
            </h1>


            <p
              className="
                text-sm
                text-gray-500
                mt-2
                leading-relaxed
              "
            >
              Select one of your completed purchases
              to report a problem with the listing.
            </p>


            {/* ====================================
                TRANSACTION LIST
            ==================================== */}

            <div className="mt-6">


              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-3
                "
              >

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    font-semibold
                    text-[#8B5E3C]
                  "
                >
                  Your Purchases
                </p>


                {!loading && (
                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    {transactions.length}{" "}
                    {transactions.length === 1
                      ? "purchase"
                      : "purchases"}
                  </span>
                )}

              </div>


              {/* LOADING */}

              {loading && (

                <div
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-[#E0D8CF]
                    p-6
                    text-center
                  "
                >

                  <div
                    className="
                      w-8
                      h-8
                      border-2
                      border-[#D8CEC4]
                      border-t-[#1F3D2A]
                      rounded-full
                      animate-spin
                      mx-auto
                      mb-3
                    "
                  />

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Loading your purchases...
                  </p>

                </div>

              )}


              {/* ERROR */}

              {!loading &&
                errorMessage &&
                transactions.length === 0 && (

                  <div
                    className="
                      bg-red-50
                      border
                      border-red-100
                      rounded-2xl
                      p-5
                      text-sm
                      text-red-600
                    "
                  >
                    {errorMessage}
                  </div>

                )}


              {/* NO TRANSACTIONS */}

              {!loading &&
                !errorMessage &&
                transactions.length === 0 && (

                  <div
                    className="
                      bg-white
                      rounded-2xl
                      border
                      border-[#E0D8CF]
                      p-6
                      text-center
                    "
                  >

                    <div className="text-4xl mb-3">
                      🧾
                    </div>

                    <h3
                      className="
                        font-semibold
                        text-[#1F3D2A]
                      "
                    >
                      No completed purchases
                    </h3>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-2
                      "
                    >
                      Listings from completed
                      transactions will appear here.
                    </p>

                  </div>

                )}


              {/* TRANSACTIONS */}

              {!loading &&
                transactions.length > 0 && (

                  <div className="space-y-3">

                    {transactions.map(
                      (transaction) => {

                        const item =
                          transaction.orders
                            ?.listings;

                        const image =
                          item?.gallery_images?.[0] ||
                          "https://placehold.co/200";


                        const selected =
                          selectedTransaction?.id ===
                          transaction.id;


                        return (

                          <button
                            key={transaction.id}
                            type="button"
                            onClick={() =>
                              setSelectedTransaction(
                                transaction,
                              )
                            }
                            className={`
                              w-full
                              text-left
                              bg-white
                              rounded-2xl
                              border
                              p-3
                              flex
                              items-center
                              gap-3
                              transition
                              ${
                                selected
                                  ? "border-[#1F3D2A] bg-[#F1F7F2] shadow-sm"
                                  : "border-[#DED5CB] hover:border-[#A9B9AC] hover:shadow-sm"
                              }
                            `}
                          >


                            {/* IMAGE */}

                            <img
                              src={image}
                              alt={
                                item?.title ||
                                "Listing"
                              }
                              className="
                                w-16
                                h-16
                                rounded-xl
                                object-cover
                                shrink-0
                                bg-gray-100
                              "
                            />


                            {/* DETAILS */}

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              <h3
                                className="
                                  font-semibold
                                  text-sm
                                  text-[#1F3D2A]
                                  truncate
                                "
                              >
                                {item?.title ||
                                  "Untitled Listing"}
                              </h3>


                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                  mt-1
                                "
                              >
                                Seller:{" "}

                                {item?.seller
                                  ?.full_name ||
                                  "Seller"}
                              </p>


                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-[#8B5E3C]
                                  mt-1
                                "
                              >
                                €

                                {transaction.orders
                                  ?.agreed_price ??
                                  item?.price ??
                                  "0"}
                              </p>

                            </div>


                            {/* SELECTED */}

                            {selected && (

                              <CheckCircle2
                                size={21}
                                className="
                                  text-[#1F3D2A]
                                  shrink-0
                                "
                              />

                            )}

                          </button>

                        );
                      },
                    )}

                  </div>

                )}

            </div>


            {/* ====================================
                SELECTED LISTING
            ==================================== */}

            {listing && (

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-5
                  mt-6
                  border
                  border-[#E8DED2]
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <ShieldCheck
                    size={18}
                    className="text-[#1F3D2A]"
                  />

                  <h3
                    className="
                      font-semibold
                      text-[#1F3D2A]
                    "
                  >
                    Selected Listing
                  </h3>

                </div>


                <div
                  className="
                    flex
                    gap-3
                    mt-4
                  "
                >

                  <img
                    src={listingImage}
                    alt={listing.title}
                    className="
                      w-20
                      h-20
                      rounded-xl
                      object-cover
                      border
                      border-[#E0D8CF]
                    "
                  />


                  <div className="min-w-0">

                    <p
                      className="
                        font-semibold
                        text-[#1F3D2A]
                        line-clamp-2
                      "
                    >
                      {listing.title}
                    </p>


                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      {listing.seller?.full_name ||
                        "Seller"}
                    </p>


                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        mt-2
                        bg-[#EAF3EC]
                        text-[#1F3D2A]
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                      "
                    >

                      <CheckCircle2 size={12} />

                      Purchased

                    </span>

                  </div>

                </div>

              </div>

            )}


            {/* ====================================
                INTEGRITY PROMISE
            ==================================== */}

            <div
              className="
                bg-[#105425]
                rounded-2xl
                p-5
                mt-5
                border
                border-[#E8DED2]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <ShieldCheck
                  size={18}
                  className="text-[#b1eec8]"
                />

                <h3
                  className="
                    font-semibold
                    text-[#dbefe2]
                  "
                >
                  Our Integrity Promise
                </h3>

              </div>


              <p
                className="
                  text-sm
                  text-white
                  leading-relaxed
                  mt-3
                "
              >
                We take marketplace reports seriously.
                Your report helps us maintain a
                trustworthy marketplace and protect
                our community.
              </p>

            </div>


            {/* ====================================
                CONFIDENTIAL
            ==================================== */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-2
                mt-10
                pt-5
                border-t
                border-[#E2D9CF]
                text-xs
                text-gray-500
              "
            >

              <ShieldCheck
                size={14}
                className="text-[#1F3D2A]"
              />

              Reporting is confidential to the
              seller.

            </div>

          </aside>


          {/* ======================================
              RIGHT SIDE
          ====================================== */}

          <section
            className="
              p-7
              md:p-9
              lg:p-10
            "
          >

            <div className="max-w-2xl">


              {/* LABEL */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[#A84732]
                  text-xs
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                "
              >

                <Flag size={14} />

                Marketplace Safety

              </div>


              {/* TITLE */}

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-serif
                  text-[#1F3D2A]
                  mt-2
                "
              >
                Why are you reporting this?
              </h2>


              <p
                className="
                  text-sm
                  text-gray-500
                  mt-2
                  leading-relaxed
                "
              >
                Please select the most appropriate
                reason for your report so our team can
                investigate effectively.
              </p>


              {/* ==================================
                  SELECT WARNING
              ================================== */}

              {!selectedTransaction && (

                <div
                  className="
                    mt-6
                    rounded-xl
                    bg-[#FFF6DA]
                    border
                    border-[#EBDFAE]
                    p-4
                    flex
                    gap-3
                  "
                >

                  <Flag
                    size={18}
                    className="
                      text-[#A06A00]
                      shrink-0
                    "
                  />

                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#80651A]
                      "
                    >
                      Select a listing first
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#80651A]
                        mt-1
                      "
                    >
                      Choose one of your completed
                      purchases from the left.
                    </p>

                  </div>

                </div>

              )}


              {/* ==================================
                  ERROR
              ================================== */}

              {errorMessage &&
                selectedTransaction && (

                  <div
                    className="
                      mt-6
                      rounded-xl
                      bg-red-50
                      border
                      border-red-100
                      px-4
                      py-3
                      text-sm
                      text-red-600
                    "
                  >
                    {errorMessage}
                  </div>

                )}


              {/* ==================================
                  SUCCESS
              ================================== */}

              {successMessage && (

                <div
                  className="
                    mt-6
                    rounded-xl
                    bg-green-50
                    border
                    border-green-200
                    px-4
                    py-3
                    text-sm
                    text-green-700
                    flex
                    items-center
                    gap-2
                  "
                >

                  <CheckCircle2 size={17} />

                  {successMessage}

                </div>

              )}


              {/* ==================================
                  REASONS
              ================================== */}

              <div className="mt-7">

                <label
                  className="
                    text-sm
                    font-semibold
                    text-[#1F3D2A]
                  "
                >
                  Reason for Report
                </label>


                <div className="mt-3 space-y-3">

                  {reasons.map((item) => (

                    <label
                      key={item}
                      className={`
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3.5
                        rounded-xl
                        border
                        cursor-pointer
                        transition
                        ${
                          reason === item
                            ? "border-[#1F3D2A] bg-[#F1F7F2]"
                            : "border-[#DED8D1] hover:border-[#A9B9AC]"
                        }
                      `}
                    >

                      <input
                        type="radio"
                        name="reason"
                        value={item}
                        checked={
                          reason === item
                        }
                        onChange={(e) => {
                          setReason(
                            e.target.value,
                          );

                          setErrorMessage("");
                        }}
                        className="
                          w-4
                          h-4
                          accent-[#1F3D2A]
                        "
                      />


                      <span
                        className={`
                          text-sm
                          ${
                            reason === item
                              ? "text-[#1F3D2A] font-medium"
                              : "text-gray-600"
                          }
                        `}
                      >
                        {item}
                      </span>

                    </label>

                  ))}

                </div>

              </div>


              {/* ==================================
                  DESCRIPTION
              ================================== */}

              <div className="mt-7">

                <label
                  className="
                    text-sm
                    font-semibold
                    text-[#1F3D2A]
                  "
                >

                  Detailed Description

                  <span
                    className="
                      font-normal
                      text-gray-400
                      ml-1
                    "
                  >
                    (Optional)
                  </span>

                </label>


                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Provide any additional context or details that might help our review team..."
                  className="
                    w-full
                    mt-2
                    rounded-xl
                    border
                    border-[#DED8D1]
                    bg-[#FCFBF9]
                    p-4
                    text-sm
                    text-gray-700
                    resize-none
                    outline-none
                    focus:border-[#1F3D2A]
                    focus:ring-2
                    focus:ring-[#1F3D2A]/10
                  "
                />

              </div>


              {/* ==================================
                  ACTIONS
              ================================== */}

              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:justify-end
                  gap-3
                  mt-7
                  pt-6
                  border-t
                  border-[#E8DED2]
                "
              >

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    border
                    border-[#D8CEC4]
                    text-gray-600
                    text-sm
                    font-medium
                    hover:bg-[#F8F5F1]
                    disabled:opacity-50
                    transition
                  "
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !selectedTransaction ||
                    !reason ||
                    submitting
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-3
                    rounded-xl
                    bg-[#A84732]
                    hover:bg-[#913D2C]
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                    text-white
                    text-sm
                    font-semibold
                    transition
                  "
                >

                  <Send size={16} />

                  {submitting
                    ? "Submitting..."
                    : "Submit Report"}

                </button>

              </div>


              {/* ==================================
                  MOBILE CONFIDENTIAL
              ================================== */}

              <div
                className="
                  lg:hidden
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-5
                  text-xs
                  text-gray-500
                "
              >

                <ShieldCheck
                  size={14}
                  className="text-[#1F3D2A]"
                />

                Reporting is confidential to the
                seller.

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}