import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Sliders, Calendar, ArrowRight } from "lucide-react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);

  const tagsList = ["All", "CTF Write-ups", "Lab Reports", "Tutorials", "Reflections"];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const snap = await getDocs(collection(db, "blogPosts"));
        const fetched = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as any));
        // Only load published items
        const publishedBlogs = fetched.filter((blog) => blog.published === true);
        // Sort by date descending
        publishedBlogs.sort((a, b) => {
          return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
        });
        setPosts(publishedBlogs);
        setFilteredPosts(publishedBlogs);
      } catch (err) {
        console.error("Error fetching blog posts collection: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Filter posts based on searches and active tags
  useEffect(() => {
    let result = posts;

    // Filter by tag selection
    if (activeTag !== "All") {
      result = result.filter((post) => {
        const tags = post.tags || [];
        return tags.some((tag: string) => tag.toLowerCase() === activeTag.toLowerCase());
      });
    }

    // Filter by search terms
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [searchQuery, activeTag, posts]);

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="blog-indexing-wrapper">
      {/* 1. Header Hero Panel */}
      <section className="relative py-14 bg-[#121224] border-b border-[#2A2A4A] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4a15_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4a15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative">
          <div className="inline-flex p-3 bg-[#E07B39]/10 rounded-full border border-[#E07B39]/20 mb-1">
            <BookOpen className="w-6 h-6 text-[#E07B39]" />
          </div>
          <p className="text-xs font-mono text-[#E07B39] tracking-widest uppercase">sys_index_logbook</p>
          <h1 className="text-4xl font-extrabold font-space text-[#F0F0F0] tracking-tight">Incident Write-ups</h1>
          <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto">
            Dissecting log vectors, CTF security flags, pfSense routes, and security walkthroughs compiled for reference.
          </p>
          <div className="w-16 h-1 bg-[#E07B39] rounded mx-auto mt-2" />
        </div>
      </section>

      {/* 2. Controls, Search, and Filters */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="blog-pills-panel">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#121224] p-6 rounded-xl border border-[#2A2A4A]">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A0A0B0]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Query logs (e.g. 'SSH', 'Brute force')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D0D1A] border border-[#2A2A4A] hover:border-[#E07B39]/40 focus:border-[#E07B39] outline-none text-xs rounded-lg pl-9 pr-4 py-2.5 text-[#F0F0F0] font-mono transition-colors"
            />
          </div>

          {/* Log metrics details */}
          <div className="flex items-center gap-2 text-[#A0A0B0] text-xs font-mono">
            <Sliders className="w-4 h-4 text-[#E07B39]" />
            <span>RESULT_VECTORS: [{filteredPosts.length} FOUND]</span>
          </div>
        </div>

        {/* Categories checklist tags */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 justify-start md:justify-center">
          {tagsList.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-all border ${
                activeTag === tag
                  ? "bg-[#E07B39] text-[#0D0D1A] font-bold border-[#E07B39] shadow-md shadow-[#E07B39]/10"
                  : "bg-[#1A1A2E] text-[#A0A0B0] border-[#2A2A4A] hover:text-[#F0F0F0] hover:border-[#E07B39]/40"
              }`}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 3. Blog List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-60 bg-[#1A1A2E] rounded-xl border border-[#2A2A4A] animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[#2A2A4A] rounded-xl flex flex-col items-center justify-center max-w-md mx-auto space-y-4" id="blogs-empty-display">
            <BookOpen className="w-12 h-12 text-[#E07B39]/20" />
            <h3 className="font-space font-bold text-lg text-[#F0F0F0]">Sterile Log Directory</h3>
            <p className="text-xs text-[#A0A0B0] leading-relaxed max-w-xs">
              No write-up logs currently match query: "{searchQuery || activeTag}". Try altering keywords or clearing search fields.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blogs-grid-list">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[#1A1A2E] rounded-xl border border-[#2A2A4A] p-6 flex flex-col h-full hover:border-[#E07B39]/40 transition-all hover:shadow-xl group"
              >
                {/* Time & metrics bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0B0] mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#E07B39]" /> {post.date || "2026-06"}</span>
                  <span className="text-[#E07B39]">{post.readTime || "5 min read"}</span>
                </div>

                {/* Info titles */}
                <h3 className="font-space font-bold text-lg text-[#F0F0F0] line-clamp-2 mb-3 group-hover:text-[#E07B39] transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs text-[#A0A0B0] line-clamp-3 leading-relaxed mb-6 font-sans">
                  {post.excerpt}
                </p>

                {/* Sub Tags pills */}
                <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                  {post.tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-[#0D0D1A] text-[9px] font-mono text-[#A0A0B0] border border-[#2A2A4A] rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#2A2A4A]/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-green-400">UNRESTRICTED_ACCESS</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-[#E07B39] font-mono font-medium hover:underline"
                  >
                    READ_POST <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
