import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  db 
} from "../../services/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  ShieldAlert, 
  AlertTriangle 
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form Editor Mode
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Cybersecurity",
    status: "Completed",
    featured: false,
    shortDescription: "",
    techStackRaw: "",
    fullWriteup: "",
    githubUrl: "",
    liveDemoUrl: "",
    reportPdfUrl: "",
    thumbnailUrl: "",
    date: ""
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "projects"));
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(fetched);
    } catch (err: any) {
      console.error("Error reading projects: ", err);
      setError("Failed to fetch projects database: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Automatic Slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: generatedSlug
    }));
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setForm({
      title: "",
      slug: "",
      category: "Cybersecurity",
      status: "Completed",
      featured: false,
      shortDescription: "",
      techStackRaw: "",
      fullWriteup: "",
      githubUrl: "",
      liveDemoUrl: "",
      reportPdfUrl: "",
      thumbnailUrl: "",
      date: new Date().toISOString().slice(0, 7) // e.g. "2026-06"
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (proj: any) => {
    setEditingProject(proj);
    setForm({
      title: proj.title || "",
      slug: proj.slug || "",
      category: proj.category || "Cybersecurity",
      status: proj.status || "Completed",
      featured: proj.featured || false,
      shortDescription: proj.shortDescription || "",
      techStackRaw: (proj.techStack || []).join(", "),
      fullWriteup: proj.fullWriteup || "",
      githubUrl: proj.githubUrl || "",
      liveDemoUrl: proj.liveDemoUrl || "",
      reportPdfUrl: proj.reportPdfUrl || "",
      thumbnailUrl: proj.thumbnailUrl || "",
      date: proj.date || ""
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Verify: Purge this case-file permanently from active logs?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        fetchProjects();
      } catch (err: any) {
        console.error("Purging error: ", err);
        setError("Purging failure on Firestore: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.shortDescription.trim()) {
      setError("Please isolate and confirm core credentials match specifications.");
      return;
    }

    setSaving(true);
    setError("");

    // Prepare tech stack list
    const parsedTechStack = form.techStackRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category,
      status: form.status,
      featured: Boolean(form.featured),
      shortDescription: form.shortDescription.trim(),
      techStack: parsedTechStack,
      fullWriteup: form.fullWriteup.trim(),
      githubUrl: form.githubUrl.trim(),
      liveDemoUrl: form.liveDemoUrl.trim(),
      reportPdfUrl: form.reportPdfUrl.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
      date: form.date.trim()
    };

    try {
      if (editingProject) {
        // Edit existing project
        await setDoc(doc(db, "projects", editingProject.id), {
          ...payload,
          createdAt: editingProject.createdAt || new Date().toISOString()
        });
      } else {
        // Create new project - use custom slug as firestore doc id
        const docId = form.slug.trim() || "project-" + Date.now();
        await setDoc(doc(db, "projects", docId), {
          ...payload,
          createdAt: new Date().toISOString()
        });
      }
      setIsFormOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error("Error writing Project doc: ", err);
      setError("Schema commit failure: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="manage-projects-wrapper">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10" id="manage-projects-main">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Manage Projects</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_action: [COMPILED_PROJECTS_CATALOG]</p>
          </div>

          {!isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#E07B39] text-[#0D0D1A] font-bold text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all amber-glow"
            >
              <Plus className="w-4 h-4" /> ADD_NEW_CASE
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
          /* INPUT / EDIT FORM */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-8 shadow-xl text-left" id="project-form-container">
            <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-4 mb-6">
              <h3 className="font-space font-bold text-lg text-[#F0F0F0]">
                {editingProject ? `Edit Case: ${editingProject.title}` : "Initialize New Case Study"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-[#1A1A2E] text-[#A0A0B0] hover:text-[#F0F0F0] rounded border border-transparent hover:border-[#2A2A4A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Project Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. pfSense Core Firewall Ingestion"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-sans"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Relative URL path Slug</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="pfsense-core-firewall"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-mono"
                  />
                </div>

                {/* Category dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Classification Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Status dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Operational Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  >
                    <option value="Live">Live</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Short description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Short Description Capsule (~150 chars)</label>
                <textarea
                  required
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Summarized cards details listing laboratory highlights..."
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Tech Stack raw text */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Tech stack (comma-separated)</label>
                <input
                  type="text"
                  value={form.techStackRaw}
                  onChange={(e) => setForm({ ...form, techStackRaw: e.target.value })}
                  placeholder="Wazuh, pfSense, Ubuntu, Python, React"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Cover Thumbnail Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Thumbnail Cover Image URL</label>
                  <input
                    type="text"
                    value={form.thumbnailUrl}
                    onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Project Date (e.g. 2026-06)</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="2026-06"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>
              </div>

              {/* Other external URLs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#A0A0B0] uppercase block">GitHub Target URL</label>
                  <input
                    type="text"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#A0A0B0] uppercase block">Live Demo Target URL</label>
                  <input
                    type="text"
                    value={form.liveDemoUrl}
                    onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
                    placeholder="https://demo.domain.com"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#A0A0B0] uppercase block">Analysis PDF Report URL</label>
                  <input
                    type="text"
                    value={form.reportPdfUrl}
                    onChange={(e) => setForm({ ...form, reportPdfUrl: e.target.value })}
                    placeholder="https://verify.domain.com/report.pdf"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>
              </div>

              {/* WYSIWYG Editor equivalent for rich text writeup */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center bg-[#1A1A2E] p-2 rounded-t-lg border border-[#2A2A4A] border-b-0">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase">Analysis Writeup Content (Supports raw HTML)</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono bg-[#E07B39]/10 text-[#E07B39] px-2 py-0.5 rounded leading-none">WYSIWYG</span>
                  </div>
                </div>
                <textarea
                  rows={10}
                  value={form.fullWriteup}
                  onChange={(e) => setForm({ ...form, fullWriteup: e.target.value })}
                  placeholder="<h3>Overview Study</h3>\n<p>Introduce the pfSense test network configuration details...</p>"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none p-4 text-xs text-[#F0F0F0] font-mono rounded-b-lg resize-y"
                  id="rich-editor-textarea"
                />
              </div>

              {/* Featured toggle checklist */}
              <div className="flex items-center gap-3 bg-[#1A1A2E] p-4 rounded-xl border border-[#2A2A4A]/60">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4.5 h-4.5 accent-[#E07B39] border-[#2A2A4A] cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-xs font-mono font-bold text-[#F0F0F0] cursor-pointer select-none">
                  FEATURED_SHOWCASE: Toggle presentation directly on public landing page
                </label>
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
                      <Check className="w-4 h-4" /> COMMIT_CASE_FILE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* PROJECTS DATA TABLE */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl overflow-hidden shadow-xl" id="projects-crud-table-wrapper">
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
                <span className="text-xs font-mono text-[#A0A0B0]">SYS_POPULATING_TABLE...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-20 text-center text-[#A0A0B0] font-mono text-xs max-w-sm mx-auto space-y-3">
                <ShieldAlert className="w-10 h-10 text-[#E07B39]/20 mx-auto" />
                <p>No records located in 'projects' path.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#A0A0B0]">
                  <thead className="bg-[#1A1A2E] text-[10px] font-mono text-[#F0F0F0] uppercase tracking-wider border-b border-[#2A2A4A]">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Featured</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A4A]/30">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#1A1A2E]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-space font-bold text-[#F0F0F0] text-sm leading-snug">{proj.title}</div>
                          <span className="text-[10px] font-mono text-[#E07B39]">slug: /{proj.slug}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-[#0D0D1A] border border-[#2A2A4A]/50 rounded text-[10px] font-mono">{proj.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                            {proj.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {proj.featured ? (
                            <span className="text-green-400">● YES</span>
                          ) : (
                            <span className="text-gray-500">○ NO</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(proj)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-[#E07B39]/10 text-[#A0A0B0] hover:text-[#E07B39] border border-[#2A2A4A] rounded transition-all"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(proj.id)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400 border border-[#2A2A4A] rounded transition-all"
                              title="Purge Record"
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
