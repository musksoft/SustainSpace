import { describe, test, expect } from "vitest";
import { supabase } from "../config/supabaseClient";

describe("Seller Authentication", () => {
  test("should register and login as a seller", async () => {
    const testEmail = `seller.test@example.com`;
    const testPassword = "SellerTest123!";

    console.log("\n=================================");
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

    expect(signupError).toBeNull();
    expect(signupData.user).not.toBeNull();

    const userId = signupData.user.id;

    console.log("✓ Seller registered");
    console.log("  User ID:", userId);
    console.log("  Email:", testEmail);

    // ----------------------------------------
    // 2. CHECK PROFILE CREATED BY TRIGGER
    // ----------------------------------------

    console.log("2. Checking seller profile...");

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    expect(profileError).toBeNull();
    expect(profile).not.toBeNull();

    console.log("✓ Profile created");
    console.log("  Name:", profile.full_name);
    console.log("  Role:", profile.role);

    // ----------------------------------------
    // 3. VERIFY SELLER ROLE
    // ----------------------------------------

    console.log("3. Checking seller role...");

    expect(profile.role).toBe("seller");

    console.log("✓ User is a seller");

    // ----------------------------------------
    // 4. LOG OUT
    // ----------------------------------------

    console.log("4. Logging out...");

    const { error: logoutError } =
      await supabase.auth.signOut();

    expect(logoutError).toBeNull();

    console.log("✓ Logged out");

    // ----------------------------------------
    // 5. LOGIN AS SELLER
    // ----------------------------------------

    console.log("5. Logging in as seller...");

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    expect(loginError).toBeNull();
    expect(loginData.user).not.toBeNull();
    expect(loginData.session).not.toBeNull();

    expect(loginData.user.id).toBe(userId);

    console.log("✓ Seller login successful");

    // ----------------------------------------
    // 6. TEST RLS
    // ----------------------------------------

    console.log("6. Testing profile RLS...");

    const {
      data: loggedInProfile,
      error: loggedInProfileError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", loginData.user.id)
      .single();

    expect(loggedInProfileError).toBeNull();
    expect(loggedInProfile).not.toBeNull();

    console.log("✓ RLS allows seller to read own profile");

    // ----------------------------------------
    // 7. VERIFY FINAL SELLER
    // ----------------------------------------

    expect(loggedInProfile.role).toBe("seller");

    const slug = loggedInProfile.full_name
      .toLowerCase()
      .replace(/\s+/g, "-");

    const sellerRoute =
      `/seller/${loginData.user.id}/${slug}`;

    console.log("✓ Seller role confirmed");
    console.log("  Route:", sellerRoute);

    // ----------------------------------------
    // 8. CLEAN UP SESSION
    // ----------------------------------------

    await supabase.auth.signOut();

    console.log("=================================");
    console.log("✓ SELLER AUTH TEST PASSED");
    console.log("=================================\n");
  });
});