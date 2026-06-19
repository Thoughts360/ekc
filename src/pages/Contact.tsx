import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  CheckCircle2, 
  Terminal, 
  AlertTriangle,
  Send,
  Loader2
} from "lucide-react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verification guards
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please isolate and verify all input values are populated.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create document in Firestore messages collection
      await addDoc(collection(db, "messages"), {
        ...formData,
        read: false,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      console.error("Enquiry submit error: ", err);
      setError("Failure writing telemetry message stream: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="contact-page-wrapper">
      {/* 1. Header Hero Panel */}
      <section className="relative py-14 bg-[#121224] border-b border-[#2A2A4A] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a15_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative">
          <div className="inline-flex p-3 bg-[#E07B39]/10 rounded-full border border-[#E07B39]/20 mb-1">
            <Mail className="w-6 h-6 text-[#E07B39]" />
          </div>
          <p className="text-xs font-mono text-[#E07B39] tracking-widest uppercase">sys_index_enquiry</p>
          <h1 className="text-4xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Establish Connection</h1>
          <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto">
            Transit message packets securely directly to Elvis's administration dashboard. Logs are monitored periodically.
          </p>
          <div className="w-16 h-1 bg-[#E07B39] rounded mx-auto mt-2" />
        </div>
      </section>

      {/* 2. Main content split info */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-split-grid">
          
          {/* Information & Socials Column (Left) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-space text-[#F0F0F0]">
                Operator Coordinate Map
              </h2>
              <p className="text-sm text-[#A0A0B0] leading-relaxed font-sans">
                For career vacancies, security test consultations, PfSense architecture designs, or CTF problem solvings, feel free to dispatch a log below.
              </p>
            </div>

            <div className="space-y-4 text-sm font-mono" id="contact-cards-info">
              {/* Coordinate: Email */}
              <div className="p-4 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center gap-4 hover:border-[#E07B39]/30 transition-all">
                <span className="p-2.5 bg-[#0D0D1A] rounded-lg border border-[#2A2A4A]">
                  <Mail className="w-5 h-5 text-[#E07B39]" />
                </span>
                <div className="text-left">
                  <span className="text-[10px] text-[#A0A0B0] block uppercase tracking-wider">Mail vector</span>
                  <a href="mailto:elvischanda31@gmail.com" className="text-xs text-[#F0F0F0] hover:text-[#E07B39] transition-all">
                    elvischanda31@gmail.com
                  </a>
                </div>
              </div>

              {/* Coordinate: Location */}
              <div className="p-4 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center gap-4 hover:border-[#E07B39]/35 transition-all">
                <span className="p-2.5 bg-[#0D0D1A] rounded-lg border border-[#2A2A4A]">
                  <MapPin className="w-5 h-5 text-[#E07B39]" />
                </span>
                <div className="text-left">
                  <span className="text-[10px] text-[#A0A0B0] block uppercase tracking-wider">Locus marker</span>
                  <span className="text-xs text-[#F0F0F0]">
                    Lusaka, Zambia 🇿🇲
                  </span>
                </div>
              </div>
            </div>

            {/* Social handles links panel */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#A0A0B0] tracking-wider block uppercase">Social references:</span>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Elvis-chanda"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#1A1A2E] border border-[#2A2A4A] text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39] rounded-lg text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4" /> GITHUB
                </a>
                <a
                  href="https://linkedin.com/in/elvis-chanda-0b3296245"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#1A1A2E] border border-[#2A2A4A] text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39] rounded-lg text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LINKEDIN
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Form Column (Right) */}
          <div className="lg:col-span-7">
            <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-8 shadow-xl shadow-[#0d0d1a]/50">
              
              <div className="flex items-center gap-2 border-b border-[#2A2A4A]/50 pb-4 mb-6">
                <Terminal className="w-5 h-5 text-[#E07B39]" />
                <span className="text-xs font-mono text-[#A0A0B0]">sys_dispatch_utility --mode=secure</span>
              </div>

              {success ? (
                <div className="py-8 text-center space-y-4" id="contact-success-panel">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-full w-fit mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="font-space font-bold text-xl text-[#F0F0F0]">Message Packet Dispatched</h3>
                  <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto leading-relaxed font-sans">
                    The contact form log has successfully committed to the active database. Our administration console is monitoring the packet stream and will review your subject payload soon.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-4 py-2 bg-[#1A1A2E] border border-[#2A2A4A] text-xs font-mono text-[#E07B39] hover:border-[#E07B39] rounded transition-all"
                    >
                      RESET_DISPATCHER
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left" id="contact-form">
                  {error && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#A0A0B0] tracking-wider uppercase block">
                        Identifier / Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-sans transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#A0A0B0] tracking-wider uppercase block">
                        Email stream address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="johndoe@email.com"
                        className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-sans transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#A0A0B0] tracking-wider uppercase block">
                      Subject case payload
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Consulting PfSense Monitoring Project"
                      className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-sans transition-colors"
                    />
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#A0A0B0] tracking-wider uppercase block">
                      Message buffer write
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Type details regarding laboratory case files or secure testing vectors..."
                      className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-sans transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#E07B39] disabled:bg-[#1A1A2E] text-[#0D0D1A] disabled:text-[#A0A0B0] font-space font-bold rounded-lg transition-all hover:bg-[#E07B39]/90 border border-[#E07B39] flex items-center justify-center gap-2 text-sm select-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> DISPATCHING_STREAM...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> TRANSMIT_PACKET
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
