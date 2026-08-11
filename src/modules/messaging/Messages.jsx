import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, Send, Paperclip, MoreVertical } from "lucide-react";

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
          (c) => c.listing_id === listingId && c.seller_id === sellerId,
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
    <div className="h-screen flex bg-[#FAF7F2] overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside
        className={`w-full md:w-[320px] bg-[#F7F3EC] border-r flex flex-col ${
          mobileView === "chat" ? "hidden md:flex" : "flex"
        }`}
      >
     <div className="p-4 border-b flex items-center gap-3">

           <button onClick={() => navigate(-1)}>
             <ArrowLeft />
           </button>

           <div>
           <h1 className="font-semibold text-lg text-[#1F3D2A]">
               Messages
             </h1>

             <p className="text-xs text-gray-500">
               Buyer conversations
             </p>
           </div></div>

        <div className="p-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages"
              className="w-full bg-white border rounded-lg pl-9 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => handleSelect(conversation)}
              className={`w-full text-left px-4 py-4 border-b transition ${
                selected?.id === conversation.id
                  ? "bg-[#1F3D2A] text-white"
                  : "hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#D8C2AE] flex items-center justify-center font-semibold text-[#1F3D2A]">
                  {conversation.profiles?.full_name?.charAt(0) || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium text-sm truncate">
                      {conversation.profiles?.full_name}
                    </p>

                    <span className="text-[10px] opacity-70">
                      {conversation.time}
                    </span>
                  </div>

                  <p
                    className={`text-xs truncate ${
                      selected?.id === conversation.id
                        ? "text-white/80"
                        : "text-[#8B5E3C]"
                    }`}
                  >
                    {conversation.listings?.title}
                  </p>

                  <p className="text-xs opacity-70 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <section
        className={`flex-1 flex flex-col min-h-0 h-screen overflow-hidden bg-[#FAF7F2] ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* HEADER */}
        <header className="h-16 shrink-0 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-[#1F3D2A]"
              onClick={() => setMobileView("list")}
            >
              <ArrowLeft size={22} />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#D8C2AE] flex items-center justify-center font-semibold text-[#1F3D2A]">
              {selected?.profiles?.full_name?.charAt(0) || "U"}
            </div>

            <div>
              <h2 className="font-semibold text-[#1F3D2A] text-sm">
                {selected?.profiles?.full_name || "Select conversation"}
              </h2>

              {selected && (
                <p className="text-xs text-gray-500">Buyer conversation</p>
              )}
            </div>
          </div>

          {/* <MoreVertical size={20} className="text-[#1F3D2A]" /> */}
        </header>

        {/* LISTING */}
        {selected && (
          <div className="shrink-0 px-5 py-3 bg-[#FFF9F3] border-b">
            <div className="bg-white border rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#1F3D2A]">
                  {selected.listings?.title}
                </p>

                <p className="text-sm font-semibold text-[#8B5E3C]">
                  €{selected.listings?.price}
                </p>
              </div>

              <button className="bg-[#1F3D2A] text-white px-4 py-2 rounded-lg text-xs">
                View Item
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 pb-10 space-y-5">
          {messages.length === 0 && selected && (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Start a conversation
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[65%] px-5 py-3 rounded-2xl text-sm ${
                  message.sender_id === user?.id
                    ? "bg-[#1F3D2A] text-white rounded-br-none"
                    : "bg-[#FFD9C9] text-[#5B4035] rounded-bl-none"
                }`}
              >
                <p>{message.text}</p>

                <p className="text-[9px] mt-2 opacity-60 text-right">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="shrink-0 bg-white border-t px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 bg-[#F7F3EC] rounded-xl px-4 py-2">
            <Paperclip size={18} className="text-gray-500" />

            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm py-2"
            />

            <button
              onClick={sendMessage}
              className="bg-[#1F3D2A] text-white w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
//  return (
//     <div className="h-screen flex bg-[#FAF7F2]">

//       {/* LEFT PANEL */}

//       <div
//         className={`
//           w-full md:w-[360px]
//           bg-white
//           border-r
//           flex flex-col
//           ${mobileView === "chat" ? "hidden md:flex" : "flex"}
//         `}
//       >

//         {/* Header */}

//         <div className="p-4 border-b flex items-center gap-3">

//           <button onClick={() => navigate(-1)}>
//             <ArrowLeft />
//           </button>

//           <div>
//             <h1 className="font-semibold text-[#1F3D2A]">
//               Messages
//             </h1>

//             <p className="text-xs text-gray-500">
//               Buyer conversations
//             </p>
//           </div>

//         </div>

//         {/* Search */}

//         <div className="p-3 border-b">

//           <div className="relative">

//             <Search
//               size={16}
//               className="absolute left-3 top-3 text-gray-400"
//             />

//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="w-full border rounded-lg pl-9 pr-3 py-2"
//             />

//           </div>

//         </div>

//         {/* Conversation List */}

//         <div className="flex-1 overflow-y-auto">

//           {filtered.map((conversation) => (

//             <button
//               key={conversation.id}
//               onClick={() => handleSelect(conversation)}
//               className={`
//                 w-full
//                 text-left
//                 p-4
//                 border-b
//                 hover:bg-gray-50
//                 ${
//                   selected?.id === conversation.id
//                     ? "bg-[#F3EFE8]"
//                     : ""
//                 }
//               `}
//             >

//               <div className="flex justify-between">

//                 <p className="font-semibold">
//                   {conversation.profiles?.full_name}
//                 </p>

//                 <span className="text-xs text-gray-400">
//                   {conversation.time}
//                 </span>

//               </div>

//               <p className="text-sm text-[#8B5E3C]">
//                 {conversation.listings?.title}
//               </p>

//               <p className="text-sm text-gray-500 truncate">
//                 {conversation.lastMessage}
//               </p>

//             </button>

//           ))}

//         </div>

//       </div>
//             {/* RIGHT PANEL */}
//       <div
//         className={`
//           flex-1 flex flex-col
//           ${mobileView === "list" ? "hidden md:flex" : "flex"}
//         `}
//       >

//         {/* HEADER */}
//         <div className="bg-white border-b p-4 flex items-center justify-between">

//           <div className="flex items-center gap-3">

//             <button
//               className="md:hidden"
//               onClick={() => setMobileView("list")}
//             >
//               <ArrowLeft />
//             </button>

//             <div>
//               <h2 className="font-semibold text-[#1F3D2A]">
//                 {selected?.profiles?.full_name || "Select conversation"}
//               </h2>

//               <p className="text-xs text-gray-500">
//                 Buyer conversation
//               </p>
//             </div>

//           </div>

//           <MoreVertical size={18} />

//         </div>

//         {/* LISTING CARD */}
//         {selected && (
//           <div className="bg-[#FFF9F3] border-b p-4">

//             <div className="bg-white border rounded-lg flex gap-3 p-3">

//               <img
//                 src={selected?.listings?.featured_image}
//                 className="w-16 h-16 rounded object-cover"
//               />

//               <div>

//                 <p className="font-semibold">
//                   {selected?.listings?.title}
//                 </p>

//                 <p className="text-[#8B5E3C]">
//                   {selected?.listings?.price}
//                 </p>

//                 <button className="text-sm mt-1 text-white bg-[#1F3D2A] px-3 py-1 rounded">
//                   View Listing
//                 </button>

//               </div>

//             </div>

//           </div>
//         )}

//         {/* MESSAGES */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">

//           {messages.map((m) => (
//             <div
//               key={m.id}
//               className={`flex ${
//                 m.sender_id === user?.id
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >

//               <div
//                 className={`px-3 py-2 rounded-xl max-w-[70%] text-sm ${
//                   m.sender_id === user?.id
//                     ? "bg-[#1F3D2A] text-white"
//                     : "bg-white border"
//                 }`}
//               >
//                 {m.text}
//               </div>

//             </div>
//           ))}

//         </div>

//         {/* INPUT */}
//         <div className="border-t bg-white p-3 flex items-center gap-2">

//           <Paperclip size={18} className="text-gray-500" />

//           <input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) =>
//               e.key === "Enter" && sendMessage()
//             }
//             placeholder="Type message..."
//             className="flex-1 border rounded-lg px-3 py-2"
//           />

//           <button
//             onClick={sendMessage}
//             className="bg-[#1F3D2A] text-white px-4 py-2 rounded-lg"
//           >
//             <Send size={16} />
//           </button>

//         </div>

//       </div>

//     </div>
//   );
