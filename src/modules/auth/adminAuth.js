import { supabase } from "../../config/supabaseClient";

// LOGIN ADMIN

export async function loginAdmin(email, password) {
  // Authenticate with Supabase Auth

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user;

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  // Check admin permissions

  const { data: admin, error: adminError } = await supabase

    .from("admins")

    .select("*")

    .eq("user_id", user.id)

    .single();

  if (adminError || !admin) {
    console.log("ADMIN ERROR:", adminError);

    console.log("ADMIN DATA:", admin);

    await supabase.auth.signOut();

    throw new Error("This account does not have administrator privileges.");
  }

  // Check if account is active

  if (admin.active !== true) {
    await supabase.auth.signOut();

    throw new Error("Administrator account has been disabled.");
  }

  // Update login timestamp

  await supabase

    .from("admins")

    .update({
      last_login: new Date().toISOString(),
    })

    .eq("user_id", user.id);

  return {
    user,

    admin,
  };
}

// GET CURRENT ADMIN

export async function getCurrentAdmin() {
  // Check active session

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const user = session.user;

  // Verify admin record

  const {
    data: admin,

    error,
  } = await supabase

    .from("admins")

    .select("*")

    .eq(
      "user_id",

      user.id,
    )

    .single();

  if (error || !admin) {
    return null;
  }

  if (!admin.active) {
    return null;
  }

  return {
    user,

    admin,
  };
}

// LOGOUT

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// PASSWORD RESET

export async function resetAdminPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,

    {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    },
  );

  if (error) {
    throw error;
  }
}
