import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  MoreVertical,
} from "lucide-react";

import { supabase } from "../../config/supabaseClient";

import {
  getConversations,
  getMessages,
  sendMessage as sendMessageAPI,
  createConversation,
} from "../messaging/messageService";

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sellerId, listingId } = location.state || {};

  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const loadMessages = async (conversationId) => {
    const msgs = await getMessages(conversationId);
    setMessages(msgs);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      let convos = await getConversations(user.id);

      // Open conversation from Listing Details
      if (sellerId && listingId) {
        let convo = convos.find(
          (c) =>
            c.listing_id === listingId &&
            c.seller_id === sellerId
        );

        if (!convo) {
          await createConversation({
            listingId,
            buyerId: user.id,
            sellerId,
          });

          convos = await getConversations(user.id);
        }
      }

      setConversations(convos);

      if (convos.length > 0) {
        setSelected(convos[0]);
        setMobileView("chat");
        await loadMessages(convos[0].id);
      }
    };

    init();
  }, []);
    // -------------------------
  // SELECT CONVERSATION
  // -------------------------
  const handleSelect = async (conversation) => {
    setSelected(conversation);
    setMobileView("chat");
    await loadMessages(conversation.id);
  };

  // -------------------------
  // SEND MESSAGE
  // -------------------------
  const sendMessage = async () => {
    if (!selected || !user || !newMessage.trim()) return;

    try {
      const msg = await sendMessageAPI({
        conversationId: selected.id,
        senderId: user.id,
        text: newMessage.trim(),
      });

      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  // -------------------------
  // SEARCH
  // -------------------------
  const filtered = conversations.filter((c) => {
    const name = c.profiles?.full_name || "";
    const title = c.listings?.title || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="h-screen flex bg-[#FAF7F2]">

      {/* LEFT PANEL */}

      <div
        className={`
          w-full md:w-[360px]
          bg-white
          border-r
          flex flex-col
          ${mobileView === "chat" ? "hidden md:flex" : "flex"}
        `}
      >

        {/* Header */}

        <div className="p-4 border-b flex items-center gap-3">

          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>

          <div>
            <h1 className="font-semibold text-[#1F3D2A]">
              Messages
            </h1>

            <p className="text-xs text-gray-500">
              Buyer conversations
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="p-3 border-b">

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full border rounded-lg pl-9 pr-3 py-2"
            />

          </div>

        </div>

        {/* Conversation List */}

        <div className="flex-1 overflow-y-auto">

          {filtered.map((conversation) => (

            <button
              key={conversation.id}
              onClick={() => handleSelect(conversation)}
              className={`
                w-full
                text-left
                p-4
                border-b
                hover:bg-gray-50
                ${
                  selected?.id === conversation.id
                    ? "bg-[#F3EFE8]"
                    : ""
                }
              `}
            >

              <div className="flex justify-between">

                <p className="font-semibold">
                  {conversation.profiles?.full_name}
                </p>

                <span className="text-xs text-gray-400">
                  {conversation.time}
                </span>

              </div>

              <p className="text-sm text-[#8B5E3C]">
                {conversation.listings?.title}
              </p>

              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage}
              </p>

            </button>

          ))}

        </div>

      </div>
            {/* RIGHT PANEL */}
      <div
        className={`
          flex-1 flex flex-col
          ${mobileView === "list" ? "hidden md:flex" : "flex"}
        `}
      >

        {/* HEADER */}
        <div className="bg-white border-b p-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              className="md:hidden"
              onClick={() => setMobileView("list")}
            >
              <ArrowLeft />
            </button>

            <div>
              <h2 className="font-semibold text-[#1F3D2A]">
                {selected?.profiles?.full_name || "Select conversation"}
              </h2>

              <p className="text-xs text-gray-500">
                Buyer conversation
              </p>
            </div>

          </div>

          <MoreVertical size={18} />

        </div>

        {/* LISTING CARD */}
        {selected && (
          <div className="bg-[#FFF9F3] border-b p-4">

            <div className="bg-white border rounded-lg flex gap-3 p-3">

              <img
                src={selected?.listings?.featured_image}
                className="w-16 h-16 rounded object-cover"
              />

              <div>

                <p className="font-semibold">
                  {selected?.listings?.title}
                </p>

                <p className="text-[#8B5E3C]">
                  {selected?.listings?.price}
                </p>

                <button className="text-sm mt-1 text-white bg-[#1F3D2A] px-3 py-1 rounded">
                  View Listing
                </button>

              </div>

            </div>

          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender_id === user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`px-3 py-2 rounded-xl max-w-[70%] text-sm ${
                  m.sender_id === user?.id
                    ? "bg-[#1F3D2A] text-white"
                    : "bg-white border"
                }`}
              >
                {m.text}
              </div>

            </div>
          ))}

        </div>

        {/* INPUT */}
        <div className="border-t bg-white p-3 flex items-center gap-2">

          <Paperclip size={18} className="text-gray-500" />

          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Type message..."
            className="flex-1 border rounded-lg px-3 py-2"
          />

          <button
            onClick={sendMessage}
            className="bg-[#1F3D2A] text-white px-4 py-2 rounded-lg"
          >
            <Send size={16} />
          </button>

        </div>

      </div>

    </div>
  );
}