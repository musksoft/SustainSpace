import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  CloudUpload,
  FileText,
  Lock,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_BUCKET = "seller-verification-documents";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_ATTEMPTS = 2;
const REQUIRED_SALES = 5;

export default function SellerVerification() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState(null);

  const [soldCount, setSoldCount] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [latestVerification, setLatestVerification] = useState(null);

  const [step, setStep] = useState(1);

  const [supplierName, setSupplierName] = useState("");
  const [materialType, setMaterialType] = useState("");

  const [documents, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * -------------------------------------------------------
   * IMPORTANT:
   * When the latest request is rejected, this allows the
   * seller to leave the rejected screen and create attempt #2.
   * -------------------------------------------------------
   */
  const [showResubmissionForm, setShowResubmissionForm] =
    useState(false);

  /*
   * -------------------------------------------------------
   * LOAD SELLER + VERIFICATION INFORMATION
   * -------------------------------------------------------
   *
   * Eligibility:
   * seller must have 5+ listings with status = "sold"
   *
   * Attempts:
   * count rows in seller_verifications
   */
  useEffect(() => {
    loadVerificationInfo();
  }, []);

  const loadVerificationInfo = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/");
        return;
      }

      /*
       * -------------------------------------------------------
       * LOAD PROFILE
       * -------------------------------------------------------
       */
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      if (profileError) {
        throw profileError;
      }

      if (profileData.role !== "seller") {
        setError(
          "Only seller accounts can access seller verification.",
        );
        return;
      }

      setProfile(profileData);

      /*
       * -------------------------------------------------------
       * COUNT SOLD ITEMS
       * -------------------------------------------------------
       */
      const {
        count: soldItemsCount,
        error: soldError,
      } = await supabase
        .from("listings")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("seller_id", user.id)
        .eq("status", "sold");

      if (soldError) {
        throw soldError;
      }

      setSoldCount(soldItemsCount || 0);

      /*
       * -------------------------------------------------------
       * LOAD VERIFICATION ATTEMPTS
       * -------------------------------------------------------
       */
      const {
        data: verificationData,
        error: verificationError,
      } = await supabase
        .from("seller_verifications")
        .select(`
          id,
          attempt_number,
          status,
          rejection_reason,
          primary_document_path,
          secondary_document_path
        `)
        .eq("seller_id", user.id)
        .order("attempt_number", {
          ascending: false,
        });

      if (verificationError) {
        throw verificationError;
      }

      const verificationRows = verificationData || [];

      setAttempts(verificationRows);

      if (verificationRows.length > 0) {
        setLatestVerification(verificationRows[0]);
      } else {
        setLatestVerification(null);
      }

      /*
       * Always start on the normal state when the page loads.
       * If the latest request is rejected, the rejected screen
       * will be shown until "Submit Another Request" is clicked.
       */
      setShowResubmissionForm(false);
    } catch (err) {
      console.error("Seller verification load error:", err);

      setError(
        err?.message ||
          "Unable to load seller verification information.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * DERIVED STATE
   * -------------------------------------------------------
   */

  const attemptsUsed = attempts.length;

  const attemptsRemaining = Math.max(
    MAX_ATTEMPTS - attemptsUsed,
    0,
  );

  const eligible = soldCount >= REQUIRED_SALES;

  const isVerified =
    profile?.is_verified_seller === true ||
    latestVerification?.status === "approved";

  const isPending =
    latestVerification?.status === "submitted";

  const isRejected =
    latestVerification?.status === "rejected";

  /*
   * The important change:
   *
   * If the request is rejected AND the seller clicked
   * "Submit Another Request", the form is allowed to show.
   */
  const canApply =
    eligible &&
    !isVerified &&
    !isPending &&
    attemptsRemaining > 0;

  const currentAttemptNumber = attemptsUsed + 1;

  /*
   * -------------------------------------------------------
   * STEP PROGRESS
   * -------------------------------------------------------
   */

  const stepStatus = useMemo(() => {
    return {
      eligibility: eligible,
      documents: documents.length >= 1,
      submitted:
        latestVerification?.status === "submitted" ||
        latestVerification?.status === "approved",
    };
  }, [eligible, documents, latestVerification]);

  /*
   * -------------------------------------------------------
   * FILE VALIDATION
   * -------------------------------------------------------
   */

  const validateFile = (file) => {
    if (!file) {
      return "Invalid file.";
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please upload a PDF, JPG, PNG, or WEBP file.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Each document must be smaller than 10MB.";
    }

    return null;
  };

  /*
   * -------------------------------------------------------
   * ADD DOCUMENT
   * -------------------------------------------------------
   */

  const addDocument = (file) => {
    setError("");

    if (!file) return;

    if (documents.length >= 2) {
      setError(
        "You can upload a maximum of 2 documents.",
      );
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setDocuments((current) => [
      ...current,
      {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
      },
    ]);
  };

  /*
   * -------------------------------------------------------
   * FILE INPUT
   * -------------------------------------------------------
   */

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    files
      .slice(0, Math.max(0, 2 - documents.length))
      .forEach((file) => {
        addDocument(file);
      });

    event.target.value = "";
  };

  /*
   * -------------------------------------------------------
   * DRAG & DROP
   * -------------------------------------------------------
   */

  const handleDragOver = (event) => {
    event.preventDefault();

    if (documents.length < 2) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    if (documents.length >= 2) {
      setError(
        "You can upload a maximum of 2 documents.",
      );
      return;
    }

    const files = Array.from(
      event.dataTransfer.files || [],
    );

    files
      .slice(0, 2 - documents.length)
      .forEach((file) => {
        addDocument(file);
      });
  };

  /*
   * -------------------------------------------------------
   * REMOVE DOCUMENT
   * -------------------------------------------------------
   */

  const removeDocument = (documentId) => {
    setDocuments((current) =>
      current.filter(
        (document) => document.id !== documentId,
      ),
    );
  };

  /*
   * -------------------------------------------------------
   * UPLOAD DOCUMENTS
   * -------------------------------------------------------
   */

  const uploadDocuments = async (
    userId,
    attemptNumber,
  ) => {
    const uploadedPaths = [];

    try {
      for (
        let index = 0;
        index < documents.length;
        index++
      ) {
        const document = documents[index];

        const extension =
          document.file.name
            .split(".")
            .pop()
            ?.toLowerCase() || "file";

        const filePath = `${userId}/attempt-${attemptNumber}/document-${
          index + 1
        }-${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, document.file, {
              cacheControl: "3600",
              upsert: false,
              contentType: document.file.type,
            });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPaths.push(filePath);
      }

      return uploadedPaths;
    } catch (uploadError) {
      /*
       * Clean up files if one of the uploads fails.
       */
      if (uploadedPaths.length > 0) {
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(uploadedPaths);
      }

      throw uploadError;
    }
  };

  /*
   * -------------------------------------------------------
   * SUBMIT VERIFICATION
   * -------------------------------------------------------
   */

  const submitVerification = async () => {
    setError("");
    setSuccess("");

    /*
     * Final client-side eligibility check.
     */
    if (!eligible) {
      setError(
        `You need at least ${REQUIRED_SALES} completed sales before requesting seller verification.`,
      );
      return;
    }

    /*
     * A seller can only make 2 attempts.
     */
    if (attemptsUsed >= MAX_ATTEMPTS) {
      setError(
        "You have used all available seller verification attempts.",
      );
      return;
    }

    /*
     * Do not allow another request while one is pending.
     */
    if (isPending) {
      setError(
        "Your current verification request is already waiting for admin approval.",
      );
      return;
    }

    /*
     * Do not allow another request after approval.
     */
    if (isVerified) {
      setError(
        "Your seller account is already verified.",
      );
      return;
    }

    /*
     * First document is required.
     */
    if (documents.length === 0) {
      setError(
        "Please upload at least one verification document.",
      );
      return;
    }

    if (documents.length > 2) {
      setError(
        "You can upload a maximum of 2 documents.",
      );
      return;
    }

    setSubmitting(true);

    let uploadedPaths = [];

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      /*
       * -------------------------------------------------------
       * FRESHLY LOAD ATTEMPTS
       * -------------------------------------------------------
       */
      const {
        data: latestAttempts,
        error: attemptsError,
      } = await supabase
        .from("seller_verifications")
        .select(
          "id, attempt_number, status, rejection_reason, primary_document_path, secondary_document_path",
        )
        .eq("seller_id", user.id)
        .order("attempt_number", {
          ascending: false,
        });

      if (attemptsError) {
        throw attemptsError;
      }

      const freshAttempts = latestAttempts || [];

      /*
       * Maximum attempts check.
       */
      if (freshAttempts.length >= MAX_ATTEMPTS) {
        setAttempts(freshAttempts);

        throw new Error(
          "You have used all available seller verification attempts.",
        );
      }

      /*
       * The next attempt is based on the number of existing
       * verification records.
       */
      const actualAttemptNumber =
        freshAttempts.length + 1;

      /*
       * -------------------------------------------------------
       * PENDING REQUEST CHECK
       * -------------------------------------------------------
       */
      const pendingRequest = freshAttempts.find(
        (item) => item.status === "submitted",
      );

      if (pendingRequest) {
        setAttempts(freshAttempts);
        setLatestVerification(pendingRequest);
        setShowResubmissionForm(false);

        throw new Error(
          "You already have a verification request waiting for admin approval.",
        );
      }

      /*
       * -------------------------------------------------------
       * RE-CHECK SOLD LISTINGS
       * -------------------------------------------------------
       */
      const {
        count: freshSoldCount,
        error: freshSoldError,
      } = await supabase
        .from("listings")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("seller_id", user.id)
        .eq("status", "sold");

      if (freshSoldError) {
        throw freshSoldError;
      }

      if ((freshSoldCount || 0) < REQUIRED_SALES) {
        setSoldCount(freshSoldCount || 0);

        throw new Error(
          `You need at least ${REQUIRED_SALES} sold items to submit verification.`,
        );
      }

      /*
       * -------------------------------------------------------
       * UPLOAD DOCUMENTS
       * -------------------------------------------------------
       */
      uploadedPaths = await uploadDocuments(
        user.id,
        actualAttemptNumber,
      );

      /*
       * -------------------------------------------------------
       * SAVE VERIFICATION REQUEST
       * -------------------------------------------------------
       */
      const {
        data: verification,
        error: insertError,
      } = await supabase
        .from("seller_verifications")
        .insert({
          seller_id: user.id,
          attempt_number: actualAttemptNumber,
          status: "submitted",
          primary_document_path:
            uploadedPaths[0],
          secondary_document_path:
            uploadedPaths[1] || null,
        })
        .select()
        .single();

      if (insertError) {
        /*
         * Remove uploaded files if database insert fails.
         */
        if (uploadedPaths.length > 0) {
          await supabase.storage
            .from(STORAGE_BUCKET)
            .remove(uploadedPaths);
        }

        throw insertError;
      }

      /*
       * -------------------------------------------------------
       * UPDATE UI
       * -------------------------------------------------------
       */
      const updatedAttempts = [
        verification,
        ...freshAttempts,
      ];

      setAttempts(updatedAttempts);
      setLatestVerification(verification);

      setDocuments([]);
      setSupplierName("");
      setMaterialType("");

      /*
       * IMPORTANT:
       * After successfully submitting a new attempt,
       * return to normal state so the pending screen shows.
       */
      setShowResubmissionForm(false);

      setSuccess(
        "Your verification request has been submitted to the administrator.",
      );

      setStep(1);
    } catch (submitError) {
      console.error(
        "Seller verification submission error:",
        submitError,
      );

      setError(
        submitError?.message ||
          "Unable to submit seller verification.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * -------------------------------------------------------
   * FORMAT FILE SIZE
   * -------------------------------------------------------
   */

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(bytes / 1024),
    )} KB`;
  };

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#1F3D2A] animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-4">
            Loading verification information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="bg-white border-b border-[#E8E3DA]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
          <h1 className="font-serif text-2xl md:text-3xl text-[#1F3D2A]">
            Artisan Verification
          </h1>

          <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
            Complete your verification to unlock premium
            seller features and build trust with conscious
            consumers. Our process ensures authenticity and
            commitment to sustainable practices.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-5 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* =================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-5">
            {/* VERIFICATION ELIGIBILITY */}

            <div className="bg-white border border-[#E8E3DA] rounded-xl p-5">
              <h2 className="font-serif text-lg text-[#1F3D2A] mb-4">
                Verification Eligibility
              </h2>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  Items Sold
                </span>

                <span className="text-sm font-semibold text-[#1F3D2A]">
                  {Math.min(
                    soldCount,
                    REQUIRED_SALES,
                  )}{" "}
                  / {REQUIRED_SALES}
                </span>
              </div>

              <div className="w-full h-2 bg-[#E7E4DE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1F3D2A] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (soldCount / REQUIRED_SALES) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              {eligible ? (
                <div className="flex items-center gap-2 mt-4 text-sm text-green-700">
                  <CheckCircle2 size={16} />
                  <span>
                    You meet the sales requirement.
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Complete{" "}
                  <span className="font-semibold text-[#1F3D2A]">
                    {Math.max(
                      REQUIRED_SALES - soldCount,
                      0,
                    )}
                  </span>{" "}
                  more sale
                  {Math.max(
                    REQUIRED_SALES - soldCount,
                    0,
                  ) === 1
                    ? ""
                    : "s"}{" "}
                  to unlock verification.
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">
                    Verification attempts
                  </span>

                  <span className="font-medium text-gray-700">
                    {attemptsUsed} / {MAX_ATTEMPTS}
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-2">
                  <span className="text-gray-500">
                    Attempts remaining
                  </span>

                  <span
                    className={`font-semibold ${
                      attemptsRemaining > 0
                        ? "text-[#1F3D2A]"
                        : "text-red-600"
                    }`}
                  >
                    {attemptsRemaining}
                  </span>
                </div>
              </div>
            </div>

            {/* VERIFICATION STEPS */}

            <div className="bg-white border border-[#E8E3DA] rounded-xl p-5">
              <h2 className="font-serif text-lg text-[#1F3D2A] mb-5">
                Verification Steps
              </h2>

              <div className="space-y-5">
                {/* STEP 1 */}

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {stepStatus.eligibility ? (
                      <div className="w-5 h-5 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    ) : (
                      <Circle
                        size={20}
                        className="text-gray-300"
                      />
                    )}

                    <div className="w-px h-8 bg-gray-200 mt-1" />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        stepStatus.eligibility
                          ? "text-[#1F3D2A]"
                          : "text-gray-500"
                      }`}
                    >
                      Eligibility
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Sell 5 or more items to qualify.
                    </p>
                  </div>
                </div>

                {/* STEP 2 */}

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {stepStatus.documents ? (
                      <div className="w-5 h-5 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          step === 2
                            ? "border-[#8B5E3C] bg-[#FFF5EC]"
                            : "border-gray-300"
                        }`}
                      >
                        {step === 2 && (
                          <div className="w-2 h-2 rounded-full bg-[#8B5E3C]" />
                        )}
                      </div>
                    )}

                    <div className="w-px h-8 bg-gray-200 mt-1" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#8B5E3C]">
                      Documentation
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Upload 1 required document and
                      an optional second document.
                    </p>
                  </div>
                </div>

                {/* STEP 3 */}

                <div className="flex gap-3">
                  <div>
                    {stepStatus.submitted ? (
                      <div className="w-5 h-5 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    ) : (
                      <Circle
                        size={20}
                        className="text-gray-300"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Admin Review
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Your documents will be reviewed by
                      an admin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPERT TIPS */}

            <div className="bg-[#D9F0E0] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck
                  size={20}
                  className="text-[#1F3D2A]"
                />

                <h3 className="font-serif text-lg text-[#1F3D2A]">
                  Expert Tips
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#456052] leading-relaxed">
                <p>
                  <strong>Clarity is key:</strong> Ensure
                  all uploaded documents are well-lit and
                  legible.
                </p>

                <p>
                  <strong>Use your process:</strong> Buyers
                  love to see the artisan behind the work.
                </p>

                <p>
                  Your documents are only used for
                  verification and are not displayed
                  publicly.
                </p>
              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN FORM
          ================================================== */}

          <main className="bg-white border border-[#E8E3DA] rounded-xl min-h-[650px]">
            {/* MAIN HEADER */}

            <div className="p-5 md:p-7 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-[#1F3D2A]">
                  Sourcing Documentation
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Submit documents to verify your seller
                  identity.
                </p>
              </div>

              <span className="hidden sm:block text-xs bg-[#EFEDE8] text-gray-600 px-3 py-1 rounded-full">
                Step {step === 1 ? "1" : "2"} of 2
              </span>
            </div>

            {/* ALERTS */}

            <div className="px-5 md:px-7 pt-5">
              {error && (
                <div className="flex gap-3 items-start bg-red-50 border border-red-100 text-red-700 rounded-lg p-4 text-sm">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                  />

                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="ml-auto"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {success && (
                <div className="flex gap-3 items-start bg-green-50 border border-green-100 text-green-700 rounded-lg p-4 text-sm">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                  />

                  <p>{success}</p>
                </div>
              )}
            </div>

            {/* =================================================
                VERIFIED STATE
            ================================================== */}

            {isVerified ? (
              <div className="p-5 md:p-10">
                <div className="max-w-xl mx-auto text-center py-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck
                      size={40}
                      className="text-green-700"
                    />
                  </div>

                  <h3 className="font-serif text-2xl text-[#1F3D2A] mt-6">
                    You are a Verified Seller
                  </h3>

                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    Your seller verification has been
                    approved. Buyers can now see your
                    verified seller status.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/seller")
                    }
                    className="mt-7 bg-[#1F3D2A] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#163020] transition"
                  >
                    Back to Seller Dashboard
                  </button>
                </div>
              </div>
            ) : isPending ? (
              /* =================================================
                  PENDING STATE
              ================================================== */

              <div className="p-5 md:p-10">
                <div className="max-w-xl mx-auto text-center py-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock
                      size={38}
                      className="text-amber-700"
                    />
                  </div>

                  <h3 className="font-serif text-2xl text-[#1F3D2A] mt-6">
                    Verification Under Review
                  </h3>

                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    Your documents have been sent to the
                    administrator. Please wait while your
                    request is reviewed.
                  </p>

                  <div className="bg-[#FBF9F5] rounded-xl p-5 mt-7 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Attempt
                      </span>

                      <span className="font-semibold">
                        #
                        {
                          latestVerification?.attempt_number
                        }
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-500">
                        Documents
                      </span>

                      <span className="font-semibold">
                        {latestVerification?.secondary_document_path
                          ? "2 documents"
                          : "1 document"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-500">
                        Status
                      </span>

                      <span className="text-amber-700 font-medium">
                        Waiting for admin
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/seller")
                    }
                    className="mt-7 border border-[#1F3D2A] text-[#1F3D2A] px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#F4F8F5] transition"
                  >
                    Back to Seller Dashboard
                  </button>
                </div>
              </div>
            ) : isRejected &&
              !showResubmissionForm ? (
              /* =================================================
                  REJECTED STATE
              ================================================== */

              <div className="p-5 md:p-10">
                <div className="max-w-xl mx-auto text-center py-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                    <X
                      size={38}
                      className="text-red-700"
                    />
                  </div>

                  <h3 className="font-serif text-2xl text-[#1F3D2A] mt-6">
                    Verification Request Rejected
                  </h3>

                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    Your seller verification request was
                    not approved. You may submit another
                    request using your remaining
                    verification attempt.
                  </p>

                  {latestVerification?.rejection_reason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 mt-7 text-left">
                      <p className="text-xs font-semibold text-red-800 uppercase tracking-wide">
                        Admin Feedback
                      </p>

                      <p className="text-sm text-red-700 mt-2 leading-relaxed">
                        {
                          latestVerification.rejection_reason
                        }
                      </p>
                    </div>
                  )}

                  <div className="bg-[#FBF9F5] rounded-xl p-5 mt-5 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Attempt
                      </span>

                      <span className="font-semibold">
                        #
                        {
                          latestVerification?.attempt_number
                        }
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-500">
                        Attempts remaining
                      </span>

                      <span
                        className={`font-semibold ${
                          attemptsRemaining > 0
                            ? "text-[#1F3D2A]"
                            : "text-red-600"
                        }`}
                      >
                        {attemptsRemaining}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-500">
                        Status
                      </span>

                      <span className="text-red-700 font-medium">
                        Rejected
                      </span>
                    </div>
                  </div>

                  {attemptsRemaining > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        /*
                         * THIS IS THE IMPORTANT FIX.
                         *
                         * We do NOT delete or modify the
                         * rejected database record.
                         *
                         * We simply tell the UI to display
                         * the application form again.
                         */
                        setError("");
                        setSuccess("");
                        setDocuments([]);
                        setSupplierName("");
                        setMaterialType("");
                        setStep(1);
                        setShowResubmissionForm(true);
                      }}
                      className="mt-7 bg-[#1F3D2A] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#163020] transition"
                    >
                      Submit Another Request
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/seller")
                      }
                      className="mt-7 border border-[#1F3D2A] text-[#1F3D2A] px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#F4F8F5] transition"
                    >
                      Back to Seller Dashboard
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* =================================================
                  APPLICATION FORM
              ================================================== */

              <div className="p-5 md:p-7">
                {/* =================================================
                    STEP 1
                ================================================== */}

                {step === 1 && (
                  <div className="max-w-3xl">
                    {/* ELIGIBILITY BLOCK */}

                    <div
                      className={`rounded-xl p-5 border ${
                        eligible
                          ? "bg-green-50 border-green-100"
                          : "bg-amber-50 border-amber-100"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            eligible
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {eligible ? (
                            <CheckCircle2 size={22} />
                          ) : (
                            <AlertCircle size={22} />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {eligible
                              ? "You are eligible for verification"
                              : "Verification is not unlocked yet"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            You have sold{" "}
                            <span className="font-semibold text-[#1F3D2A]">
                              {soldCount}
                            </span>{" "}
                            item
                            {soldCount === 1
                              ? ""
                              : "s"}
                            . Verification requires at
                            least{" "}
                            <span className="font-semibold">
                              {REQUIRED_SALES}
                            </span>{" "}
                            sold items.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* OPTIONAL SOURCING INFORMATION */}

                    <div className="mt-6">
                      <h3 className="font-serif text-lg text-[#1F3D2A]">
                        Primary Material Source
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Tell us where you source the
                        majority of your materials.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="text-xs font-medium text-gray-600">
                            Supplier Name
                          </label>

                          <input
                            type="text"
                            value={supplierName}
                            onChange={(event) =>
                              setSupplierName(
                                event.target.value,
                              )
                            }
                            placeholder="e.g. Local Timber Mill"
                            disabled={!eligible}
                            className="mt-2 w-full border border-[#DED9D0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8B5E3C] disabled:bg-gray-100 disabled:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-600">
                            Material Type
                          </label>

                          <select
                            value={materialType}
                            onChange={(event) =>
                              setMaterialType(
                                event.target.value,
                              )
                            }
                            disabled={!eligible}
                            className="mt-2 w-full border border-[#DED9D0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8B5E3C] disabled:bg-gray-100"
                          >
                            <option value="">
                              Select material
                            </option>

                            <option value="Reclaimed Wood">
                              Reclaimed Wood
                            </option>

                            <option value="Recycled Metal">
                              Recycled Metal
                            </option>

                            <option value="Recycled Plastic">
                              Recycled Plastic
                            </option>

                            <option value="Organic Textile">
                              Organic Textile
                            </option>

                            <option value="Natural Fiber">
                              Natural Fiber
                            </option>

                            <option value="Other">
                              Other
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* CONTINUE */}

                    <div className="flex justify-end mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          setError("");

                          if (!eligible) {
                            setError(
                              `You need at least ${REQUIRED_SALES} sold items before continuing.`,
                            );
                            return;
                          }

                          if (attemptsRemaining <= 0) {
                            setError(
                              "You have used all available verification attempts.",
                            );
                            return;
                          }

                          setStep(2);
                        }}
                        disabled={!canApply}
                        className="flex items-center gap-2 bg-[#1F3D2A] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#163020] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                      >
                        Continue
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* =================================================
                    STEP 2 - DOCUMENTS
                ================================================== */}

                {step === 2 && (
                  <div className="max-w-3xl">
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide">
                        Identity Documentation
                      </p>

                      <h3 className="font-serif text-xl text-[#1F3D2A] mt-2">
                        Upload your verification documents
                      </h3>

                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Upload one required identity
                        document. You may optionally
                        provide a second document to
                        support your application.
                      </p>
                    </div>

                    {/* DOCUMENT REQUIREMENT */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                      <div className="border border-green-100 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            size={17}
                            className="text-green-700"
                          />

                          <span className="font-medium text-sm text-green-800">
                            Document 1 — Required
                          </span>
                        </div>

                        <p className="text-xs text-green-700/80 mt-2">
                          Any valid document that can
                          verify your identity.
                        </p>
                      </div>

                      <div className="border border-gray-100 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <FileText
                            size={17}
                            className="text-gray-500"
                          />

                          <span className="font-medium text-sm text-gray-700">
                            Document 2 — Optional
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          Add another supporting
                          document if desired.
                        </p>
                      </div>
                    </div>

                    {/* UPLOAD AREA */}

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition ${
                        dragActive
                          ? "border-[#1F3D2A] bg-[#F1F7F3]"
                          : "border-[#D8D2C8] bg-[#FCFBF8]"
                      } ${
                        documents.length >= 2
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      <div className="w-14 h-14 mx-auto rounded-full bg-[#D7EFE0] flex items-center justify-center">
                        <CloudUpload
                          size={26}
                          className="text-[#1F3D2A]"
                        />
                      </div>

                      <h4 className="font-medium text-gray-800 mt-4">
                        Click to upload or drag and drop
                      </h4>

                      <p className="text-xs text-gray-400 mt-2">
                        PDF, JPG, PNG, or WEBP (max. 10MB
                        each)
                      </p>

                      <label
                        className={`inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg text-sm font-medium ${
                          documents.length >= 2
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#1F3D2A] text-white cursor-pointer hover:bg-[#163020]"
                        }`}
                      >
                        <Upload size={16} />

                        Choose file

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          multiple
                          disabled={
                            documents.length >= 2
                          }
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* DOCUMENT LIST */}

                    {documents.length > 0 && (
                      <div className="mt-5 space-y-3">
                        {documents.map(
                          (document, index) => (
                            <div
                              key={document.id}
                              className="flex items-center gap-3 border border-gray-100 bg-[#F8F6F2] rounded-lg p-3"
                            >
                              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                                <FileText
                                  size={18}
                                  className="text-[#8B5E3C]"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-700 truncate">
                                    {document.file.name}
                                  </p>

                                  <span className="text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 flex-shrink-0">
                                    {index === 0
                                      ? "Required"
                                      : "Optional"}
                                  </span>
                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                  {formatFileSize(
                                    document.file
                                      .size,
                                  )}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeDocument(
                                    document.id,
                                  )
                                }
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Remove document"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {/* PRIVACY NOTICE */}

                    <div className="flex gap-3 mt-5 bg-[#F6F5F1] border border-gray-100 rounded-lg p-4">
                      <Lock
                        size={17}
                        className="text-[#1F3D2A] flex-shrink-0 mt-0.5"
                      />

                      <p className="text-xs text-gray-500 leading-relaxed">
                        Your documents are securely stored
                        and used only for seller verification.
                        They will not be displayed publicly
                        on your seller profile.
                      </p>
                    </div>

                    {/* FOOTER BUTTONS */}

                    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setStep(1);
                        }}
                        disabled={submitting}
                        className="flex items-center gap-2 text-sm text-[#1F3D2A] hover:text-[#8B5E3C]"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={submitVerification}
                        disabled={
                          submitting ||
                          documents.length === 0 ||
                          !eligible ||
                          attemptsRemaining <= 0
                        }
                        className="flex items-center gap-2 bg-[#1F3D2A] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#163020] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Send for Review
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-red-500 text-right mt-2">
                      {attemptsRemaining} verification
                      attempt
                      {attemptsRemaining === 1
                        ? ""
                        : "s"}{" "}
                      remaining
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}