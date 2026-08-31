import { describe, test, expect, afterEach } from "vitest";
import { supabase } from "../config/supabaseClient";

describe("TC-12 - Profile Management", () => {
  const testEmail = "sara@gmail.com";
  const testPassword = "sara123";

  let userId;
  let originalLocation;

  afterEach(async () => {
    // Restore the original location after the test
    if (userId && originalLocation !== undefined) {
      await supabase
        .from("profiles")
        .update({
          location: originalLocation,
        })
        .eq("id", userId);
    }

    await supabase.auth.signOut();
  });

  test("should allow a logged-in user to change their staying location", async () => {
    console.log("\n=================================");
    console.log("TC-12 PROFILE MANAGEMENT TEST");
    console.log("=================================");

    // ----------------------------------------
    // 1. LOGIN
    // ----------------------------------------

    console.log("1. Logging in as user...");

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

    userId = loginData.user.id;

    console.log("✓ User logged in");
    console.log("  User ID:", userId);

    // ----------------------------------------
    // 2. GET CURRENT PROFILE
    // ----------------------------------------

    console.log("2. Loading current profile...");

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, location")
      .eq("id", userId)
      .single();

    expect(profileError).toBeNull();
    expect(profile).not.toBeNull();
    expect(profile.id).toBe(userId);

    originalLocation = profile.location;

    console.log("✓ Profile loaded");
    console.log("  Name:", profile.full_name);
    console.log("  Current location:", profile.location);

    // ----------------------------------------
    // 3. CHANGE STAYING LOCATION
    // ----------------------------------------

    console.log("3. Changing staying location...");

    const newLocation = "New Avenus, UK";

    const {
      data: updatedProfile,
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        location: newLocation,
      })
      .eq("id", userId)
      .select("id, full_name, location")
      .single();

    expect(updateError).toBeNull();
    expect(updatedProfile).not.toBeNull();

    console.log("✓ Location updated");
    console.log("  New location:", updatedProfile.location);

    // ----------------------------------------
    // 4. VERIFY LOCATION
    // ----------------------------------------

    console.log("4. Verifying saved location...");

    expect(updatedProfile.id).toBe(userId);
    expect(updatedProfile.location).toBe(newLocation);

    console.log("✓ Location saved correctly");

    // ----------------------------------------
    // 5. READ PROFILE AGAIN
    // ----------------------------------------

    console.log("5. Reading profile again from database...");

    const {
      data: savedProfile,
      error: savedProfileError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, location")
      .eq("id", userId)
      .single();

    expect(savedProfileError).toBeNull();
    expect(savedProfile).not.toBeNull();

    // ----------------------------------------
    // 6. FINAL VERIFICATION
    // ----------------------------------------

    expect(savedProfile.id).toBe(userId);
    expect(savedProfile.location).toBe(newLocation);

    console.log("✓ Profile retrieved successfully");
    console.log("✓ Updated location confirmed");
    console.log("  Location:", savedProfile.location);

    console.log("=================================");
    console.log("✓ TC-12 PROFILE MANAGEMENT PASSED");
    console.log("=================================\n");
  });
}); //restores the location back to original after successfully updating to avoid duplicat/fake location addresses