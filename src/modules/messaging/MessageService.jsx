import { supabase } from "../../config/supabaseClient";

/**
 * Get all conversations for a user (buyer or seller)
 * Includes:
 * - listing info
 * - other user's profile
 * - last message preview
 */
export async function getConversations(userId) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      listing_id,
      buyer_id,
      seller_id,
      created_at,
      listings (
        id,
        title,
        price,
        featured_image
      )
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const enriched = await Promise.all(
    data.map(async (c) => {
      const otherUserId =
        c.buyer_id === userId ? c.seller_id : c.buyer_id;

      // get other user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", otherUserId)
        .single();

      // get last message
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("text, created_at")
        .eq("conversation_id", c.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        ...c,
        profiles: profile || null,
        lastMessage: lastMessage?.text || "",
        time: lastMessage
          ? new Date(lastMessage.created_at).toLocaleDateString()
          : "",
      };
    })
  );

  return enriched;
}

/**
 * Get messages inside a conversation
 */
export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Create conversation (if not exists)
 */
export async function createConversation({
  listingId,
  buyerId,
  sellerId,
}) {
  // check existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .maybeSingle();

  if (existing) return existing;

  // create new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert([
      {
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Send message
 */
export async function sendMessage({
  conversationId,
  senderId,
  text,
}) {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        text: text.trim(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}