import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Terminal, 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  BookOpen, 
  ArrowUpRight,
  UserCheck,
  Zap,
  Network
} from "lucide-react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";

export default function Home() {
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const roles = [
    "Cybersecurity Student",
    "SOC Analyst in Training",
    "Security Tools Script Developer",
    "Linux Systems Administrator"
  ];

  // Typewriter effect
  useEffect(() => {
    let timer: any;
    const currentFullStr = roles[roleIndex];
    if (isDeleting) {
      timer = setTimeout(() => {
        setRoleText(currentFullStr.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setRoleText(currentFullStr.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentFullStr.length) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  // Terminal Logs simulation
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    const rawOutputs = [
      "sys_init: Loading kernel modules...",
      "security_monitor: SIEM Collector active (pfSense-syslog)",
      "kali@ekc-sec:~$ nmap -sS -p 22,80,443 yz-onion.lan",
      "Scanning yz-onion.lan (192.168.10.4)...",
      "PORT    STATE  SERVICE",
      "22/tcp  open   ssh",
      "80/tcp  open   http",
      "443/tcp open   https",
      "Wazuh_Agent[120]: Heartbeat ESTABLISHED",
      "INTEGRITY_CHECK: Passed (SHA256 checksum OK)",
      "sys_alert: Failed SSH admin login from 104.22.4.99 (PORT-22)",
      "AUTOMATED_KILL_TRIGGER: Blocking source IP rule injected",
      "kali@ekc-sec:~$ wireshark-cli -i eth0 -c 5",
      "Capturing on 'eth0' [TCP Flag Sync/Ack matches!]"
    ];

    let count = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev, rawOutputs[count % rawOutputs.length]];
        if (next.length > 7) {
          next.shift();
        }
        return next;
      });
      count++;
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Fetch featured projects
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Query projects
        const projQuery = query(collection(db, "projects"), where("featured", "==", true), limit(3));
        const projSnap = await getDocs(projQuery);
        const fetchedProjects = projSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeaturedProjects(fetchedProjects);

        // Query blogs (published sorted by date)
        const blogQuery = query(collection(db, "blogPosts"), where("published", "==", true), limit(3));
        const blogSnap = await getDocs(blogQuery);
        const fetchedBlogs = blogSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLatestBlogs(fetchedBlogs);

        // Fetch skills
        const skillsSnap = await getDocs(collection(db, "skills"));
        const fetchedSkills = skillsSnap.docs.map((doc) => doc.data());
        // Sort inline by order
        fetchedSkills.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setSkills(fetchedSkills.slice(0, 8)); // Top 8 skills
      } catch (err) {
        console.error("Error loading home collections", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDownloadCV = () => {
    alert("Elvis - CV download trigger. In production, this targets the CV PDF asset file.");
  };

  return (
    <div className="flex flex-col min-h-screen" id="home-page-container">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-[#2A2A4A] bg-gradient-to-b from-[#0D0D1A] to-[#0A0A14]">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a20_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Bio Left */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E07B39]/10 text-[#E07B39] border border-[#E07B39]/20 rounded-full text-xs font-mono w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B39] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07B39]"></span>
              </span>
              SECURE WORKSTATION ACTIVE
            </div>

            <div className="space-y-2">
              <span className="text-sm font-mono text-[#A0A0B0] tracking-wider uppercase">Hello, I am</span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F0F0F0] font-space tracking-tight">
                Elvis Kangwa <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07B39] to-[#F1B382]">
                  Chanda
                </span>
              </h1>
            </div>

            {/* Role typewriter pane */}
            <div className="h-8 flex items-center">
              <p className="text-[#A0A0B0] text-lg sm:text-xl font-mono flex items-center">
                <span className="text-[#E07B39] mr-2">&gt;</span>
                <span>{roleText}</span>
                <span className="w-1.5 h-5 bg-[#E07B39] ml-1.5 animate-pulse shrink-0"></span>
              </p>
            </div>

            <p className="text-sm text-[#A0A0B0] max-w-lg leading-relaxed font-sans">
              Cybersecurity generalist specializing in threat identification, SOC alert auditing, active decoders configuration, and Python defense scripts. Based out of Lusaka, Zambia.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/projects"
                className="px-6 py-3 bg-[#E07B39] text-[#0D0D1A] font-space font-bold rounded-lg transition-all hover:bg-[#E07B39]/90 border border-[#E07B39] amber-glow"
              >
                View Projects
              </Link>
              <button
                onClick={handleDownloadCV}
                className="px-6 py-3 border border-[#2A2A4A] text-[#F0F0F0] hover:text-[#E07B39] hover:bg-[#1A1A2E] hover:border-[#E07B39]/50 font-space font-bold rounded-lg transition-all"
              >
                Download CV
              </button>
            </div>
          </div>

          {/* Hero Monitor Simulation Right */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#121224] rounded-xl border border-[#2A2A4A] overflow-hidden shadow-2xl shadow-[#000]/60">
              {/* Terminal Title Bar */}
              <div className="bg-[#1A1A2E] px-4 py-3 border-b border-[#2A2A4A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-[#A0A0B0] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#E07B39]" />
                  sys_threat_matrix.sh
                </span>
                <div className="w-4" />
              </div>

              {/* Terminal Screen Body */}
              <div className="p-5 font-mono text-xs space-y-3 min-h-[220px] bg-[#0A0A15]/95">
                <div className="text-green-400">&gt; bash initial_system_check.sh</div>
                {logs.length === 0 ? (
                  <div className="text-[#A0A0B0] animate-pulse">Initializing telemetry pipeline...</div>
                ) : (
                  logs.map((log, i) => {
                    let colorClass = "text-[#A0A0B0]";
                    if (log.startsWith("sys_alert") || log.startsWith("AUTOMATED")) colorClass = "text-red-400";
                    if (log.startsWith("kali@")) colorClass = "text-[#E07B39]";
                    if (log.includes("Passed") || log.includes("ESTABLISHED")) colorClass = "text-green-400";
                    return (
                      <div key={i} className={`flex ${colorClass} leading-5 last:font-bold border-l border-transparent hover:border-[#E07B39]/30 hover:pl-1 transition-all`}>
                        <span className="text-[#E07B39]/50 mr-2 select-none">[{new Date().toLocaleTimeString().slice(0, 8)}]</span>
                        <span>{log}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Short About Preview */}
      <section className="py-20 bg-[#121224] border-b border-[#2A2A4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 flex justify-center">
            {/* Display Cyber Avatar Shield Layout */}
            <div className="relative p-3 bg-gradient-to-tr from-[#E07B39]/20 to-transparent rounded-2xl border border-[#2A2A4A] max-w-sm w-full aspect-square flex items-center justify-center shadow-lg">
              <div className="absolute inset-0 bg-[#0D0D1A]/60 backdrop-blur rounded-2xl -z-10" />
              <div className="w-full h-full rounded-xl bg-[#0D0D1A] flex flex-col justify-center items-center text-center p-6 border border-[#2A2A4A]">
                <Network className="w-16 h-16 text-[#E07B39] mb-4 animate-pulse" />
                <h3 className="font-space font-bold text-xl text-[#F0F0F0]">Elvis K. Chanda</h3>
                <p className="text-xs text-[#E07B39] font-mono mt-1">SOC Analyst / Developer</p>
                <div className="w-12 h-1 bg-[#E07B39] rounded my-4" />
                <span className="text-[11px] text-[#A0A0B0] font-mono">EST: LUSAKA_ZAMBIA</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E07B39] tracking-wider uppercase">Background summary</span>
              <h2 className="text-3xl font-bold text-[#F0F0F0] font-space">About Elvis</h2>
            </div>
            <p className="text-sm text-[#A0A0B0] leading-relaxed">
              I am focused on defending core host assets and analyzing credential patterns. By deploying custom SIEM collectors inside sandbox virtualization environments, I study active intrusion vectors. My continuous career goal is implementing resilient SOC frameworks that withstand remote threat models.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm text-[#E07B39] hover:underline hover:text-[#E07B39]/80 font-space font-medium"
              >
                Read Full Biography <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects Grid */}
      <section className="py-20 bg-[#0D0D1A] border-b border-[#2A2A4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E07B39] tracking-wider uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Featured showcases
              </span>
              <h2 className="text-3xl font-bold text-[#F0F0F0] font-space">Active Laboratory Exercises</h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-xs font-mono text-[#E07B39] border border-[#2A2A4A] rounded-lg hover:border-[#E07B39]/50 transition-all"
            >
              BROWSE_ALL_PROJECTS <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-[#1A1A2E] rounded-xl border border-[#2A2A4A] animate-pulse" />
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="py-12 text-center text-[#A0A0B0] border border-[#2A2A4A] border-dashed rounded-xl" id="featured-empty-state">
              No featured projects found. Logs are clean.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="home-featured-list">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#1A1A2E] rounded-xl border border-[#2A2A4A] overflow-hidden flex flex-col hover:border-[#E07B39]/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#000]/40 group"
                >
                  {/* Card Thumbnail */}
                  <div className="h-44 overflow-hidden relative border-b border-[#2A2A4A]">
                    <img
                      src={project.thumbnailUrl || "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=400&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#E07B39] text-[#0D0D1A] font-mono text-[10px] font-bold rounded">
                      {project.status}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    <span className="text-[10px] font-mono text-[#E07B39] tracking-widest uppercase">
                      {project.category}
                    </span>
                    <h3 className="font-space font-bold text-lg text-[#F0F0F0] line-clamp-1 group-hover:text-[#E07B39] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#A0A0B0] line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack Pills list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack?.slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-[#0D0D1A] text-[9px] font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded">
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-[#0D0D1A] text-[9px] font-mono text-[#E07B39]">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 mt-auto">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#E07B39] font-mono font-medium hover:underline"
                      >
                        VIEW_ANALYSIS_REPORTS →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Skills snapshot */}
      <section className="py-20 bg-[#121224] border-b border-[#2A2A4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#E07B39] tracking-wider uppercase">Engineering competencies</span>
            <h2 className="text-3xl font-bold text-[#F0F0F0] font-space">Technical Proficiencies</h2>
            <p className="text-sm text-[#A0A0B0]">
              Operational knowledge across industry standard threat detection tools, scripting languages, and virtualization wrappers.
            </p>
          </div>

          {loading ? (
            <div className="h-20 bg-[#1A1A2E] animate-pulse rounded-lg max-w-lg mx-auto" />
          ) : skills.length === 0 ? (
            <div className="text-[#A0A0B0] font-mono">No skills loaded in registry.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" id="home-skills-snapshot">
              {skills.map((skill: any, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex items-center gap-3 hover:border-[#E07B39]/30 transition-all text-left group"
                >
                  <span className="text-xl shrink-0 p-1.5 bg-[#0D0D1A] rounded border border-[#2A2A4A] group-hover:border-[#E07B39]/50 transition-colors">
                    {skill.icon || "🛡️"}
                  </span>
                  <div>
                    <h4 className="font-space font-medium text-sm text-[#F0F0F0] line-clamp-1">{skill.name}</h4>
                    <span className="text-[10px] font-mono text-[#E07B39]">{skill.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4">
            <Link
              to="/skills"
              className="px-5 py-2.5 bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg text-xs font-mono text-[#E07B39] hover:border-[#E07B39]/40 transition-colors inline-flex items-center gap-2"
            >
              READ_ALL_COMPETENCIES <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Latest blog writeups */}
      <section className="py-20 bg-[#0D0D1A] last-section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#E07B39] tracking-wider uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Threat Intel logs
              </span>
              <h2 className="text-3xl font-bold text-[#F0F0F0] font-space">Recent Incident Analyses & Blog</h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-xs font-mono text-[#E07B39] border border-[#2A2A4A] rounded-lg hover:border-[#E07B39]/50 transition-all"
            >
              READ_THE_LOGBOOK <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-44 bg-[#1A1A2E] animate-pulse rounded-xl" />
          ) : latestBlogs.length === 0 ? (
            <div className="py-12 text-center text-[#A0A0B0] border border-[#2A2A4A] border-dashed rounded-xl">
              Writeups directory is sterile. No incident posts found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="home-blogs-snapshot">
              {latestBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl flex flex-col h-full hover:border-[#E07B39]/30 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0B0] mb-3">
                    <span>{blog.date}</span>
                    <span className="text-[#E07B39]">{blog.readTime || "5 min read"}</span>
                  </div>
                  <h3 className="font-space font-bold text-lg text-[#F0F0F0] line-clamp-2 mb-3 group-hover:text-[#E07B39] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-[#A0A0B0] line-clamp-3 leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                    {blog.tags?.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-[#0D0D1A] text-[9px] font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-xs text-[#E07B39] font-mono font-medium hover:underline"
                  >
                    READ_INCIDENT_WRITEUP <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
