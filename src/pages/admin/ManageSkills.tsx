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
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Cpu, 
  AlertTriangle, 
  Sliders 
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Editor states
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form parameters state
  const [form, setForm] = useState({
    name: "",
    category: "Security Tools",
    icon: "🛡️",
    proficiency: 80,
    order: 1
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "skills"));
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
      // Sort in-memory by sorting offset
      fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSkills(fetched);
    } catch (err: any) {
      console.error("Error fetching skills catalog: ", err);
      setError("Failed to query skills database partitions: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setForm({
      name: "",
      category: "Security Tools",
      icon: "🛡️",
      proficiency: 80,
      order: skills.length + 1
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (skill: any) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name || "",
      category: skill.category || "Security Tools",
      icon: skill.icon || "🛡️",
      proficiency: skill.proficiency || 80,
      order: skill.order || 1
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Verify: Purge this skill signature from databases?")) {
      try {
        await deleteDoc(doc(db, "skills", id));
        fetchSkills();
      } catch (err: any) {
        console.error("Deletion error on skill: ", err);
        setError("Purging failure on Firestore: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      setError("Verify: Ensure name and classification headers are populated.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      icon: form.icon.trim(),
      proficiency: Number(form.proficiency),
      order: Number(form.order)
    };

    try {
      // Use lower cased identifier as document ID to enforce integrity
      const docId = editingSkill ? editingSkill.id : form.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      await setDoc(doc(db, "skills", docId), payload);
      setIsFormOpen(false);
      fetchSkills();
    } catch (err: any) {
      console.error("Skill write error: ", err);
      setError("Database schema commit failure: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="manage-skills-wrapper">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10" id="manage-skills-main">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Manage Skills</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_action: [COMPILED_SKILLS_GRID]</p>
          </div>

          {!isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#E07B39] text-[#0D0D1A] font-bold text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all amber-glow"
            >
              <Plus className="w-4 h-4" /> ADD_NEW_SKILL
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {isFormOpen ? (
          /* FORM EDITOR PANEL */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-8 max-w-xl mx-auto text-left" id="skill-form-container">
            <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-4 mb-6">
              <h3 className="font-space font-bold text-lg text-[#F0F0F0]">
                {editingSkill ? `Edit Skill: ${editingSkill.name}` : "Log New Competency Element"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-[#1A1A2E] text-[#A0A0B0] hover:text-[#F0F0F0] rounded border border-transparent hover:border-[#2A2A4A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Skill Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Wireshark PCAP forensics"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Classification Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                >
                  <option value="Security Tools">Security Tools</option>
                  <option value="Programming">Programming</option>
                  <option value="Cloud/Infra">Cloud/Infra</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Icon emoji */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Icon Display (Emoji/Char)</label>
                  <input
                    type="text"
                    required
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🛡️"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-center text-[#F0F0F0]"
                  />
                </div>

                {/* Sorter order offset identifier */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Sort Index order (Offset weight)</label>
                  <input
                    type="number"
                    required
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    placeholder="1"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-mono"
                  />
                </div>
              </div>

              {/* Slider for Proficiency value */}
              <div className="space-y-2 pt-2 bg-[#0D0D1A] p-4 rounded-lg border border-[#2A2A4A]/50">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#A0A0B0] flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-[#E07B39]" /> Proficiency offset:</span>
                  <span className="text-[#E07B39] font-bold">{form.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#16213E] rounded-lg appearance-none cursor-pointer accent-[#E07B39]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A4A]/50">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-[#1A1A2E] text-xs font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded-lg"
                >
                  ABORT_WRITE
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#E07B39] disabled:bg-[#1A1A2E] text-[#0D0D1A] disabled:text-[#A0A0B0] font-space font-bold text-xs font-mono rounded-lg flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> COMMITTING_RAW...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> COMMIT_SKILL
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* REGULAR DATA GRID TABULAR LIST */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl overflow-hidden shadow-xl" id="skills-crud-table-wrapper">
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
                <span className="text-xs font-mono text-[#A0A0B0]">SYS_POPULATING_TABLE...</span>
              </div>
            ) : skills.length === 0 ? (
              <div className="py-20 text-center text-[#A0A0B0] font-mono text-xs max-w-sm mx-auto space-y-3">
                <Cpu className="w-10 h-10 text-[#E07B39]/20 mx-auto" />
                <p>No logged engineering skills detected.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#A0A0B0]">
                  <thead className="bg-[#1A1A2E] text-[10px] font-mono text-[#F0F0F0] uppercase tracking-wider border-b border-[#2A2A4A]">
                    <tr>
                      <th className="px-6 py-4">Sort</th>
                      <th className="px-6 py-4">Icon</th>
                      <th className="px-6 py-4">Skill Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Proficiency Offset</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A4A]/30">
                    {skills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-[#1A1A2E]/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-[#E07B39]">#{skill.order || 0}</td>
                        <td className="px-6 py-4 text-sm font-bold">{skill.icon || "🛡️"}</td>
                        <td className="px-6 py-4 font-space font-bold text-[#F0F0F0] text-sm">{skill.name}</td>
                        <td className="px-6 py-4 font-mono">{skill.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-[#A0A0B0] w-8">{skill.proficiency}%</span>
                            <div className="w-24 bg-[#0D0D1A] h-1.5 rounded border border-[#2A2A4A]/50 overflow-hidden shrink-0">
                              <div className="bg-[#E07B39] h-full" style={{ width: `${skill.proficiency}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(skill)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-[#E07B39]/10 text-[#A0A0B0] hover:text-[#E07B39] border border-[#2A2A4A] rounded transition-all"
                              title="Edit Skill"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400 border border-[#2A2A4A] rounded transition-all"
                              title="Purge Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
