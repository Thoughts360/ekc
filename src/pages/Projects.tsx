import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FolderGit2, FolderOpen, ArrowRight, Layers, SlidersHorizontal } from "lucide-react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Cybersecurity", "Web Dev", "Tools", "Other"];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const snap = await getDocs(collection(db, "projects"));
        const fetched = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by date or newly added
        fetched.sort((a: any, b: any) => {
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        });
        setProjects(fetched);
        setFilteredProjects(fetched);
      } catch (err) {
        console.error("Error loading projects collection: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter project instances
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (proj) => proj.category?.toLowerCase() === activeCategory.toLowerCase()
      );
      setFilteredProjects(filtered);
    }
  }, [activeCategory, projects]);

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="projects-gallery-wrapper">
      {/* 1. Header Hero Panel */}
      <section className="relative py-14 bg-[#121224] border-b border-[#2A2A4A] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a15_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative">
          <div className="inline-flex p-3 bg-[#E07B39]/10 rounded-full border border-[#E07B39]/20 mb-1">
            <FolderOpen className="w-6 h-6 text-[#E07B39]" />
          </div>
          <p className="text-xs font-mono text-[#E07B39] tracking-widest uppercase">sys_index_laboratory</p>
          <h1 className="text-4xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Active Case Files</h1>
          <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto">
            Practical labs, forensic script repositories, and security architecture diagrams configured in sandbox networks.
          </p>
          <div className="w-16 h-1 bg-[#E07B39] rounded mx-auto mt-2" />
        </div>
      </section>

      {/* 2. Controls and Filters */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#2A2A4A]/35" id="projects-tab-panel">
          {/* Categories list as tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-mono rounded-lg transition-all border ${
                  activeCategory === cat
                    ? "bg-[#E07B39] text-[#0D0D1A] font-bold border-[#E07B39] shadow-md shadow-[#E07B39]/10"
                    : "bg-[#1A1A2E] text-[#A0A0B0] border-[#2A2A4A] hover:text-[#F0F0F0] hover:border-[#E07B39]/45"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#A0A0B0] text-xs font-mono self-start md:self-center bg-[#1A1A2E]/50 px-3 py-1.5 rounded border border-[#2A2A4A]/60">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E07B39]" />
            <span>CAT_METRICS: [{filteredProjects.length} AVAILABLE]</span>
          </div>
        </div>

        {/* 3. Projects Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-[#1A1A2E] rounded-xl border border-[#2A2A4A] animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[#2A2A4A] rounded-xl flex flex-col items-center justify-center max-w-md mx-auto space-y-4" id="projects-empty-display">
            <FolderGit2 className="w-12 h-12 text-[#E07B39]/20" />
            <h3 className="font-space font-bold text-lg text-[#F0F0F0]">Empty Project Store</h3>
            <p className="text-xs text-[#A0A0B0] leading-relaxed max-w-xs">
              No laboratory records currently fit category: "{activeCategory}". Select a separate category selector tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid-list">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#1A1A2E] rounded-xl border border-[#2A2A4A] overflow-hidden flex flex-col hover:border-[#E07B39]/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0d0d1a]/50 group"
              >
                {/* Visual Thumbnail */}
                <div className="h-44 overflow-hidden relative border-b border-[#2A2A4A]">
                  <img
                    src={project.thumbnailUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#E07B39] text-[#0D0D1A] font-mono text-[10px] font-bold rounded">
                    {project.status || "Completed"}
                  </div>
                </div>

                {/* Info Text Elements */}
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#E07B39] uppercase tracking-widest">{project.category}</span>
                    <h3 className="font-space font-bold text-lg text-[#F0F0F0] line-clamp-1 group-hover:text-[#E07B39] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#A0A0B0] line-clamp-2 leading-relaxed font-sans">
                    {project.shortDescription}
                  </p>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-1 pt-1.5 pb-2">
                    {project.techStack?.map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-[#0D0D1A] text-[9px] font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 mt-auto border-t border-[#2A2A4A]/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#A0A0B0]">{project.date || "2026-06"}</span>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#E07B39] font-mono font-medium hover:underline"
                    >
                      READ_WRITEUP <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
