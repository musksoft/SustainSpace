import { supabase } from "../config/supabaseClient";

export default function SellerAuthTest() {
  const runSellerTest = async () => {
    const testEmail = `seller.test@example.com`;
    const testPassword = "SellerTest123!";

    try {
      console.log("=================================");
      console.log("SELLER AUTH TEST STARTED");
      console.log("=================================");

      // ----------------------------------------
      // 1. REGISTER SELLER
      // ----------------------------------------

      console.log("1. Registering seller...");

      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              full_name: "Automated Test Seller",
              phone: "+96550000000",
              location: "Kuwait",
              role: "seller",
            },
          },
        });

      if (signupError) {
        throw new Error(`Signup failed: ${signupError.message}`);
      }

      if (!signupData.user) {
        throw new Error("Signup succeeded but no user was returned.");
      }

      const userId = signupData.user.id;

      console.log("✓ Seller registered");
      console.log("User ID:", userId);
      console.log("Email:", testEmail);

      // ----------------------------------------
      // 2. CHECK PROFILE CREATED BY TRIGGER
      // ----------------------------------------

      console.log("2. Checking seller profile...");

      /*
       * Your database trigger should have created:
       *
       * public.profiles
       *
       * with role = seller
       */

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

      if (profileError) {
        throw new Error(
          `Profile query failed: ${profileError.message}`
        );
      }

      if (!profile) {
        throw new Error("Profile was not created.");
      }

      console.log("✓ Profile found");
      console.log("Profile:", profile);

      // ----------------------------------------
      // 3. VERIFY SELLER ROLE
      // ----------------------------------------

      console.log("3. Checking seller role...");

      if (profile.role !== "seller") {
        throw new Error(
          `Expected role "seller", received "${profile.role}"`
        );
      }

      console.log("✓ User has seller role");

      // ----------------------------------------
      // 4. LOG OUT
      // ----------------------------------------

      console.log("4. Logging out...");

      await supabase.auth.signOut();

      // ----------------------------------------
      // 5. LOGIN AS SELLER
      // ----------------------------------------

      console.log("5. Logging in as seller...");

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });

      if (loginError) {
        throw new Error(
          `Login failed: ${loginError.message}`
        );
      }

      if (!loginData.user) {
        throw new Error("Login succeeded but no user returned.");
      }

      console.log("✓ Seller login successful");
      console.log("Logged-in user:", loginData.user.id);

      // ----------------------------------------
      // 6. TEST RLS
      // ----------------------------------------

      console.log("6. Testing profile RLS...");

      const { data: loggedInProfile, error: loggedInProfileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", loginData.user.id)
          .single();

      if (loggedInProfileError) {
        throw new Error(
          `RLS profile query failed: ${loggedInProfileError.message}`
        );
      }

      console.log("✓ RLS allows seller to read own profile");

      // ----------------------------------------
      // 7. VERIFY FINAL SELLER DATA
      // ----------------------------------------

      if (loggedInProfile.role !== "seller") {
        throw new Error(
          `Logged-in user is not a seller. Role: ${loggedInProfile.role}`
        );
      }

      const slug = loggedInProfile.full_name
        .toLowerCase()
        .replace(/\s+/g, "-");

      const sellerRoute = `/seller/${loginData.user.id}/${slug}`;

      console.log("✓ Seller role confirmed");
      console.log("Seller name:", loggedInProfile.full_name);
      console.log("Seller email:", loggedInProfile.email);
      console.log("Seller route:", sellerRoute);

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      console.log("=================================");
      console.log("✓ SELLER AUTH TEST PASSED");
      console.log("=================================");

      alert(
        `Seller authentication test passed!\n\n` +
        `Email: ${testEmail}\n` +
        `Role: ${loggedInProfile.role}\n` +
        `Route: ${sellerRoute}`
      );
    } catch (error) {
      console.error("=================================");
      console.error("✗ SELLER AUTH TEST FAILED");
      console.error("=================================");
      console.error(error);

      alert(`Seller authentication test failed:\n\n${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-[#0D3B2A] mb-3">
          Seller Authentication Test
        </h1>

        <p className="text-stone-500 mb-6">
          This test creates a seller, logs in, verifies the profile,
          tests RLS, and confirms the seller route.
        </p>

        <button
          onClick={runSellerTest}
          className="w-full py-3 rounded-xl bg-[#0D3B2A] text-white font-medium"
        >
          RUN SELLER TEST
        </button>
      </div>
    </div>
  );
}