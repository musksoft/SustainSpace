import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { loginAdmin, resetAdminPassword } from "../auth/adminAuth";
import { assets } from "../../assets/assets.js";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      await loginAdmin(email, password);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Enter your admin email first.");

      return;
    }

    try {
      await resetAdminPassword(email);

      setResetSent(true);

      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex
        bg-[#FAF7F2]
      "
    >
      {/* LEFT LOGIN */}

      <div
        className="
          w-full
          lg:w-1/2
          flex
          items-center
          justify-center
          px-6
          py-10
        "
      >
        <div
          className="
            w-full
            max-w-md
          "
        >
          {/* LOGO */}

          <div className="mb-10">
            <h1
              className="
                text-4xl
                font-serif
                font-semibold
                text-[#1F3D2A]
              "
            >
              Sustain
              <span className="text-[#C89A63]">Space</span>
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Administrator Portal
            </p>
          </div>

          <div
            className="
              bg-white
              rounded-3xl
              border
              border-[#E8E2D8]
              p-8
              shadow-sm
            "
          >
            <div className="mb-7">
              <h2
                className="
                  text-2xl
                  font-serif
                  text-[#1F3D2A]
                "
              >
                Welcome back
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Sign in to manage the marketplace.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}

              <div>
                <label
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  Admin Email
                </label>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-3
                    border
                    border-[#E8E2D8]
                    rounded-xl
                    px-4
                    py-3
                  "
                >
                  <Mail size={18} className="text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sustainspace.com"
                    className="
                      flex-1
                      outline-none
                      text-sm
                    "
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  Password
                </label>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-3
                    border
                    border-[#E8E2D8]
                    rounded-xl
                    px-4
                    py-3
                  "
                >
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="
                      flex-1
                      outline-none
                      text-sm
                    "
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div
                  className="
                    bg-red-50
                    text-red-600
                    text-sm
                    rounded-xl
                    px-4
                    py-3
                  "
                >
                  {error}
                </div>
              )}

              {resetSent && (
                <div
                  className="
                    bg-green-50
                    text-green-700
                    text-sm
                    rounded-xl
                    px-4
                    py-3
                  "
                >
                  Password reset email sent.
                </div>
              )}

              {/* LOGIN BUTTON */}

              <button
                disabled={loading}
                className="
                  w-full
                  bg-[#1F3D2A]
                  text-white
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  hover:bg-[#294C37]
                  transition
                  disabled:opacity-60
                "
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="
                  w-full
                  text-sm
                  text-[#1F3D2A]
                  underline
                  underline-offset-4
                "
              >
                Forgot password?
              </button>
            </form>

            <div
              className="
                mt-8
                flex
                items-center
                gap-3
                text-xs
                text-gray-500
              "
            >
              <ShieldCheck size={18} className="text-[#1F3D2A]" />
              Secure administrator access only.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}

      <div
        className="
          hidden
          lg:flex
          w-1/2
          relative
        "
      >
        <img
          src={assets.hero}
          alt="Sustainable furniture"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[#1F3D2A]/80
          "
        />

        <div
          className="
            relative
            z-10
            text-white
            p-16
            flex
            flex-col
            justify-center
            max-w-xl
          "
        >
          <h2
            className="
              text-5xl
              font-serif
              leading-tight
            "
          >
            Preserving integrity through conscious curation.
          </h2>

          <p
            className="
              mt-6
              text-green-100
              leading-7
            "
          >
            Manage sellers, verify listings, and maintain a trusted circular
            furniture marketplace.
          </p>

          <div
            className="
              grid
              grid-cols-2
              gap-5
              mt-10
            "
          >
           
          </div>
        </div>
      </div>
    </div>
  );
}
