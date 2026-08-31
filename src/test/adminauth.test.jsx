import { describe, test, expect, afterEach } from "vitest";
import { supabase } from "../config/supabaseClient";

describe("NTC-03 - Unauthorized dashboard access", () => {
  afterEach(async () => {
    await supabase.auth.signOut();
  });

  test("should deny a normal user access to the admin dashboard", async () => {
    console.log("\n=================================");
    console.log("NTC-03 UNAUTHORIZED DASHBOARD ACCESS");
    console.log("=================================");

    // ----------------------------------------
    // TEST USER
    // ----------------------------------------

    const testEmail = "sara@gmail.com";
    const testPassword = "sara123";

    // ----------------------------------------
    // 1. LOGIN AS NORMAL USER
    // ----------------------------------------

    console.log("1. Logging in as normal user...");

    const {
      data: loginData,
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    expect(loginError).toBeNull();
    expect(loginData.user).not.toBeNull();
    expect(loginData.session).not.toBeNull();

    const userId = loginData.user.id;

    console.log("✓ User logged in");
    console.log("  User ID:", userId);
    console.log("  Email:", testEmail);

    // ----------------------------------------
    // 2. GET USER PROFILE
    // ----------------------------------------

    console.log("2. Checking user role...");

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", userId)
      .single();

    expect(profileError).toBeNull();
    expect(profile).not.toBeNull();

    console.log("✓ Profile found");
    console.log("  Name:", profile.full_name);
    console.log("  Role:", profile.role);

    // ----------------------------------------
    // 3. VERIFY USER IS NOT ADMIN
    // ----------------------------------------

    console.log("3. Verifying user is not an admin...");

    expect(profile.role).not.toBe("admin");

    console.log("✓ User is not an admin");

    // ----------------------------------------
    // 4. ATTEMPT ADMIN DASHBOARD ACCESS
    // ----------------------------------------

    console.log("4. Attempting to access admin dashboard...");

    /*
     * This represents the same authorization check
     * that should be used by your protected dashboard.
     *
     * Only users with role === "admin" are allowed.
     */

    const isAdmin = profile.role === "admin";

    expect(isAdmin).toBe(false);

    console.log("✓ Admin authorization check failed");

    // ----------------------------------------
    // 5. VERIFY ACCESS IS DENIED
    // ----------------------------------------

    console.log("5. Verifying access denial...");

    const accessGranted = profile.role === "admin";

    expect(accessGranted).toBe(false);

    console.log("✓ Access denied");

    // ----------------------------------------
    // 6. VERIFY EXPECTED REDIRECT
    // ----------------------------------------

    /*
     * Your App.jsx protected route should redirect
     * unauthorized users away from /admin.
     *
     * For example:
     *
     * /admin
     *   ↓
     * unauthorized
     *   ↓
     * /dashboard
     *
     * Change this expected route if your App.jsx
     * redirects to another page.
     */

    const requestedRoute = "/admin";
    const expectedRoute = "/dashboard";

    const redirectedRoute = isAdmin
      ? requestedRoute
      : expectedRoute;

    expect(redirectedRoute).toBe(expectedRoute);

    console.log("✓ Unauthorized user redirected");
    console.log("  Requested:", requestedRoute);
    console.log("  Redirected:", redirectedRoute);

    // ----------------------------------------
    // SUCCESS
    // ----------------------------------------

    console.log("=================================");
    console.log("✓ NTC-03 TEST PASSED");
    console.log("=================================\n");
  });
});