import { describe, test, expect } from "vitest";
import { supabase } from "../config/supabaseClient";

describe("Supabase Connection", () => {
  test("should connect successfully", async () => {
    const { error } = await supabase
      .from("listings") //this table is open to all viewers irrespective of their roles
      .select("*")
      .limit(1);

    expect(error).toBeNull();
  });
});