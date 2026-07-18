import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // replace with your Supabase project URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; // replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

