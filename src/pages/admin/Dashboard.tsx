import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FolderGit2, 
  BookOpen, 
  Cpu, 
  Mail, 
  Loader2, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import AdminSidebar from "../../components/AdminSidebar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const blogsSnap = await getDocs(collection(db, "blogPosts"));
        const skillsSnap = await getDocs(collection(db, "skills"));
        const messagesSnap = await getDocs(collection(db, "messages"));

        const messages = messagesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        const unread = messages.filter((m: any) => m.read === false);
        
        // Sort messages by date to list the three most recent
        messages.sort((a: any, b: any) => {
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        });

        setStats({
          projects: projectsSnap.size,
          blogs: blogsSnap.size,
          skills: skillsSnap.size,
          messages: messagesSnap.size,
          unreadMessages: unread.length
        });
        setRecentMessages(messages.slice(0, 3));
      } catch (err) {
        console.error("Dashboard extraction error: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="admin-dashboard-container">
      {/* 1. Sidebar Navigation */}
      <AdminSidebar />

      {/* 2. Main Dashboard Content Panels */}
      <main className="flex-1 p-6 md:p-10 space-y-10" id="admin-dashboard-main">
        {/* Dash Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Console Diagnostics</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_status: [AUTHORIZED_OPERATOR_ONLINE]</p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/admin/projects"
              className="px-3.5 py-2 bg-[#E07B39]/10 hover:bg-[#E07B39]/25 text-[#E07B39] border border-[#E07B39]/30 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> NEW_PROJECT
            </Link>
            <Link
              to="/"
              target="_blank"
              className="px-3.5 py-2 bg-[#1A1A2E] text-xs font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded-lg flex items-center gap-1 hover:text-[#F0F0F0] hover:border-[#E07B39]/50 transition-all"
            >
              VERIFY_PROD <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono text-[#A0A0B0]">SYS_QUERYING_DIAGNOSTICS_DATA...</p>
          </div>
        ) : (
          <div className="space-y-10 text-left">
            {/* Counts Grid Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-counters-grid">
              {/* Card 1: Projects */}
              <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center justify-between shadow shadow-[#000]/30 hover:border-[#E07B39]/30 transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Case Files</span>
                  <p className="text-3xl font-extrabold font-space text-[#F0F0F0]">{stats.projects}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                  <FolderGit2 className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Blogs */}
              <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center justify-between shadow shadow-[#000]/30 hover:border-[#E07B39]/30 transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Log writeups</span>
                  <p className="text-3xl font-extrabold font-space text-[#F0F0F0]">{stats.blogs}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Skills */}
              <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center justify-between shadow shadow-[#000]/30 hover:border-[#E07B39]/30 transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Competencies</span>
                  <p className="text-3xl font-extrabold font-space text-[#F0F0F0]">{stats.skills}</p>
                </div>
                <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/20 text-teal-400">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Messages */}
              <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center justify-between shadow shadow-[#000]/30 hover:border-[#E07B39]/30 transition-all relative">
                {stats.unreadMessages > 0 && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Enquiries</span>
                  <p className="text-3xl font-extrabold font-space text-[#F0F0F0]">
                    {stats.messages} <span className="text-xs text-[#E07B39] font-mono">({stats.unreadMessages} NEW)</span>
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Recent Messages & Active logs pane split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-recent-panels">
              {/* Recent Enquiries column */}
              <div className="lg:col-span-7 bg-[#121224] border border-[#2A2A4A] rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-3">
                  <h3 className="font-space font-bold text-lg text-[#F0F0F0] flex items-center gap-2">
                    <Mail className="w-4.5 h-4.5 text-[#E07B39]" /> Recent Message Buffer
                  </h3>
                  <Link
                    to="/admin/messages"
                    className="text-xs font-mono text-[#E07B39] hover:underline flex items-center gap-1"
                  >
                    sys_view_all <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {recentMessages.length === 0 ? (
                  <div className="py-12 text-center text-[#A0A0B0] font-mono text-xs">
                    Buffer queue empty. No messages archived.
                  </div>
                ) : (
                  <div className="space-y-3" id="recent-messages-list">
                    {recentMessages.map((msg) => (
                      <Link
                        key={msg.id}
                        to="/admin/messages"
                        className={`block p-4 rounded-xl border transition-all text-left group ${
                          msg.read 
                            ? "bg-[#1A1A2E]/50 border-[#2A2A4A] hover:border-gray-500/35"
                            : "bg-[#1A1A2E] border-[#E07B39]/30 hover:border-[#E07B39]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-[#A0A0B0] mb-1.5">
                          <span className="text-[#E07B39] font-semibold">{msg.name}</span>
                          <span>{new Date(msg.createdAt || "").toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-space font-bold text-[#F0F0F0] text-sm truncate group-hover:text-[#E07B39] transition-colors">
                          {msg.subject}
                        </h4>
                        <p className="text-xs text-[#A0A0B0] line-clamp-1 truncate mt-1">
                          {msg.message}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Node System Stats (Right Column) */}
              <div className="lg:col-span-5 bg-[#121224] border border-[#2A2A4A] rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-3">
                  <h3 className="font-space font-bold text-lg text-[#F0F0F0] flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#E07B39]" /> Environment Telemetry
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-mono" id="environment-metrics">
                  <div className="flex justify-between p-3 bg-[#0D0D1A]/60 rounded border border-[#2A2A4A]/50">
                    <span className="text-[#A0A0B0]">Database Target ID</span>
                    <span className="text-[#E07B39]">nlo21-8dc74</span>
                  </div>

                  <div className="flex justify-between p-3 bg-[#0D0D1A]/60 rounded border border-[#2A2A4A]/50">
                    <span className="text-[#A0A0B0]">Cloud Node Status</span>
                    <span className="text-green-400 font-bold bg-green-500/15 border border-green-500/30 px-1.5 py-0.5 rounded leading-none">
                      ONLINE
                    </span>
                  </div>

                  <div className="flex justify-between p-3 bg-[#0D0D1A]/60 rounded border border-[#2A2A4A]/50">
                    <span className="text-[#A0A0B0]">Client API Latency</span>
                    <span className="text-[#F0F0F0]">&lt; 14ms (SSL_SECURE)</span>
                  </div>

                  <div className="flex justify-between p-3 bg-[#0D0D1A]/60 rounded border border-[#2A2A4A]/50">
                    <span className="text-[#A0A0B0]">Server Environment</span>
                    <span className="text-[#F0F0F0]">Vite SPA Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
