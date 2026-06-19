import { useState, useEffect } from "react";
import { User, ShieldAlert, BadgeCheck, BookOpen, Download } from "lucide-react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export default function About() {
  const [bio, setBio] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const docRef = doc(db, "about", "content");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBio(data.bio || "");
          setPhilosophy(data.philosophy || "");
          setTimeline(data.timeline || []);
        } else {
          // Local fallback in case of connection latency
          setBio("<p>My name is Elvis Kangwa Chanda, a cybersecurity specialist in training. I build pfSense intrusion gateways, Wazuh alert decoders, and write educational writeups.</p>");
          setPhilosophy("Continuous analysis, forensic accuracy, and reliable threat protection metrics.");
        }
      } catch (err) {
        console.error("Error fetching about information: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const handleDownloadCV = () => {
    alert("Elvis - CV download trigger. In production, this targets the CV PDF asset file.");
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="about-page-wrapper">
      {/* 1. Header Banner */}
      <section className="relative py-16 bg-[#121224] border-b border-[#2A2A4A] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a15_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative">
          <div className="inline-flex p-3 bg-[#E07B39]/10 rounded-full border border-[#E07B39]/20 mb-2">
            <User className="w-6 h-6 text-[#E07B39]" />
          </div>
          <p className="text-xs font-mono text-[#E07B39] tracking-widest uppercase">sys_index_biography</p>
          <h1 className="text-4xl font-extrabold font-space text-[#F0F0F0]">About Elvis Kangwa Chanda</h1>
          <div className="w-16 h-1 bg-[#E07B39] rounded mx-auto mt-2" />
        </div>
      </section>

      {/* 2. Biography & Philosophy */}
      <section className="py-16 max-w-4xl mx-auto px-4 space-y-16">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-[#1A1A2E] rounded w-1/3" />
            <div className="h-4 bg-[#1A1A2E] rounded w-full" />
            <div className="h-4 bg-[#1A1A2E] rounded w-5/6" />
            <div className="h-4 bg-[#1A1A2E] rounded w-4/5" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Bio Body Left */}
            <div className="md:col-span-8 space-y-6 text-sm text-[#A0A0B0] leading-relaxed">
              <h2 className="text-2xl font-bold font-space text-[#F0F0F0] border-l-4 border-[#E07B39] pl-3">
                Operator Profile
              </h2>
              <div 
                className="space-y-4 font-sans"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            </div>

            {/* Philosophy Box Right */}
            <div className="md:col-span-4">
              <div className="p-6 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl relative overflow-hidden group hover:border-[#E07B39]/40 transition-all">
                <div className="absolute top-0 right-0 p-2 text-[#E07B39]/10 pointer-events-none">
                  <ShieldAlert className="w-16 h-16" />
                </div>
                <h3 className="text-sm font-mono text-[#E07B39] tracking-wider uppercase flex items-center gap-1.5 mb-3">
                  <BadgeCheck className="w-4 h-4" /> CORE MISSION
                </h3>
                <p className="text-xs text-[#F0F0F0] italic leading-relaxed font-sans">
                  "{philosophy || "Defending core systems demands rigorous monitoring, continuous learning, and structured writeup generation to fortify digital borders."}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Timeline section */}
        <div className="space-y-10 pt-8" id="profile-history-timeline">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#E07B39] tracking-wider uppercase">Record updates</span>
            <h2 className="text-2xl font-bold font-space text-[#F0F0F0]">Milestones & Development</h2>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-[#1A1A2E] rounded w-2/3" />
              <div className="h-10 bg-[#1A1A2E] rounded w-2/3" />
              <div className="h-10 bg-[#1A1A2E] rounded w-1/2" />
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-sm text-[#A0A0B0] font-mono">No timeline events listed.</div>
          ) : (
            <div className="relative border-l-2 border-[#2A2A4A] ml-4 pl-8 space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="relative group" id={`timeline-milestone-${index}`}>
                  {/* Amber dot marker status */}
                  <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#E07B39] border-4 border-[#0D0D1A] group-hover:scale-125 transition-all shadow shadow-[#E07B39]/50" />
                  
                  {/* Milestone block */}
                  <div className="space-y-1.5 text-left">
                    <span className="inline-block px-2 py-0.5 bg-[#E07B39]/15 text-[#E07B39] font-mono text-xs font-bold rounded">
                      {item.year}
                    </span>
                    <h3 className="font-space font-bold text-lg text-[#F0F0F0] group-hover:text-[#E07B39] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#A0A0B0] max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="pt-12 border-t border-[#2A2A4A]/50 text-center flex flex-col items-center justify-center space-y-4">
          <p className="text-xs text-[#A0A0B0] font-mono">Need to audit credentials or check professional logs?</p>
          <button
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E07B39] text-[#0D0D1A] font-space font-bold rounded-lg transition-all hover:bg-[#E07B39]/90 border border-[#E07B39] shadow-lg shadow-[#E07B39]/10"
          >
            <Download className="w-4 h-4" /> Download Professional Resume
          </button>
        </div>
      </section>
    </div>
  );
}
