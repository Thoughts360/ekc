import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Terminal, UserCheck } from "lucide-react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0D1A]/90 backdrop-blur-md border-b border-[#2A2A4A] transition-all" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="nav-brand-logo">
            <div className="bg-[#1A1A2E] p-2 rounded-lg border border-[#2A2A4A] group-hover:border-[#E07B39] transition-colors">
              <Shield className="w-5 h-5 text-[#E07B39] group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-space font-bold text-xl tracking-wider text-[#F0F0F0]">
              EKC<span className="text-[#E07B39]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" id="nav-desktop-links">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase()}`}
                className={`font-space text-sm tracking-wide transition-all hover:text-[#E07B39] ${
                  isActive(link.path)
                    ? "text-[#E07B39] font-semibold border-b-2 border-[#E07B39] pb-1"
                    : "text-[#A0A0B0]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {adminUser ? (
              <Link
                to="/admin"
                id="nav-link-admin-panel"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E07B39]/10 text-[#E07B39] rounded-full border border-[#E07B39]/20 text-xs font-mono font-medium hover:bg-[#E07B39]/20 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                CONSOLE
              </Link>
            ) : (
              <Link
                to="/admin/login"
                id="nav-link-admin-login"
                className="flex items-center gap-1 text-xs text-[#A0A0B0] hover:text-[#E07B39] font-mono transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                sys_login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4" id="nav-mobile-controls">
            {adminUser && (
              <Link
                to="/admin"
                className="p-1 px-3 bg-[#E07B39]/10 text-[#E07B39] border border-[#E07B39]/30 rounded text-xs font-mono"
              >
                CTRL
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#F0F0F0] hover:text-[#E07B39] p-2 rounded-lg hover:bg-[#1A1A2E] transition-colors"
              aria-label="Toggle menu"
              id="nav-mobile-toggle-btn"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-[#0D0D1A] border-b border-[#2A2A4A] animate-slide-down" id="nav-mobile-dropdown">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-space text-base ${
                  isActive(link.path)
                    ? "bg-[#1A1A2E] text-[#E07B39] font-semibold border-l-4 border-[#E07B39]"
                    : "text-[#A0A0B0] hover:bg-[#1A1A2E] hover:text-[#F0F0F0]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#2A2A4A]/50 px-3">
              {adminUser ? (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#E07B39] font-mono text-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#A0A0B0] hover:text-[#E07B39] font-mono text-sm"
                >
                  <Terminal className="w-4 h-4" />
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
