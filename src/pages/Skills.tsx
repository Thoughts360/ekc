import { useState, useEffect } from "react";
import { Cpu, Award, Shield, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkillsAndCerts() {
      try {
        const skillsSnap = await getDocs(collection(db, "skills"));
        const skillsData = skillsSnap.docs.map((doc) => doc.data());
        // Sort inline by order
        skillsData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setSkills(skillsData);

        const certsSnap = await getDocs(collection(db, "certifications"));
        const certsData = certsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCertifications(certsData);
      } catch (err) {
        console.error("Error fetching skills/certifications: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkillsAndCerts();
  }, []);

  // Group skills by category field
  const groupedSkills = skills.reduce((acc: { [key: string]: any[] }, curr) => {
    const cat = curr.category || "General";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(curr);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="skills-page-wrapper">
      {/* 1. Header Hero Panel */}
      <section className="relative py-14 bg-[#121224] border-b border-[#2A2A4A] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a15_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative">
          <div className="inline-flex p-3 bg-[#E07B39]/10 rounded-full border border-[#E07B39]/20 mb-1">
            <Cpu className="w-6 h-6 text-[#E07B39]" />
          </div>
          <p className="text-xs font-mono text-[#E07B39] tracking-widest uppercase">sys_index_matrix</p>
          <h1 className="text-4xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Skills &amp; Credentials</h1>
          <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto">
            Audit logs of core technical competencies, programming syntax mastery, and verified security certificates.
          </p>
          <div className="w-16 h-1 bg-[#E07B39] rounded mx-auto mt-2" />
        </div>
      </section>

      {/* 2. Skills Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-2" />
            <span className="text-xs font-mono text-[#A0A0B0]">SYS_COMPILING_SKILLS_MAP...</span>
          </div>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center text-[#A0A0B0] font-mono py-12">No skill objects mapped in database.</div>
        ) : (
          <div className="space-y-12" id="grouped-skills-container">
            <div className="space-y-2 border-b border-[#2A2A4A]/40 pb-4">
              <span className="text-xs font-mono text-[#E07B39] uppercase tracking-wider">Classification catalog</span>
              <h2 className="text-2xl font-bold font-space text-[#F0F0F0] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#E07B39]" /> Engineering Proficiencies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="skills-category-bento">
              {Object.keys(groupedSkills).map((categoryName) => (
                <div
                  key={categoryName}
                  className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl space-y-6 hover:border-[#E07B39]/30 transition-all"
                >
                  <h3 className="font-space font-bold text-[#F0F0F0] text-lg border-b border-[#2A2A4A]/50 pb-2">
                    {categoryName}
                  </h3>

                  <div className="space-y-4">
                    {groupedSkills[categoryName].map((skill, index) => (
                      <div key={index} className="space-y-2" id={`skill-item-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#F0F0F0] font-semibold flex items-center gap-1.5 font-space text-sm">
                            <span className="text-base">{skill.icon || "🛡️"}</span>
                            {skill.name}
                          </span>
                          <span className="text-[#E07B39]">{skill.proficiency}%</span>
                        </div>
                        
                        {/* Custom Percentage bar */}
                        <div className="w-full bg-[#0D0D1A] h-2 rounded border border-[#2A2A4A]/60 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#E07B39] to-[#F1B382] h-full rounded transition-all duration-1000"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Certifications Grid */}
        <div className="space-y-10 pt-8" id="profile-certifications">
          <div className="space-y-2 border-b border-[#2A2A4A]/40 pb-4">
            <span className="text-xs font-mono text-[#E07B39] uppercase tracking-wider">Authentication signatures</span>
            <h2 className="text-2xl font-bold font-space text-[#F0F0F0] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E07B39]" /> Verified Certifications
            </h2>
          </div>

          {loading ? (
            <div className="h-40 bg-[#1A1A2E] rounded-xl animate-pulse" />
          ) : certifications.length === 0 ? (
            <div className="text-xs text-[#A0A0B0] font-mono">No certification items currently logged.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="certifications-list">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-[#E07B39]/30 transition-all group"
                >
                  {/* Badge Covering Photo */}
                  <div className="w-16 h-16 rounded-lg bg-[#0D0D1A] border border-[#2A2A4A] flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={cert.badgeUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80"}
                      alt={cert.name}
                      className="w-full h-full object-cover p-1 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Cert text descriptors */}
                  <div className="flex-1 space-y-1.5 text-left">
                    <h3 className="font-space font-bold text-sm sm:text-base text-[#F0F0F0]">
                      {cert.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#A0A0B0]">
                      <span className="text-[#E07B39]">{cert.issuer}</span>
                      <span className="text-[#2A2A4A]">•</span>
                      <span>Earned: {cert.dateEarned}</span>
                    </div>
                  </div>

                  {/* Action verification */}
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D0D1A] border border-[#2A2A4A] text-[11px] font-mono text-[#A0A0B0] hover:text-[#E07B39] hover:border-[#E07B39]/50 rounded transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E07B39]" />
                      VERIFY <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
