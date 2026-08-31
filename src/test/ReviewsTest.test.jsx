import { describe, test, expect } from "vitest";
import { supabase } from "../config/supabaseClient";

describe("Buyer Reviews", () => {
  test("buyer can review a completed transaction", async () => {
    // =====================================================
    // TEST BUYER
    // Replace these with your actual buyer credentials
    // =====================================================

    const buyerEmail = "sara@gmail.com";
    const buyerPassword = "sara123";

    const testRating = 5;
    const testTitle = "Excellent purchase";
    const testComment =
      "This review was created during the automated buyer review test.";

    console.log("\n=================================");
    console.log("BUYER REVIEW TEST STARTED");
    console.log("=================================");

    try {
      // =====================================================
      // 1. LOGIN AS BUYER
      // =====================================================

      console.log("1. Logging in as buyer...");

      const {
        data: loginData,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: buyerEmail,
        password: buyerPassword,
      });

      if (loginError) {
        console.error("LOGIN ERROR:");
        console.error("Message:", loginError.message);
        console.error("Code:", loginError.code);
        console.error("Details:", loginError.details);
        console.error("Hint:", loginError.hint);
      }

      expect(loginError).toBeNull();
      expect(loginData.user).not.toBeNull();
      expect(loginData.session).not.toBeNull();

      const buyer = loginData.user;

      console.log("✓ Buyer login successful");
      console.log("  Buyer ID:", buyer.id);
      console.log("  Email:", buyer.email);

      // =====================================================
      // 2. FIND COMPLETED TRANSACTION
      // =====================================================

      console.log("2. Finding completed transaction...");

      const {
        data: transactions,
        error: transactionError,
      } = await supabase
        .from("transactions")
        .select(`
          id,
          buyer_id,
          seller_id,
          status,
          created_at,
          orders(
            listing_id,
            title,
            agreed_price
          )
        `)
        .eq("buyer_id", buyer.id)
        .eq("status", "completed")
        .order("created_at", {
          ascending: false,
        });

      if (transactionError) {
        console.error("TRANSACTION QUERY ERROR:");
        console.error("Message:", transactionError.message);
        console.error("Code:", transactionError.code);
        console.error("Details:", transactionError.details);
        console.error("Hint:", transactionError.hint);
      }

      expect(transactionError).toBeNull();
      expect(transactions).not.toBeNull();
      expect(transactions.length).toBeGreaterThan(0);

      const transaction = transactions[0];

      console.log("✓ Completed transaction found");
      console.log("  Transaction ID:", transaction.id);
      console.log("  Buyer ID:", transaction.buyer_id);
      console.log("  Seller ID:", transaction.seller_id);
      console.log("  Status:", transaction.status);
      console.log(
        "  Item:",
        transaction.orders?.title
      );

      // =====================================================
      // 3. VERIFY TRANSACTION BELONGS TO BUYER
      // =====================================================

      console.log("3. Verifying transaction ownership...");

      expect(transaction.buyer_id).toBe(buyer.id);

      console.log("✓ Transaction belongs to logged-in buyer");

      // =====================================================
      // 4. VERIFY TRANSACTION IS COMPLETED
      // =====================================================

      console.log("4. Checking transaction status...");

      expect(transaction.status).toBe("completed");

      console.log(
        "✓ Transaction status is completed"
      );

      // =====================================================
      // 5. CHECK EXISTING REVIEW
      // =====================================================

      console.log("5. Checking for existing review...");

      const {
        data: existingReview,
        error: existingReviewError,
      } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          title,
          comment
        `)
        .eq("transaction_id", transaction.id)
        .eq("buyer_id", buyer.id)
        .maybeSingle();

      if (existingReviewError) {
        console.error("EXISTING REVIEW ERROR:");
        console.error(
          "Message:",
          existingReviewError.message
        );
        console.error(
          "Code:",
          existingReviewError.code
        );
        console.error(
          "Details:",
          existingReviewError.details
        );
        console.error(
          "Hint:",
          existingReviewError.hint
        );
      }

      expect(existingReviewError).toBeNull();

      if (existingReview) {
        console.log(
          "⚠ Transaction already has a review."
        );
        console.log(
          "  Review ID:",
          existingReview.id
        );
        console.log(
          "  Rating:",
          existingReview.rating
        );

        console.log(
          "Test cannot create another review for this transaction."
        );

        return;
      }

      console.log("✓ Transaction has no existing review");

      // =====================================================
      // 6. CREATE BUYER REVIEW
      // =====================================================

      console.log("6. Creating buyer review...");

      const reviewData = {
        transaction_id: transaction.id,
        listing_id: transaction.orders?.listing_id,
        seller_id: transaction.seller_id,
        buyer_id: buyer.id,
        rating: testRating,
        title: testTitle,
        comment: testComment,
      };

      console.log("Review data:");
      console.log(reviewData);

      const {
        data: review,
        error: reviewError,
      } = await supabase
        .from("reviews")
        .insert(reviewData)
        .select()
        .single();

      if (reviewError) {
        console.error("\n=================================");
        console.error("REVIEW INSERT ERROR");
        console.error("=================================");
        console.error(
          "Message:",
          reviewError.message
        );
        console.error(
          "Code:",
          reviewError.code
        );
        console.error(
          "Details:",
          reviewError.details
        );
        console.error(
          "Hint:",
          reviewError.hint
        );
        console.error(
          "Full error:",
          reviewError
        );
      }

      expect(reviewError).toBeNull();
      expect(review).not.toBeNull();

      console.log("✓ Buyer review created");
      console.log("  Review ID:", review.id);

      // =====================================================
      // 7. VERIFY BUYER ID
      // =====================================================

      console.log("7. Verifying review buyer...");

      expect(review.buyer_id).toBe(buyer.id);

      console.log(
        "✓ Review belongs to logged-in buyer"
      );

      // =====================================================
      // 8. VERIFY TRANSACTION ID
      // =====================================================

      console.log(
        "8. Verifying review transaction..."
      );

      expect(review.transaction_id).toBe(
        transaction.id
      );

      console.log(
        "✓ Review connected to completed transaction"
      );

      // =====================================================
      // 9. VERIFY RATING
      // =====================================================

      console.log("9. Verifying rating...");

      expect(review.rating).toBe(testRating);

      console.log(
        `✓ Rating saved correctly: ${review.rating}/5`
      );

      // =====================================================
      // 10. VERIFY TITLE
      // =====================================================

      console.log("10. Verifying review title...");

      expect(review.title).toBe(testTitle);

      console.log("✓ Review title saved correctly");

      // =====================================================
      // 11. VERIFY COMMENT
      // =====================================================

      console.log("11. Verifying review comment...");

      expect(review.comment).toBe(testComment);

      console.log(
        "✓ Review comment saved correctly"
      );

      // =====================================================
      // 12. READ REVIEW BACK FROM DATABASE
      // =====================================================

      console.log(
        "12. Reading saved review from database..."
      );

      const {
        data: savedReview,
        error: savedReviewError,
      } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", review.id)
        .single();

      if (savedReviewError) {
        console.error(
          "SAVED REVIEW QUERY ERROR:"
        );
        console.error(
          "Message:",
          savedReviewError.message
        );
        console.error(
          "Code:",
          savedReviewError.code
        );
        console.error(
          "Details:",
          savedReviewError.details
        );
        console.error(
          "Hint:",
          savedReviewError.hint
        );
      }

      expect(savedReviewError).toBeNull();
      expect(savedReview).not.toBeNull();

      // =====================================================
      // 13. FINAL VERIFICATION
      // =====================================================

      expect(savedReview.buyer_id).toBe(
        buyer.id
      );

      expect(savedReview.transaction_id).toBe(
        transaction.id
      );

      expect(savedReview.rating).toBe(
        testRating
      );

      expect(savedReview.title).toBe(
        testTitle
      );

      expect(savedReview.comment).toBe(
        testComment
      );

      console.log("✓ Database review verified");

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log("\n=================================");
      console.log("✓ BUYER REVIEW TEST PASSED");
      console.log("=================================");

      console.log("Buyer:", buyer.email);
      console.log(
        "Transaction:",
        transaction.id
      );
      console.log(
        "Review:",
        savedReview.id
      );
      console.log(
        "Rating:",
        savedReview.rating + "/5"
      );

    } finally {
      // =====================================================
      // LOGOUT
      // =====================================================

      console.log("\nLogging out test buyer...");

      const { error: logoutError } =
        await supabase.auth.signOut();

      if (logoutError) {
        console.error(
          "Logout error:",
          logoutError
        );
      } else {
        console.log("✓ Buyer logged out");
      }
    }
  });
});