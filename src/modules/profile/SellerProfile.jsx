import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  UserCheck,
  UserX,
} from "lucide-react";
import { supabase } from "../../config/supabaseClient";

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    location: "",
    phone: "",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    member_since: "",
    carbon_saved: 142,
    items_rescued: 12,
    role: "seller",
    is_verified_seller: false,
  });

  /*
   * -------------------------------------------------------
   * LOAD PROFILE
   * -------------------------------------------------------
   */
  const loadProfile = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile({
        id: data.id,
        full_name: data.full_name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        location: data.location || "",
        avatar:
          data.avatar ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
        member_since: data.created_at
          ? new Date(data.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "March 2022",
        carbon_saved: data.carbon_saved ?? 142,
        items_rescued: data.items_rescued ?? 12,
        role: data.role || "seller",

        // IMPORTANT:
        // This now comes from the database instead of being static.
        is_verified_seller: data.is_verified_seller === true,
      });
    } catch (error) {
      console.error("Failed to load seller profile:", error);
      alert(error.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /*
   * -------------------------------------------------------
   * PASSWORD CHANGE
   * -------------------------------------------------------
   */
  const handlePasswordChange = async () => {
    const { newPassword, confirmPassword } = passwordData;

    if (!newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      alert("Password updated successfully");

      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
    } catch (error) {
      console.error("Password update error:", error);
      alert(error.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  /*
   * -------------------------------------------------------
   * PROFILE INPUT CHANGE
   * -------------------------------------------------------
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * -------------------------------------------------------
   * SAVE PROFILE
   * -------------------------------------------------------
   */
  const saveProfile = async () => {
    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("You must be logged in.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          role: profile.role,
        })
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      /*
       * Keep the verification value returned
       * from the database.
       */
      setProfile((current) => ({
        ...current,
        full_name: data.full_name || "",
        phone: data.phone || "",
        location: data.location || "",
        role: data.role || "seller",
        is_verified_seller: data.is_verified_seller === true,
      }));

      setEditing(false);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * -------------------------------------------------------
   * DISCARD CHANGES
   * -------------------------------------------------------
   */
  const discardChanges = async () => {
    await loadProfile();
    setEditing(false);
  };

  /*
   * -------------------------------------------------------
   * VERIFICATION STATUS
   * -------------------------------------------------------
   *
   * The artisan badge should ONLY appear when:
   *
   * 1. Account role is seller
   * 2. is_verified_seller is true
   *
   * Otherwise show "Seller — Not Verified".
   */
  const isSeller = profile.role === "seller";
  const isVerifiedSeller =
    isSeller && profile.is_verified_seller === true;

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
        <p className="text-sm text-gray-500">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] p-5 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* =================================================
            LEFT CARD
        ================================================== */}

        <div className="bg-white border border-[#E8E3DA] rounded-2xl p-6 h-fit">
          <div className="text-center">
            <img
              src={profile.avatar}
              alt={profile.full_name || "Profile"}
              className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-[#EAF5EE]"
            />

            <h2 className="mt-4 text-2xl font-serif text-[#1F3D2A]">
              {profile.full_name || "Seller"}
            </h2>

            {/* =================================================
                DYNAMIC VERIFICATION BADGE
            ================================================== */}

            {isVerifiedSeller ? (
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAF5EE] text-[#1F3D2A] font-medium">
                <ShieldCheck size={14} />
                VERIFIED ARTISAN
              </span>
            ) : isSeller ? (
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 font-medium">
                <UserX size={14} />
                SELLER — NOT VERIFIED
              </span>
            ) : (
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium">
                {profile.role?.toUpperCase() || "USER"}
              </span>
            )}
          </div>

          {/* PROFILE DETAILS */}

          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{profile.location || "Location not provided"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Member since {profile.member_since || "Unknown"}
              </span>
            </div>
          </div>

          {/* VERIFICATION INFORMATION */}

          {isSeller && (
            <div className="mt-6 rounded-xl bg-[#FBF9F5] border border-[#E8E3DA] p-4">
              <div className="flex items-center gap-2">
                {isVerifiedSeller ? (
                  <ShieldCheck
                    size={18}
                    className="text-green-700"
                  />
                ) : (
                  <UserX
                    size={18}
                    className="text-amber-600"
                  />
                )}

                <p className="text-sm font-medium text-[#1F3D2A]">
                  Seller Verification
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {isVerifiedSeller
                  ? "Your seller account has been verified. Buyers can see your verified artisan status."
                  : "Your seller account has not been verified yet."}
              </p>
            </div>
          )}

          {/* IMPACT STATISTICS */}

          <div className="mt-8">
            <h3 className="text-xs tracking-wider text-gray-500 uppercase mb-3">
              Impact Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1F3D2A] text-white rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold">
                  {profile.carbon_saved}
                </p>

                <p className="text-xs opacity-80">
                  KG CO₂ Saved
                </p>
              </div>

              <div className="bg-[#FBE7DD] rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-[#8B5E3C]">
                  {profile.items_rescued}
                </p>

                <p className="text-xs text-gray-600">
                  Items Rescued
                </p>
              </div>
            </div>
          </div>

          {/* EDIT BUTTON */}

          <button
            onClick={() => setEditing(!editing)}
            className="mt-8 w-full bg-[#1F3D2A] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#163020] transition"
          >
            <Edit3 size={16} />

            {editing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================== */}

        <div className="space-y-6">
          {/* =================================================
              PERSONAL INFORMATION
          ================================================== */}

          <div className="bg-white border border-[#E8E3DA] rounded-2xl p-6">
            <h3 className="text-xl font-serif text-[#1F3D2A] mb-6">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-500">
                  Full Name
                </label>

                <input
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA] disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Email Address
                </label>

                <input
                  disabled
                  value={profile.email}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA] text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Location
                </label>

                <input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA] disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA] disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              ACCOUNT ROLE
          ================================================== */}

          <div className="bg-white border border-[#E8E3DA] rounded-2xl p-6">
            <h3 className="text-xl font-serif text-[#1F3D2A] mb-2">
              Account Role
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Define how you want to interact with the SustainSpace
              ecosystem.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {/* BUYER */}

              <button
                type="button"
                disabled={!editing}
                onClick={() =>
                  editing &&
                  setProfile((current) => ({
                    ...current,
                    role: "buyer",
                  }))
                }
                className={`border rounded-xl p-5 text-center transition ${
                  profile.role === "buyer"
                    ? "border-[#8B5E3C] bg-[#FFF9F5]"
                    : "border-gray-200"
                } ${
                  editing
                    ? "cursor-pointer hover:border-[#8B5E3C]"
                    : "cursor-default"
                }`}
              >
                <h4 className="font-medium">Buyer</h4>

                <p className="text-xs text-gray-500 mt-1">
                  Acquire curated eco pieces
                </p>
              </button>

              {/* SELLER */}

              <button
                type="button"
                disabled={!editing}
                onClick={() =>
                  editing &&
                  setProfile((current) => ({
                    ...current,
                    role: "seller",
                  }))
                }
                className={`border rounded-xl p-5 text-center transition ${
                  profile.role === "seller"
                    ? "border-[#8B5E3C] bg-[#FFF9F5]"
                    : "border-gray-200"
                } ${
                  editing
                    ? "cursor-pointer hover:border-[#8B5E3C]"
                    : "cursor-default"
                }`}
              >
                <h4 className="font-medium">Seller</h4>

                <p className="text-xs text-gray-500 mt-1">
                  List your sustainable goods
                </p>
              </button>

              {/* BOTH */}

              <button
                type="button"
                disabled={!editing}
                onClick={() =>
                  editing &&
                  setProfile((current) => ({
                    ...current,
                    role: "both",
                  }))
                }
                className={`border rounded-xl p-5 text-center transition ${
                  profile.role === "both"
                    ? "border-[#8B5E3C] bg-[#FFF9F5]"
                    : "border-gray-200"
                } ${
                  editing
                    ? "cursor-pointer hover:border-[#8B5E3C]"
                    : "cursor-default"
                }`}
              >
                <h4 className="font-medium">Both</h4>

                <p className="text-xs text-gray-500 mt-1">
                  Full artisan experience
                </p>
              </button>
            </div>

            {/* ROLE + VERIFICATION STATUS */}

            <div className="mt-5 p-4 rounded-xl bg-[#F8F6F1]">
              <div className="flex items-center gap-2">
                {isSeller && isVerifiedSeller ? (
                  <>
                    <ShieldCheck
                      size={18}
                      className="text-green-700"
                    />

                    <span className="text-sm font-medium text-green-700">
                      Verified Seller
                    </span>
                  </>
                ) : isSeller ? (
                  <>
                    <UserX
                      size={18}
                      className="text-amber-600"
                    />

                    <span className="text-sm font-medium text-amber-700">
                      Seller Not Verified
                    </span>
                  </>
                ) : (
                  <>
                    <UserCheck
                      size={18}
                      className="text-gray-500"
                    />

                    <span className="text-sm font-medium text-gray-600">
                      {profile.role === "both"
                        ? "Buyer & Seller Account"
                        : "Buyer Account"}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {isVerifiedSeller
                  ? "Your account is currently recognized as a verified seller."
                  : isSeller
                    ? "Complete seller verification to receive the Verified Artisan badge."
                    : "Seller verification is only applicable to seller accounts."}
              </p>
            </div>
          </div>

          {/* =================================================
              SECURITY
          ================================================== */}

          <div className="bg-white border border-[#E8E3DA] rounded-2xl p-6">
            <h3 className="text-xl font-serif text-[#1F3D2A] mb-6">
              Account Security
            </h3>

            <div className="py-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Password</h4>

                  <p className="text-sm text-gray-500">
                    Keep changing every 3 months
                  </p>
                </div>

                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-[#d8221f] hover:underline"
                  >
                    Update Password
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      New Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(event) =>
                        setPasswordData((current) => ({
                          ...current,
                          newPassword: event.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(event) =>
                        setPasswordData((current) => ({
                          ...current,
                          confirmPassword: event.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-3"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={updatingPassword}
                      className="bg-[#1F3D2A] text-white px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                      {updatingPassword
                        ? "Updating..."
                        : "Save New Password"}
                    </button>

                    <button
                      onClick={() => {
                        setShowPasswordForm(false);

                        setPasswordData({
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="border px-5 py-2.5 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center py-4">
              <div>
                <h4 className="font-medium">
                  Two-Factor Authentication
                </h4>

                <p className="text-sm text-gray-500">
                  Security via Authenticator App
                </p>
              </div>

              <span className="flex items-center gap-1 text-green-600 text-sm">
                <ShieldCheck size={16} />
                Enabled
              </span>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}

          {editing && (
            <div className="flex justify-end gap-4">
              <button
                onClick={discardChanges}
                disabled={saving}
                className="px-6 py-3 border rounded-full hover:bg-white transition disabled:opacity-50"
              >
                Discard Changes
              </button>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-3 rounded-full bg-[#1F3D2A] text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Profile Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
