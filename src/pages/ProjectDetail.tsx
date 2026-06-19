import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Activity, 
  Tag,
  ShieldCheck,
  Compass
} from "lucide-react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const q = query(collection(db, "projects"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProject({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Error fetching single project: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex flex-col justify-center items-center py-24 text-center">
        <Activity className="w-8 h-8 text-[#E07B39] animate-spin mb-4" />
        <p className="text-xs font-mono text-[#A0A0B0] animate-pulse">SYS_SEC_DECRYPTING_WRITEUP...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] py-24 text-center px-4 space-y-4">
        <ShieldCheck className="w-16 h-16 text-red-500 mx-auto opacity-50" />
        <h2 className="text-2xl font-bold font-space text-[#F0F0F0]">Case File Sealed or Absent</h2>
        <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto leading-relaxed">
          The requested project record could not be extracted from active logs. Check path integrity or contact the admin.
        </p>
        <div className="pt-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-xs font-mono text-[#E07B39] border border-[#2A2A4A] rounded-lg hover:border-[#E07B39]/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> BACK_TO_CASE_FILES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="project-detail-wrapper">
      {/* 1. Header Banner */}
      <section className="relative py-16 bg-[#121224] border-b border-[#2A2A4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-[#E07B39] font-mono hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> BROWSE_PROJECTS_DIR
          </Link>
          
          <div className="space-y-1 text-left">
            <span className="text-xs font-mono text-[#E07B39] tracking-widest uppercase">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F0F0] font-space tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12" id="project-casefile-pane">
        
        {/* Writeup Body (Left) */}
        <div className="lg:col-span-8 space-y-8 text-sm text-[#A0A0B0] leading-relaxed">
          
          {/* Cover photo if exists */}
          {project.thumbnailUrl && (
            <div className="rounded-xl overflow-hidden border border-[#2A2A4A] h-80 sm:h-96 relative">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/80 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Core Text Body Injecting Raw HTML from wysiwyg */}
          <div className="p-8 bg-[#121224] border border-[#2A2A4A]/60 rounded-xl space-y-6">
            <div 
              className="prose prose-invert max-w-none 
                prose-headings:font-space prose-headings:text-[#F0F0F0] prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:mb-4
                prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2 prose-ul:mb-4
                prose-code:font-mono prose-code:text-[#E07B39] prose-code:bg-[#0D0D1A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              "
              dangerouslySetInnerHTML={{ __html: project.fullWriteup }}
            />
          </div>
        </div>

        {/* Sidebar Info (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Metrics */}
          <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl space-y-5">
            <h3 className="font-space font-bold text-[#F0F0F0] text-sm border-b border-[#2A2A4A] pb-3 mb-1">
              METADATA_HEADER
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center bg-[#0D0D1A] p-2.5 rounded border border-[#2A2A4A]/40">
                <span className="text-[#A0A0B0] flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#E07B39]" /> DATE:</span>
                <span className="text-[#F0F0F0]">{project.date || "2026-06"}</span>
              </div>

              <div className="flex justify-between items-center bg-[#0D0D1A] p-2.5 rounded border border-[#2A2A4A]/40">
                <span className="text-[#A0A0B0] flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-[#E07B39]" /> STATUS:</span>
                <span className="bg-[#E07B39]/10 text-[#E07B39] font-bold px-2 py-0.5 rounded leading-none border border-[#E07B39]/20">
                  {project.status || "Completed"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#0D0D1A] p-2.5 rounded border border-[#2A2A4A]/40">
                <span className="text-[#A0A0B0] flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-[#E07B39]" /> CATEGORY:</span>
                <span className="text-[#F0F0F0] font-sans text-[11px] bg-[#16213E] px-2 py-1 rounded border border-[#2A2A4A]/50">{project.category}</span>
              </div>
            </div>

            {/* Tech stack badge block */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-[#A0A0B0] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#E07B39]" /> ENTIRE_STACK:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack?.map((tech: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-[#0D0D1A] text-[10px] font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Links */}
          <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl space-y-4">
            <h3 className="font-space font-bold text-[#F0F0F0] text-sm">
              ACTION_VECTORS
            </h3>

            <div className="flex flex-col gap-2 font-mono text-xs">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#121224] hover:bg-[#E07B39]/15 text-[#F0F0F0] hover:text-[#E07B39] border border-[#2A2A4A] rounded-lg text-center flex items-center justify-center gap-2 transition-all hover:border-[#E07B39]/40"
                >
                  <Github className="w-4 h-4" /> CLONE_GIT_REPOSITORY
                </a>
              ) : (
                <span className="text-center text-[#A0A0B0] bg-[#121224] p-3 rounded-lg border border-[#2A2A4A]/40 select-none">
                  Repository restricted
                </span>
              )}

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#E07B39] text-[#0D0D1A] font-bold rounded-lg text-center flex items-center justify-center gap-2 transition-all hover:bg-[#E07B39]/90 "
                >
                  <ExternalLink className="w-4 h-4" /> VERIFY_LIVE_HOST
                </a>
              )}

              {project.reportPdfUrl && (
                <a
                  href={project.reportPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#121224] border border-[#2A2A4A] hover:border-[#E07B39] text-[#A0A0B0] hover:text-[#E07B39] rounded-lg text-center flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4" /> PARSE_SUMMARY_PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
