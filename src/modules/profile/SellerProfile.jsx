import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
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

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully");

      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
    }

    setUpdatingPassword(false);
  };

  const loadProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        location: data.location || "",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
        role: data.role || "seller",
      });
    }
    setLoading(false);
  };

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    location: "",
    phone: "",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    member_since: "March 2022",
    carbon_saved: 142,
    items_rescued: 12,
    role: "seller",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        location: profile.location,
        role: profile.role,
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("failed to update profile");
    } else {
      alert("Profile updated succesfully");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[300px_1fr] gap-6">
        {/* LEFT CARD */}
        <div className="bg-white rounded-2xl border p-6 h-fit">
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar}
              alt=""
              className="w-28 h-28 rounded-full object-cover"
            />

            <h2 className="mt-4 text-2xl font-serif text-[#1F3D2A]">
              {profile.full_name}
            </h2>

            <span className="mt-1 px-3 py-1 rounded-full text-xs bg-[#EAF5EE] text-[#1F3D2A] font-medium">
              VERIFIED ARTISAN
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {profile.location}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Member since {profile.member_since}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xs tracking-wider text-gray-500 uppercase mb-3">
              Impact Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1F3D2A] text-white rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold">{profile.carbon_saved}</p>
                <p className="text-xs opacity-80">KG CO₂ Saved</p>
              </div>

              <div className="bg-[#FBE7DD] rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-[#8B5E3C]">
                  {profile.items_rescued}
                </p>
                <p className="text-xs text-gray-600">Items Rescued</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="
  mt-8
  w-full
  bg-[#1F3D2A]
  text-white
  py-3
  rounded-xl
  flex
  items-center
  justify-center
  gap-2
  "
          >
            <Edit3 size={18} />

            {editing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-6">
          {/* PERSONAL INFORMATION */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-serif text-[#1F3D2A] mb-6">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>

                <input
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email Address</label>

                <input
                  disabled
                  value={profile.email}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Location</label>

                <input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone Number</label>

                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full mt-1 border rounded-lg px-3 py-3 bg-[#FAFAFA]"
                />
              </div>
            </div>
          </div>

          {/* ACCOUNT ROLE */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-serif text-[#1F3D2A] mb-2">
              Account Role
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Define how you want to interact with the SustainSpace ecosystem.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div
                className={`border rounded-xl p-5 text-center ${
                  profile.role === "buyer" ? "border-[#8B5E3C]" : ""
                }`}
              >
                <h4 className="font-medium">Buyer</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Acquire curated eco pieces
                </p>
              </div>

              <div
                className={`border rounded-xl p-5 text-center ${
                  profile.role === "seller" ? "border-[#8B5E3C]" : ""
                }`}
              >
                <h4 className="font-medium">Seller</h4>
                <p className="text-xs text-gray-500 mt-1">
                  List your sustainable goods
                </p>
              </div>

              <div
                className={`border rounded-xl p-5 text-center ${
                  profile.role === "both" ? "border-[#8B5E3C]" : ""
                }`}
              >
                <h4 className="font-medium">Both</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Full artisan experience
                </p>
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-serif text-[#1F3D2A] mb-6">
              Account Security
            </h3>

            <div className="py-4 border-b">
              {/* Header */}
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

              {/* Password Form */}
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
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
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
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-4 py-3"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={updatingPassword}
                      className="
          bg-[#1F3D2A]
          text-white
          px-5
          py-2.5
          rounded-lg
          disabled:opacity-50
          "
                    >
                      {updatingPassword ? "Updating..." : "Save New Password"}
                    </button>

                    <button
                      onClick={() => {
                        setShowPasswordForm(false);

                        setPasswordData({
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="
          border
          px-5
          py-2.5
          rounded-lg
          hover:bg-gray-50
          "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center py-4">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
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

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            <button className="px-6 py-3 border rounded-full">
              Discard Changes
            </button>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-3 rounded-full bg-[#1F3D2A] text-white"
            >
              {saving ? "Saving..." : "Save Profile Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
