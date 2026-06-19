import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../services/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Shield, Lock, Mail, Terminal, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, skip login screen and redirect to primary dashboard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please isolate and input credential parameters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/admin");
    } catch (err: any) {
      console.error("Authentication error: ", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid secure console credentials.");
      } else {
        setError(err.message || "An error occurred during verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col justify-center items-center px-4 py-12 relative" id="admin-login-wrapper">
      {/* Background Matrix lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a15_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-md w-full bg-[#121224] border border-[#2A2A4A] rounded-xl p-8 shadow-2xl relative z-10 space-y-8" id="login-container">
        
        {/* Terminal Header Monogram */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-3.5 bg-[#E07B39]/10 rounded-full border border-[#E07B39]/20 shadow-lg shadow-[#E07B39]/5">
            <Shield className="w-8 h-8 text-[#E07B39]" />
          </div>
          <span className="text-[10px] font-mono text-[#E07B39] tracking-widest uppercase">sys_auth_console</span>
          <h1 className="text-2xl font-extrabold font-space text-[#F0F0F0]">EKC Operator Login</h1>
          <p className="text-xs text-[#A0A0B0] max-w-xs leading-relaxed">
            Restricted security console. Access credentials must be verified on the authentication node.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 text-left" id="login-form">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">
                Operator Mail / UID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#A0A0B0]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elvis@domain.com"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F0F0F0] font-mono transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">
                Verification Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#A0A0B0]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F0F0F0] font-mono transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E07B39] disabled:bg-[#1A1A2E] text-[#0D0D1A] disabled:text-[#A0A0B0] font-space font-bold rounded-lg transition-all hover:bg-[#E07B39]/90 border border-[#E07B39] flex items-center justify-center gap-2 text-sm select-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> ESTABLISHING_SHIELD_TUNNEL...
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" /> REVEAL_CONSOLE_DASH
                </>
              )}
            </button>
          </div>
        </form>

        <div className="border-t border-[#2A2A4A]/50 pt-4 text-center">
          <Link to="/" className="text-xs font-mono text-[#A0A0B0] hover:text-[#E07B39] transition-colors leading-none">
            &lt; Return to Public Workstation
          </Link>
        </div>
      </div>
    </div>
  );
}
