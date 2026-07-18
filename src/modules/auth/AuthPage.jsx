import { useState } from "react";
import { assets } from "../../assets/assets";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  Users,
  Info,
  Apple,
  MapPin,
  Phone,
  Mail,
  Lock,
  User,
} from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.full_name,
            phone: signupData.phone,
            location: signupData.location,
            role: role,
          },
        },
      });

      if (error) throw error;

      alert("Account created successfully. Check your email for verification.");

      setSignupData({
        full_name: "",
        email: "",
        phone: "",
        location: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      const user = data.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const slug = profile.full_name.toLowerCase().replace(/\s+/g, "-");

      if (profile.role === "seller") {
        navigate(`/seller/${user.id}/${slug}`);
      } else {
        navigate(`/buyer/${user.id}`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-stone-50 overflow-y-auto">
      <div className="hidden lg:block w-[24px] bg-[#0D3B2A]" />

      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-5/12 relative bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: `url(${assets.login})`,
        }}
      >
        {/* <div className="absolute inset-0 bg-[#234236]/20" /> */}

      <div className="relative z-10 flex flex-col justify-end h-full pb-12">
  <div className="bg-[#0b3b28]/60 px-8 py-6 rounded-r-lg backdrop-blur-sm max-w-xl">
    <h1 className="font-serif text-4xl lg:text-4xl font-thin tracking-wide mb-4 text-[#f5f1e8]">
      SustainSpace
    </h1>

    <p className="text-[#f5f1e8] italic text-base max-w-sm">
      "Curating a future where beauty and permanence coexist with our
      planet."
    </p>

    <p className="mt-4 tracking-[0.3em] text-xs text-[#f5f1e8]">
      EST. 2024
    </p>
  </div>
</div>
      </div>
      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 overflow-y-auto">
        {" "}
        <div className="w-full max-w-md">
          <h1 className="font-playfair text-3xl lg:text-4xl text-[#234236] italic tracking-wide">
            Welcome to the Atelier
          </h1>

          <p className="text-stone-500 mt-2">
            Access your curated space or start your journey.
          </p>

          {/* Demo Account */}
          <button
            disabled
            className="w-full mt-6 border border-stone-200 rounded-xl p-3 flex items-center justify-between bg-white opacity-80 cursor-not-allowed"
          >
            <div className="flex items-center gap-2 text-stone-600">
              <Info size={18} />
              Curious about the experience?
            </div>

            <span className="bg-[#6f4f42] text-white px-5 py-2 rounded-lg text-sm font-medium">
              Try Demo Account
            </span>
          </button>

          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-stone-200 text-m">
            {" "}
            <button
              onClick={() => setActiveTab("signup")}
              className={`pb-2.5 font-medium ${
                activeTab === "signup"
                  ? "border-b-2 border-[#0D3B2A] text-[#0D3B2A] font-semibold"
                  : "text-stone-400"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-3 font-medium ${
                activeTab === "login"
                  ? "border-b-2 border-[#0D3B2A] text-[#0D3B2A] font-semibold"
                  : "text-stone-400"
              }`}
            >
              Login
            </button>
          </div>

          {/* SIGNUP */}
          {activeTab === "signup" && (
            <form onSubmit={handleRegister} className="space-y-4 mt-6">
              <div>
                <p className="font-medium mb-3 text-stone-700">
                  I am joining as:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`p-4 border rounded-xl transition ${
                      role === "buyer"
                        ? "border-[#0D3B2A] bg-green-50"
                        : "border-stone-200"
                    }`}
                  >
                    <ShoppingBag size={20} className="mx-auto mb-2" />
                    <p className="text-sm">Buyer</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`p-4 border rounded-xl transition ${
                      role === "seller"
                        ? "border-[#0D3B2A] bg-green-50"
                        : "border-stone-200"
                    }`}
                  >
                    <Store size={20} className="mx-auto mb-2" />
                    <p className="text-sm">Seller</p>
                  </button>

                  <button
                    type="button"
                    disabled
                    className="p-4 border rounded-xl border-stone-200 opacity-50 cursor-not-allowed"
                  >
                    <Users size={20} className="mx-auto mb-2" />
                    <p className="text-sm">Both</p>
                  </button>
                </div>
              </div>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-4 text-stone-400"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.full_name}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border rounded-xl"
                />
              </div>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-4 text-stone-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      email: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border rounded-xl"
                />
              </div>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-4 text-stone-400"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={signupData.location}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      location: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <select className="w-28 border rounded-xl px-3">
                  <option>+60</option>
                  <option>+65</option>
                  <option>+1</option>
                  <option>+44</option>
                  <option>+61</option>
                </select>

                <div className="relative flex-1">
                  <Phone
                    size={18}
                    className="absolute left-4 top-4 text-stone-400"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={signupData.phone}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 border rounded-xl"
                  />
                </div>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-4 text-stone-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-10 py-3 border rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-stone-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0D3B2A] text-white font-medium text-sm"
              >
                CREATE ACCOUNT
              </button>
            </form>
          )}

          {/* LOGIN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-4 text-stone-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border rounded-xl"
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-4 text-stone-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#0D3B2A] text-white font-medium"
              >
                LOGIN
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="border-t border-stone-200" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-stone-50 px-3 text-xs text-stone-500">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button disabled className="border rounded-xl py-3 opacity-60">
              Google
            </button>

            <button
              disabled
              className="border rounded-xl py-3 opacity-60 flex items-center gap-2"
            >
              <Apple size={18} />
              Apple
            </button>
          </div>

          <p className="text-xs text-center text-stone-500 mt-8">
            By joining, you agree to SustainSpace's Sustainability Manifesto and
            Terms of Service.
          </p>
        </div>
      </div>
      <div className="hidden lg:block w-[24px] bg-[#0D3B2A]" />
    </div>
  );
}
