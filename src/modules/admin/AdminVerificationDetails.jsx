import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

const STORAGE_BUCKET = "seller-verification-documents";

export default function AdminVerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  const [primaryUrl, setPrimaryUrl] = useState("");
  const [secondaryUrl, setSecondaryUrl] = useState("");

  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadVerification();
  }, [id]);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return null;
    }

    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, active")
      .eq("user_id", user.id)
      .eq("active", true)
      .single();

    if (error || !admin) {
      navigate("/");
      return null;
    }

    return user;
  }

  async function loadVerification() {
    setLoading(true);
    setError("");

    try {
      const user = await checkAdmin();

      if (!user) {
        return;
      }

      const { data, error: verificationError } = await supabase
        .from("seller_verifications")
        .select(`
          *,
          seller:profiles!seller_verifications_seller_id_fkey(
            id,
            full_name,
            email,
            is_verified_seller
          )
        `)
        .eq("id", id)
        .single();

      if (verificationError) {
        throw verificationError;
      }

      setVerification(data);

      await createDocumentUrls(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load verification request."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createDocumentUrls(data) {
    if (data.primary_document_path) {
      const { data: primarySignedUrl, error } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(
            data.primary_document_path,
            60 * 10
          );

      if (!error) {
        setPrimaryUrl(primarySignedUrl?.signedUrl || "");
      }
    }

    if (data.secondary_document_path) {
      const { data: secondarySignedUrl, error } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(
            data.secondary_document_path,
            60 * 10
          );

      if (!error) {
        setSecondaryUrl(
          secondarySignedUrl?.signedUrl || ""
        );
      }
    }
  }

  async function approveVerification() {
    setError("");
    setSuccess("");

    if (!verification) {
      return;
    }

    if (verification.status !== "submitted") {
      setError(
        "Only verification requests waiting for review can be approved."
      );
      return;
    }

    const confirmed = window.confirm(
      `Approve verification for ${verification.seller?.full_name}?`
    );

    if (!confirmed) {
      return;
    }

    setProcessing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      /*
       * First approve the verification request.
       */
      const { data: updatedVerification, error: verificationError } =
        await supabase
          .from("seller_verifications")
          .update({
            status: "approved",
            rejection_reason: null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.id,
          })
          .eq("id", verification.id)
          .eq("status", "submitted")
          .select()
          .single();

      if (verificationError) {
        throw verificationError;
      }

      /*
       * Then mark seller as verified.
       */
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_verified_seller: true,
        })
        .eq("id", verification.seller_id);

      if (profileError) {
        /*
         * The verification was approved but profile update failed.
         * Stop here and report the problem rather than pretending
         * everything succeeded.
         */
        throw profileError;
      }

      setVerification((current) => ({
        ...current,
        ...updatedVerification,
        seller: {
          ...current.seller,
          is_verified_seller: true,
        },
      }));

      setSuccess(
        "Seller verification approved successfully."
      );
    } catch (err) {
      console.error(
        "Approve verification error:",
        err
      );

      setError(
        err?.message ||
          "Unable to approve verification."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function rejectVerification() {
    setError("");
    setSuccess("");

    if (!verification) {
      return;
    }

    if (verification.status !== "submitted") {
      setError(
        "Only verification requests waiting for review can be rejected."
      );
      return;
    }

    if (!rejectionReason.trim()) {
      setError(
        "Please provide a reason for rejecting this verification request."
      );
      return;
    }

    setProcessing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const { data: updatedVerification, error } =
        await supabase
          .from("seller_verifications")
          .update({
            status: "rejected",
            rejection_reason: rejectionReason.trim(),
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.id,
          })
          .eq("id", verification.id)
          .eq("status", "submitted")
          .select()
          .single();

      if (error) {
        throw error;
      }

      setVerification((current) => ({
        ...current,
        ...updatedVerification,
      }));

      setRejecting(false);

      setSuccess(
        "Verification request rejected. The seller can now see the rejection reason."
      );
    } catch (err) {
      console.error(
        "Reject verification error:",
        err
      );

      setError(
        err?.message ||
          "Unable to reject verification."
      );
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="animate-spin text-[#1F3D2A]"
            size={32}
          />

          <p className="text-sm text-gray-500">
            Loading verification request...
          </p>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-[#FBF9F5]">
        <AdminSidebar />

        <main className="lg:ml-64 p-8">
          <div className="bg-white border rounded-xl p-10 text-center">
            <AlertCircle
              className="mx-auto text-red-500"
              size={40}
            />

            <h2 className="text-xl font-serif mt-4">
              Verification request not found
            </h2>

            <button
              onClick={() =>
                navigate("/admin/verifications")
              }
              className="mt-6 bg-[#1F3D2A] text-white px-5 py-3 rounded-lg"
            >
              Back to Verifications
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isPending =
    verification.status === "submitted";

  const isApproved =
    verification.status === "approved";

  const isRejected =
    verification.status === "rejected";

  return (
    

  <div className="min-h-screen bg-[#F7F5F1]">
    <div className="flex">
    <AdminSidebar />

    <main className="lg: p-5 md:p-8">

        <button
          onClick={() =>
            navigate("/admin/verifications")
          }
          className="
            flex
            items-center
            gap-2
            text-sm
            text-[#1F3D2A]
            hover:text-[#8B5E3C]
            mb-6
          "
        >
          <ArrowLeft size={16} />
          Back to Verification Requests
        </button>

        <div className="mb-8">

          <p className="text-[#8B5E3C] font-semibold tracking-wider text-sm">
            ADMIN PANEL
          </p>

          <h1 className="text-3xl font-serif text-[#1F3D2A]">
            Seller Verification Review
          </h1>

          <p className="text-gray-500 mt-1">
            Review the seller's submitted identity documents.
          </p>

        </div>

        {error && (
          <div className="mb-5 flex gap-3 items-start bg-red-50 border border-red-100 text-red-700 rounded-lg p-4">
            <AlertCircle size={18} />

            <p className="text-sm">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-5 flex gap-3 items-start bg-green-50 border border-green-100 text-green-700 rounded-lg p-4">
            <CheckCircle2 size={18} />

            <p className="text-sm">
              {success}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          <div className="space-y-6">

            {/* SELLER INFORMATION */}

            <div className="bg-white border rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-full bg-[#D9F0E0] flex items-center justify-center">
                  <ShieldCheck
                    size={22}
                    className="text-[#1F3D2A]"
                  />
                </div>

                <div>
                  <h2 className="font-serif text-xl text-[#1F3D2A]">
                    Seller Information
                  </h2>

                  <p className="text-xs text-gray-500">
                    Applicant details
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Full Name
                  </p>

                  <p className="font-semibold mt-1">
                    {verification.seller?.full_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold mt-1">
                    {verification.seller?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Attempt
                  </p>

                  <p className="font-semibold mt-1">
                    #{verification.attempt_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Submitted
                  </p>

                  <p className="font-semibold mt-1">
                    {new Date(
                      verification.created_at
                    ).toLocaleString()}
                  </p>
                </div>

              </div>

            </div>

            {/* DOCUMENTS */}

            <div className="bg-white border rounded-2xl p-6">

              <div className="mb-6">

                <h2 className="font-serif text-xl text-[#1F3D2A]">
                  Verification Documents
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review the submitted identity documentation carefully.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <DocumentCard
                  title="Primary Document"
                  url={primaryUrl}
                  required
                />

                {verification.secondary_document_path && (
                  <DocumentCard
                    title="Secondary Document"
                    url={secondaryUrl}
                  />
                )}

              </div>

            </div>

            {/* REJECTION REASON */}

            {isRejected && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">

                <div className="flex items-start gap-3">

                  <XCircle
                    className="text-red-600 mt-0.5"
                    size={20}
                  />

                  <div>

                    <h3 className="font-semibold text-red-800">
                      Rejection Reason
                    </h3>

                    <p className="text-sm text-red-700 mt-2 leading-relaxed">
                      {verification.rejection_reason}
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* ACTION PANEL */}

          <div>

            <div className="bg-white border rounded-2xl p-6 sticky top-6">

              <h2 className="font-serif text-xl text-[#1F3D2A]">
                Verification Decision
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Decide whether this seller meets the verification requirements.
              </p>

              <div className="mt-6">

                <p className="text-xs text-gray-500">
                  Current Status
                </p>

                <div className="mt-2">

                  {isPending && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      Under Review
                    </span>
                  )}

                  {isApproved && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Approved
                    </span>
                  )}

                  {isRejected && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                      Rejected
                    </span>
                  )}

                </div>

              </div>

              {isPending && (
                <div className="mt-7 space-y-3">

                  <button
                    onClick={approveVerification}
                    disabled={processing}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      bg-[#1F3D2A]
                      text-white
                      px-5
                      py-3
                      rounded-lg
                      text-sm
                      font-medium
                      hover:bg-[#163020]
                      disabled:bg-gray-300
                      transition
                    "
                  >
                    <CheckCircle2 size={17} />

                    {processing
                      ? "Processing..."
                      : "Approve Verification"}
                  </button>

                  <button
                    onClick={() => {
                      setError("");
                      setRejecting(true);
                    }}
                    disabled={processing}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      border
                      border-red-200
                      text-red-700
                      px-5
                      py-3
                      rounded-lg
                      text-sm
                      font-medium
                      hover:bg-red-50
                      transition
                    "
                  >
                    <XCircle size={17} />
                    Reject Verification
                  </button>

                </div>
              )}

              {rejecting && isPending && (
                <div className="mt-6 pt-6 border-t">

                  <label className="text-sm font-medium text-gray-700">
                    Rejection Reason
                  </label>

                  <p className="text-xs text-gray-500 mt-1">
                    This message will be shown to the seller.
                  </p>

                  <textarea
                    value={rejectionReason}
                    onChange={(event) =>
                      setRejectionReason(
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Explain why the submitted documents could not be accepted..."
                    className="
                      mt-3
                      w-full
                      border
                      border-[#DED9D0]
                      rounded-lg
                      px-3
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#8B5E3C]
                      resize-none
                    "
                  />

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => {
                        setRejecting(false);
                        setRejectionReason("");
                      }}
                      disabled={processing}
                      className="
                        flex-1
                        border
                        px-4
                        py-2.5
                        rounded-lg
                        text-sm
                      "
                    >
                      Cancel
                    </button>

                    <button
                      onClick={rejectVerification}
                      disabled={
                        processing ||
                        !rejectionReason.trim()
                      }
                      className="
                        flex-1
                        bg-red-600
                        text-white
                        px-4
                        py-2.5
                        rounded-lg
                        text-sm
                        font-medium
                        hover:bg-red-700
                        disabled:bg-gray-300
                      "
                    >
                      {processing
                        ? "Rejecting..."
                        : "Confirm Rejection"}
                    </button>

                  </div>

                </div>
              )}

              {isApproved && (
                <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4">

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={18}
                      className="text-green-700"
                    />

                    <p className="text-sm text-green-800">
                      This seller has been approved and their verified
                      seller status is active.
                    </p>

                  </div>

                </div>
              )}

              {isRejected && (
                <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4">

                  <div className="flex items-start gap-3">

                    <XCircle
                      size={18}
                      className="text-red-700"
                    />

                    <p className="text-sm text-red-800">
                      This request was rejected. The seller can submit
                      another verification attempt if they have attempts
                      remaining.
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </main>
</div>
    </div>
  );
}


function DocumentCard({
  title,
  url,
  required = false,
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">

      <div className="p-4 bg-[#F8F6F2] border-b">

        <div className="flex items-center gap-2">

          <FileText
            size={18}
            className="text-[#8B5E3C]"
          />

          <span className="font-medium text-sm">
            {title}
          </span>

          {required && (
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Required
            </span>
          )}

        </div>

      </div>

      <div className="p-5">

        {url ? (
          <>
            <div className="bg-gray-100 rounded-lg h-52 flex items-center justify-center overflow-hidden">

              {url.match(
                /\.(jpg|jpeg|png|webp)/i
              ) ? (
                <img
                  src={url}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">

                  <FileText
                    size={40}
                    className="mx-auto text-[#8B5E3C]"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    PDF Document
                  </p>

                </div>
              )}

            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                border
                border-[#1F3D2A]
                text-[#1F3D2A]
                px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                hover:bg-[#F4F8F5]
              "
            >
              Open Full Document
            </a>
          </>
        ) : (
          <div className="h-52 flex items-center justify-center text-sm text-gray-400">
            Unable to load document.
          </div>
        )}

      </div>

    </div>
   

  );
}