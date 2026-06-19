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
  Award, 
  AlertTriangle, 
  ExternalLink 
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageCertifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    dateEarned: "",
    badgeUrl: "",
    verifyUrl: ""
  });

  useEffect(() => {
    fetchCerts();
  }, []);

  async function fetchCerts() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "certifications"));
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCerts(fetched);
    } catch (err: any) {
      console.error("Error reading certifications: ", err);
      setError("Failed to fetch certifications database logs: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingCert(null);
    setForm({
      name: "",
      issuer: "",
      dateEarned: new Date().toISOString().slice(0, 7),
      badgeUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80",
      verifyUrl: ""
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cert: any) => {
    setEditingCert(cert);
    setForm({
      name: cert.name || "",
      issuer: cert.issuer || "",
      dateEarned: cert.dateEarned || "",
      badgeUrl: cert.badgeUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80",
      verifyUrl: cert.verifyUrl || ""
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Verify: Purge this licensing milestone from databases?")) {
      try {
        await deleteDoc(doc(db, "certifications", id));
        fetchCerts();
      } catch (err: any) {
        console.error("Deletion error on cert: ", err);
        setError("Purging failure on Firestore: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.issuer.trim()) {
      setError("Verify: Ensure certification name and authority header are populated.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      issuer: form.issuer.trim(),
      dateEarned: form.dateEarned.trim(),
      badgeUrl: form.badgeUrl.trim(),
      verifyUrl: form.verifyUrl.trim()
    };

    try {
      const docId = editingCert ? editingCert.id : form.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      await setDoc(doc(db, "certifications", docId), payload);
      setIsFormOpen(false);
      fetchCerts();
    } catch (err: any) {
      console.error("Certification write error: ", err);
      setError("Database schema commit failure: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col md:flex-row" id="manage-certs-wrapper">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10" id="manage-certs-main">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2A2A4A] pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Manage Certifications</h1>
            <p className="text-xs font-mono text-[#A0A0B0]">sys_action: [COMPILED_CREDENTIALS_LIST]</p>
          </div>

          {!isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#E07B39] text-[#0D0D1A] font-bold text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all amber-glow"
            >
              <Plus className="w-4 h-4" /> ADD_NEW_CERT
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
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl p-8 max-w-xl mx-auto text-left" id="cert-form-container">
            <div className="flex justify-between items-center border-b border-[#2A2A4A]/50 pb-4 mb-6">
              <h3 className="font-space font-bold text-lg text-[#F0F0F0]">
                {editingCert ? `Edit Cert: ${editingCert?.name}` : "Log New Certification Badge"}
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
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Name of Certification</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="CompTIA Security+ SYO-701"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Issuer */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Authority Issuer</label>
                <input
                  type="text"
                  required
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  placeholder="CompTIA Association"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Date Earned */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Date Earned (Month/Year or 'Scheduled...')</label>
                <input
                  type="text"
                  required
                  value={form.dateEarned}
                  onChange={(e) => setForm({ ...form, dateEarned: e.target.value })}
                  placeholder="Scheduled Sep 2026"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Badge URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Badge Image cover URL</label>
                <input
                  type="text"
                  required
                  value={form.badgeUrl}
                  onChange={(e) => setForm({ ...form, badgeUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
              </div>

              {/* Verify Link */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#A0A0B0] uppercase block">Verification verification Target URL (Optional)</label>
                <input
                  type="text"
                  value={form.verifyUrl}
                  onChange={(e) => setForm({ ...form, verifyUrl: e.target.value })}
                  placeholder="https://verify.com/credential/..."
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] focus:border-[#E07B39] outline-none rounded-lg p-2.5 text-xs text-[#F0F0F0]"
                />
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
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> COMMITTING_RAW...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> COMMIT_CERTIFICATE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* REGULAR TABULAR LISTING */
          <div className="bg-[#121224] border border-[#2A2A4A] rounded-xl overflow-hidden shadow-xl" id="certs-crud-table-wrapper">
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
                <span className="text-xs font-mono text-[#A0A0B0]">SYS_POPULATING_TABLE...</span>
              </div>
            ) : certs.length === 0 ? (
              <div className="py-20 text-center text-[#A0A0B0] font-mono text-xs max-w-sm mx-auto space-y-3">
                <Award className="w-10 h-10 text-[#E07B39]/20 mx-auto" />
                <p>No verified certifications cataloged in the matrix partitions.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#A0A0B0]">
                  <thead className="bg-[#1A1A2E] text-[10px] font-mono text-[#F0F0F0] uppercase tracking-wider border-b border-[#2A2A4A]">
                    <tr>
                      <th className="px-6 py-4">Badge</th>
                      <th className="px-6 py-4">Credential Name</th>
                      <th className="px-6 py-4">Authority Issuer</th>
                      <th className="px-6 py-4">Date Earned</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A4A]/30">
                    {certs.map((cert) => (
                      <tr key={cert.id} className="hover:bg-[#1A1A2E]/50 transition-colors">
                        <td className="px-6 py-4 font-mono">
                          <img
                            src={cert.badgeUrl}
                            alt={cert.name}
                            className="w-10 h-10 rounded border border-[#2A2A4A]/60 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-space font-bold text-[#F0F0F0] text-sm leading-snug">{cert.name}</div>
                          {cert.verifyUrl && (
                            <a
                              href={cert.verifyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#E07B39] hover:underline mt-0.5"
                            >
                              VERIFICATION_LINK <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#F0F0F0]">{cert.issuer}</td>
                        <td className="px-6 py-4 font-mono">{cert.dateEarned}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(cert)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-[#E07B39]/10 text-[#A0A0B0] hover:text-[#E07B39] border border-[#2A2A4A] rounded transition-all"
                              title="Edit Cert"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(cert.id)}
                              className="p-1.5 bg-[#1A1A2E] hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400 border border-[#2A2A4A] rounded transition-all"
                              title="Purge Cert"
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
