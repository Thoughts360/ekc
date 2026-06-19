import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { 
  Mail, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  ShieldAlert, 
  MailWarning, 
  BookOpen,
  Calendar,
  CornerDownRight,
  RefreshCcw,
  MailCheck
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Active expanded modal item
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "messages"));
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
      // Sort in-memory by sorted offset descending date
      fetched.sort((a, b) => {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      });
      setMessages(fetched);
    } catch (err: any) {
      console.error("Error reading enquiries: ", err);
      setError("Failed to fetch message queues from Firestore: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Verify: Delete this message log entry forever?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        fetchMessages();
      } catch (err: any) {
        console.error("Purging enquiry element error: ", err);
        setError("Database transaction failed: " + err.message);
      }
    }
  };

  const toggleReadStatus = async (msg: any) => {
    setSyncingId(msg.id);
    try {
      const nextReadState = !msg.read;
      const ref = doc(db, "messages", msg.id);
      await setDoc(ref, { ...msg, read: nextReadState });
      
      // Update state in-place to avoid re-fetch jank
      setMessages((prev) => 
        prev.map((item) => (item.id === msg.id ? { ...item, read: nextReadState } : item))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: nextReadState });
      }
    } catch (err: any) {
      console.error("Toggle read error: ", err);
      setError("Read flag write error: " + err.message);
    } finally {
      setSyncingId(null);
    }
  };

  const handleOpenExpand = async (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      // Mark as read automatically when opened
      try {
        const ref = doc(db, "messages", msg.id);
        await setDoc(ref, { ...msg, read: true });
        setMessages((prev) => 
          prev.map((item) => (item.id === msg.id ? { ...item, read: true } : item))
        );
      } catch (err) {
        console.error("Auto mark-as-read failure: ", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="manage-messages-wrapper">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10" id="manage-messages-main">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Direct Enquiries</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_action: [ROUTED_CONTACT_BUFFER_QUEUE]</p>
          </div>

          <button
            onClick={fetchMessages}
            disabled={loading}
            className="px-3.5 py-1.5 bg-[#1A1A2E] hover:text-[#E07B39] text-[#A0A0B0] border border-[#2A2A4A] hover:border-[#E07B39]/50 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> REFRESH_QUEUE
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2 text-left">
            <MailWarning className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="messages-layout-grid">
          
          {/* Main List column (left) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#1A1A2E] border-b border-[#2A2A4A] flex justify-between items-center">
                <span className="text-xs font-mono text-[#F0F0F0]">QUEUE_REGISTRY ({messages.length} PACKETS)</span>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
                  <span className="text-xs font-mono text-[#A0A0B0]">SYS_EXTRACTING_ENQUIRIES...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-20 text-center text-[#A0A0B0] font-mono text-xs max-w-sm mx-auto space-y-3">
                  <ShieldAlert className="w-10 h-10 text-[#E07B39]/20 mx-auto" />
                  <p>Inboxes clear. No connection logs cataloged.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2A2A4A]/20 max-h-[600px] overflow-y-auto" id="messages-scroller-col">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => handleOpenExpand(msg)}
                      className={`p-4 border-l-4 transition-all text-left cursor-pointer flex justify-between items-start gap-3 select-none ${
                        selectedMessage?.id === msg.id 
                          ? "bg-[#1A1A2E] border-l-[#E07B39]" 
                          : msg.read 
                            ? "hover:bg-[#111122] border-l-transparent bg-transparent" 
                            : "bg-[#1A1A2E]/50 border-l-[#E07B39] hover:bg-[#1A1A2E]/80"
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono font-bold leading-none ${msg.read ? 'text-[#A0A0B0]' : 'text-[#E07B39]'}`}>
                            {msg.name}
                          </span>
                          {!msg.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          )}
                        </div>
                        <h4 className={`text-xs font-space truncate ${msg.read ? 'text-[#A0A0B0]' : 'text-white font-bold'}`}>
                          {msg.subject}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {new Date(msg.createdAt || "").toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleReadStatus(msg)}
                          disabled={syncingId === msg.id}
                          className="p-1 hover:bg-[#1A1A2E] text-gray-500 hover:text-green-400 rounded tracking-none"
                          title={msg.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          {syncingId === msg.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <MailCheck className={`w-3.5 h-3.5 ${msg.read ? 'text-gray-500' : 'text-[#E07B39]'}`} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1 hover:bg-[#1A1A2E] text-gray-500 hover:text-red-400 rounded shrink-0"
                          title="Purge Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Reader Section Panel (right) */}
          <div className="lg:col-span-6">
            {selectedMessage ? (
              <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-6 space-y-6 shadow-xl sticky top-6" id="messages-expanded-panel">
                <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-4">
                  <span className="text-[10px] font-mono text-[#E07B39] uppercase">Active Message Reader</span>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1 hover:bg-[#1A1A2E] text-[#A0A0B0] hover:text-[#F0F0F0] rounded border border-transparent hover:border-[#2A2A4A]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Subject */}
                  <div className="p-4 bg-[#0D0D1A]/50 rounded-xl border border-[#2A2A4A]/50 space-y-1">
                    <span className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Subject Header</span>
                    <h3 className="font-space font-extrabold text-[#F0F0F0] text-base leading-snug">
                      {selectedMessage.subject}
                    </h3>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-[#0D0D1A]/30 rounded-lg border border-[#2A2A4A]/40 space-y-0.5">
                      <span className="text-[9px] text-[#A0A0B0] uppercase block">Sender Name</span>
                      <span className="text-white font-semibold">{selectedMessage.name}</span>
                    </div>

                    <div className="p-3 bg-[#0D0D1A]/30 rounded-lg border border-[#2A2A4A]/40 space-y-0.5 overflow-hidden">
                      <span className="text-[9px] text-[#A0A0B0] uppercase block">Email Address</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-[#E07B39] truncate block hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {/* Time metadata */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#A0A0B0]">
                    <Calendar className="w-3.5 h-3.5 text-[#E07B39]" />
                    <span>STAMP_TIME: {new Date(selectedMessage.createdAt || "").toLocaleString()}</span>
                  </div>

                  {/* Body message content text */}
                  <div className="p-5 bg-[#0D0D1A] rounded-xl border border-[#2A2A4A]/80 font-sans text-xs text-[#F0F0F0] leading-relaxed whitespace-pre-wrap text-left">
                    <div className="flex items-center gap-1.5 border-b border-[#2A2A4A]/30 pb-2.5 mb-2.5 font-mono text-[10px] text-gray-400">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#E07B39]" /> MSG_BODY_STREAM:
                    </div>
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Bottom interactive action triggers */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A4A]/30">
                  <button
                    onClick={() => toggleReadStatus(selectedMessage)}
                    className="px-4 py-2 bg-[#1A1A2E] border border-[#2A2A4A] text-xs font-mono text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39]/50 rounded-lg transition-colors"
                  >
                    FLAG: {selectedMessage.read ? 'MARK_UNREAD' : 'MARK_READ'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2 bg-[#1A1A2E] border border-red-500/20 text-xs font-mono text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    DELETE_PERMANENTLY
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#121224]/30 border-2 border-dashed border-[#2A2A4A]/50 rounded-xl p-12 text-center text-xs text-[#A0A0B0] font-mono flex flex-col items-center justify-center space-y-3 h-64 sticky top-6">
                <BookOpen className="w-8 h-8 text-[#E07B39]/20" />
                <p>Select a message packet registry from the logs queue list to read description contents.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
