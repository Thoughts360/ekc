import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
  Check, 
  Loader2, 
  User, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Save,
  BookOpen,
  CalendarDays
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Core Bio content
  const [bioPara1, setBioPara1] = useState("");
  const [bioPara2, setBioPara2] = useState("");
  
  // Philosophy values
  const [philTitle, setPhilTitle] = useState("");
  const [philDescription, setPhilDescription] = useState("");
  const [philIcon, setPhilIcon] = useState("");

  // Timeline Milestone values (Nested Array state)
  const [milestones, setMilestones] = useState<any[]>([]);
  
  // Temporary milestone insertion holders of items
  const [tempMilestone, setTempMilestone] = useState({
    year: "",
    title: "",
    subtitle: "",
    description: "",
    type: "education" // "education" | "experience" | "achievement" / "cert"
  });

  useEffect(() => {
    async function loadAboutDocument() {
      try {
        setLoading(true);
        const ref = doc(db, "about", "personal");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          
          // Paragraphs
          const paras = data.bioParagraphs || [];
          setBioPara1(paras[0] || "");
          setBioPara2(paras[1] || "");

          // Philosophy
          const phil = data.philosophy || {};
          setPhilTitle(phil.title || "");
          setPhilDescription(phil.description || "");
          setPhilIcon(phil.icon || "⚓");

          // Milestones timeline
          setMilestones(data.milestones || []);
        } else {
          // Initialize defaults if document does not exist yet
          setBioPara1("Enter short biography overview...");
          setMilestones([]);
        }
      } catch (err: any) {
        console.error("Error reading personal context document: ", err);
        setError("Failed to fetch biography documents: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAboutDocument();
  }, []);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempMilestone.year.trim() || !tempMilestone.title.trim()) {
      alert("Please populate year and title indicators prior to timelines insert.");
      return;
    }
    setMilestones((prev) => [...prev, { ...tempMilestone }]);
    setTempMilestone({
      year: "",
      title: "",
      subtitle: "",
      description: "",
      type: "education"
    });
  };

  const handleRemoveMilestone = (index: number) => {
    if (window.confirm("Verify: Remove this milestone row from local buffer queue?")) {
      setMilestones((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    const bioParagraphsArray = [
      bioPara1.trim(),
      bioPara2.trim()
    ].filter((p) => p.length > 0);

    const payload = {
      bioParagraphs: bioParagraphsArray,
      philosophy: {
        title: philTitle.trim(),
        description: philDescription.trim(),
        icon: philIcon.trim() || "⚓"
      },
      milestones: milestones
    };

    try {
      await setDoc(doc(db, "about", "personal"), payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error("About writing error: ", err);
      setError("Committed payload error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="manage-about-wrapper">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10" id="manage-about-main">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Biography & TIMELINES</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_action: [COMPILED_ABOUT_RECORDS]</p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="px-5 py-2.5 bg-[#E07B39] disabled:bg-[#1A1A2E] text-[#0D0D1A] disabled:text-[#A0A0B0] font-space font-bold text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all amber-glow cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> WRITING_DOCS_STREAM...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> COMMIT_ALL_CHANGES
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs font-mono flex items-center gap-2 text-left animate-fade-in animate-slide-in">
            <Check className="w-4 h-4" />
            <span>Success: Biography documents committed directly to firestore 'about/personal' partition node!</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
            <span className="text-xs font-mono text-[#A0A0B0]">SYS_DECRYPTING_BIO_NODE...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
            
            {/* Main bio details forms panel */}
            <div className="lg:col-span-7 space-y-8">
              {/* Bio Paragraphs section */}
              <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-6 space-y-4">
                <h3 className="font-space font-bold text-lg text-[#F0F0F0] flex items-center gap-2 border-b border-[#2A2A4A]/40 pb-3">
                  <User className="w-5 h-5 text-[#E07B39]" /> Dynamic Bio Paragraphs
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Biography Paragraph 1</label>
                    <textarea
                      rows={5}
                      value={bioPara1}
                      onChange={(e) => setBioPara1(e.target.value)}
                      placeholder="My journey as a cybersecurity engineer start..."
                      className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-3 text-xs text-[#F0F0F0] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Biography Paragraph 2</label>
                    <textarea
                      rows={5}
                      value={bioPara2}
                      onChange={(e) => setBioPara2(e.target.value)}
                      placeholder="Secondary career metrics detailing current aspirations..."
                      className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-3 text-xs text-[#F0F0F0] leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Philosophy configuration */}
              <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-6 space-y-4">
                <h3 className="font-space font-bold text-lg text-[#F0F0F0] flex items-center gap-2 border-b border-[#2A2A4A]/40 pb-3">
                  <BookOpen className="w-5 h-5 text-[#E07B39]" /> Operator Philosophy Block
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-3 space-y-1.5">
                      <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Philosophy Highlight title</label>
                      <input
                        type="text"
                        value={philTitle}
                        onChange={(e) => setPhilTitle(e.target.value)}
                        placeholder="Security as a Blueprint, not a Band-Aid."
                        className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Icon (Emoji)</label>
                      <input
                        type="text"
                        value={philIcon}
                        onChange={(e) => setPhilIcon(e.target.value)}
                        placeholder="🛡️"
                        className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-center text-[#F0F0F0]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Philosophy Description Capsule</label>
                    <textarea
                      rows={3}
                      value={philDescription}
                      onChange={(e) => setPhilDescription(e.target.value)}
                      placeholder="Explain details regarding operational philosophies..."
                      className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-3 text-xs text-[#F0F0F0] leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Timelines / milestones editor (Right column) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-6 space-y-5">
                <h3 className="font-space font-bold text-lg text-[#F0F0F0] flex items-center gap-2 border-b border-[#2A2A4A]/40 pb-3">
                  <CalendarDays className="w-5 h-5 text-[#E07B39]" /> Vertical Timelines Matrix
                </h3>

                {/* Insertion fields */}
                <form onSubmit={handleAddMilestone} className="space-y-3 bg-[#0D0D1A]/50 p-4 border border-[#2A2A4A] rounded-lg text-xs">
                  <span className="text-[10px] font-mono text-[#E07B39] block uppercase font-bold">Add timeline item row</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Year (e.g. 2026)"
                      value={tempMilestone.year}
                      onChange={(e) => setTempMilestone({ ...tempMilestone, year: e.target.value })}
                      className="bg-[#0D0D1A] border border-[#2A2A4A] text-white p-2 text-xs rounded"
                    />
                    
                    <select
                      value={tempMilestone.type}
                      onChange={(e) => setTempMilestone({ ...tempMilestone, type: e.target.value })}
                      className="bg-[#0D0D1A] border border-[#2A2A4A] text-white p-2 text-xs rounded"
                    >
                      <option value="education">education</option>
                      <option value="experience">experience</option>
                      <option value="achievement">achievement</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Milestone title (e.g. CompTIA Security+ Schedule)"
                    value={tempMilestone.title}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, title: e.target.value })}
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] text-white p-2 text-xs rounded"
                  />

                  <input
                    type="text"
                    placeholder="Sub-heading/Authority (e.g. CompTIA)"
                    value={tempMilestone.subtitle}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, subtitle: e.target.value })}
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] text-white p-2 text-xs rounded"
                  />

                  <textarea
                    rows={2}
                    placeholder="Quick description..."
                    value={tempMilestone.description}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, description: e.target.value })}
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] text-white p-2 text-xs rounded"
                  />

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#E07B39]/20 border border-[#E07B39]/40 hover:bg-[#E07B39] hover:text-[#0D0D1A] rounded transition-all font-mono font-bold font-space uppercase text-[10px]"
                  >
                    INSERT_INTO_TIMELINE
                  </button>
                </form>

                {/* Display list of active milestones */}
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1" id="timeline-local-queue">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Active timeline queue ({milestones.length} items)</span>
                  
                  {milestones.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#A0A0B0] font-mono border border-dashed border-[#2A2A4A] rounded">
                      Queue clear. No milestones indexed.
                    </div>
                  ) : (
                    milestones.map((m, idx) => (
                      <div key={idx} className="p-3 bg-[#1A1A2E]/60 border border-[#2A2A4A] rounded-lg flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#E07B39]/10 text-[#E07B39] px-1.5 py-0.5 rounded font-mono font-bold leading-none">{m.year}</span>
                            <span className="text-[9px] font-mono text-gray-500 uppercase">{m.type}</span>
                          </div>
                          <h4 className="font-space font-bold text-[#F0F0F0] text-xs pt-1">{m.title}</h4>
                          <span className="text-[10px] text-[#A0A0B0] block font-mono">{m.subtitle}</span>
                        </div>

                        <button
                          onClick={() => handleRemoveMilestone(idx)}
                          className="p-1 hover:bg-red-500/15 text-gray-500 hover:text-red-400 rounded shrink-0 transition-colors"
                          title="Purge local milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
