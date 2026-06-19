import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { 
  BookOpen, 
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

export default function ManageBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form mode toggles
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state parameters
  const [form, setForm] = useState({
    title: "",
    slug: "",
    tagsRaw: "",
    excerpt: "",
    readTime: "5 min read",
    published: true,
    content: "",
    date: ""
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "blogPosts"));
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(fetched);
    } catch (err: any) {
      console.error("Error reading blogs: ", err);
      setError("Failed to fetch blog post database indices: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Auto Generate Slugs
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
    setEditingPost(null);
    setForm({
      title: "",
      slug: "",
      tagsRaw: "",
      excerpt: "",
      readTime: "5 min read",
      published: true,
      content: "",
      date: new Date().toISOString().slice(0, 10) // e.g., "2026-06-19"
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      tagsRaw: (post.tags || []).join(", "),
      excerpt: post.excerpt || "",
      readTime: post.readTime || "5 min read",
      published: post.published ?? true,
      content: post.content || "",
      date: post.date || ""
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Verify: Purge this incident-log permanently from active indexes?")) {
      try {
        await deleteDoc(doc(db, "blogPosts", id));
        fetchBlogs();
      } catch (err: any) {
        console.error("Purging error: ", err);
        setError("Purging failure on Firestore: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Verify: Ensure core inputs are populated prior to database commits.");
      return;
    }

    setSaving(true);
    setError("");

    const parsedTags = form.tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      tags: parsedTags,
      excerpt: form.excerpt.trim(),
      readTime: form.readTime.trim(),
      published: Boolean(form.published),
      content: form.content.trim(),
      date: form.date.trim()
    };

    try {
      if (editingPost) {
        await setDoc(doc(db, "blogPosts", editingPost.id), {
          ...payload,
          createdAt: editingPost.createdAt || new Date().toISOString()
        });
      } else {
        const docId = form.slug.trim() || "post-" + Date.now();
        await setDoc(doc(db, "blogPosts", docId), {
          ...payload,
          createdAt: new Date().toISOString()
        });
      }
      setIsFormOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error("Error writing blog post doc: ", err);
      setError("Blog catalog sync failure: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="manage-blog-wrapper">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10" id="manage-blogs-main">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Manage Blog Posts</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_action: [COMPILED_LOGS_DB_INDICES]</p>
          </div>

          {!isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#E07B39] text-[#0D0D1A] font-bold text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all amber-glow"
            >
              <Plus className="w-4 h-4" /> WRITE_NEW_LOG
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
          /* FORM EDITOR */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-8 shadow-xl text-left" id="blog-form-container">
            <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-4 mb-6">
              <h3 className="font-space font-bold text-lg text-[#F0F0F0]">
                {editingPost ? `Edit Log: ${editingPost.title}` : "Compile Incident Analysis Entry"}
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
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Write-up Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="SSH auth log intrusion diagnostic study"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-sans"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">URL slug name</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="ssh-auth-log-diagnostic"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-mono"
                  />
                </div>

                {/* Tags Raw */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Incident Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tagsRaw}
                    onChange={(e) => setForm({ ...form, tagsRaw: e.target.value })}
                    placeholder="CTF Write-ups, Lab Reports, Tutorials"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>

                {/* Read time */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Estimate read time metrics</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                  />
                </div>
              </div>

              {/* Date write */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Incident log Date (e.g. 2026-06-19)</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="2026-06-19"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0] font-mono"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase tracking-wider block">Excerpt preview text (Max 1000 chars)</label>
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Summarize the core security challenge, IDS triggers, or shell tools explored in the incident case study..."
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Writeup raw editor content block */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center bg-[#1A1A2E] p-2 rounded-t-lg border border-[#2A2A4A] border-b-0">
                  <span className="text-[10px] font-mono text-[#A0A0B0] uppercase">Write-up content markup (Supports raw HTML)</span>
                  <span className="text-[10px] font-mono bg-[#E07B39]/10 text-[#E07B39] px-2 py-0.5 rounded leading-none">WYSIWYG</span>
                </div>
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="<h3>Case overview</h3>\n<p>Describe diagnostic steps...</p>\n<pre><code class='language-bash'>nmap -A yz-host</code></pre>"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none p-4 text-xs text-[#F0F0F0] font-mono rounded-b-lg resize-y animate-fade-in"
                />
              </div>

              {/* Published Toggle checks */}
              <div className="flex items-center gap-3 bg-[#1A1A2E] p-4 rounded-xl border border-[#2A2A4A]/60">
                <input
                  type="checkbox"
                  id="published-toggle"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4.5 h-4.5 accent-[#E07B39] border-[#2A2A4A] cursor-pointer"
                />
                <label htmlFor="published-toggle" className="text-xs font-mono font-bold text-[#F0F0F0] cursor-pointer select-none">
                  PUBLISH_INDEX_GATE: Make post publicly discoverable in public directories
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A4A]/50">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-[#1A1A2E] text-xs font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded-lg"
                >
                  ABORT_LOG
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#E07B39] disabled:bg-[#1A1A2E] text-[#0D0D1A] disabled:text-[#A0A0B0] font-space font-bold text-xs font-mono rounded-lg flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> COMMITTING_STREAM...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> COMMIT_INCIDENT_LOG
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* REGULAR DATA TABLE LISTING */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl overflow-hidden shadow-xl" id="blogs-crud-table-wrapper">
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
                <span className="text-xs font-mono text-[#A0A0B0]">SYS_QUERYING_LOGS...</span>
              </div>
            ) : blogs.length === 0 ? (
              <div className="py-20 text-center text-[#A0A0B0] font-mono text-xs max-w-sm mx-auto space-y-3">
                <ShieldAlert className="w-10 h-10 text-[#E07B39]/20 mx-auto" />
                <p>No operational writeups are cataloged in this partition.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#A0A0B0]">
                  <thead className="bg-[#1A1A2E] text-[10px] font-mono text-[#F0F0F0] uppercase tracking-wider border-b border-[#2A2A4A]">
                    <tr>
                      <th className="px-6 py-4">Title / Description</th>
                      <th className="px-6 py-4">Read Time</th>
                      <th className="px-6 py-4">Date Logged</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A4A]/30">
                    {blogs.map((post) => (
                      <tr key={post.id} className="hover:bg-[#1A1A2E]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-space font-bold text-[#F0F0F0] text-sm leading-snug">{post.title}</div>
                          <span className="text-[10px] font-mono text-[#E07B39]">slug: /{post.slug}</span>
                        </td>
                        <td className="px-6 py-4 font-mono">{post.readTime || "5 min read"}</td>
                        <td className="px-6 py-4 font-mono">{post.date || "2026-06-19"}</td>
                        <td className="px-6 py-4 font-mono">
                          {post.published ? (
                            <span className="text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded uppercase leading-none text-[10px]">
                              PUBLISHED
                            </span>
                          ) : (
                            <span className="text-gray-500 font-semibold bg-gray-500/10 border border-gray-500/20 px-2 py-0.5 rounded uppercase leading-none text-[10px]">
                              DRAFT_STAGE
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(post)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-[#E07B39]/10 text-[#A0A0B0] hover:text-[#E07B39] border border-[#2A2A4A] rounded transition-all"
                              title="Edit Log"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400 border border-[#2A2A4A] rounded transition-all"
                              title="Purge Log"
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
