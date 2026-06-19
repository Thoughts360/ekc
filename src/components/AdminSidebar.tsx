import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderGit2, 
  BookOpen, 
  Cpu, 
  Award, 
  User, 
  Mail, 
  LogOut, 
  Terminal,
  ShieldCheck
} from "lucide-react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Disconnect security session and exit console?")) {
      try {
        await signOut(auth);
        navigate("/admin/login");
      } catch (err) {
        console.error("Signout error: ", err);
      }
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/projects", icon: FolderGit2 },
    { name: "Blog Posts", path: "/admin/blog", icon: BookOpen },
    { name: "Skills", path: "/admin/skills", icon: Cpu },
    { name: "Certifications", path: "/admin/certifications", icon: Award },
    { name: "About Info", path: "/admin/about", icon: User },
    { name: "Enquiries", path: "/admin/messages", icon: Mail },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full md:w-64 bg-[#1A1A2E] border-r border-[#2A2A4A] min-h-screen flex flex-col pt-6 font-space" id="admin-sidebar-layout">
      {/* Sidebar Header */}
      <div className="px-6 pb-6 border-b border-[#2A2A4A]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E07B39]/10 rounded border border-[#E07B39]/30">
            <ShieldCheck className="w-5 h-5 text-[#E07B39]" />
          </div>
          <div>
            <h2 className="text-[#F0F0F0] font-bold text-sm leading-none">EKC console</h2>
            <span className="text-[10px] text-[#A0A0B0] font-mono select-none">root@elvis-chanda:~#</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5" id="admin-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive(item.path)
                  ? "bg-[#E07B39] text-[#0D0D1A] font-bold shadow-md shadow-[#E07B39]/10"
                  : "text-[#A0A0B0] hover:text-[#F0F0F0] hover:bg-[#16213E]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-[#2A2A4A]/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-mono"
          id="admin-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          <span>SYS_SHUTDOWN</span>
        </button>
      </div>
    </div>
  );
}
