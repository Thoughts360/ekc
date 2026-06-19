import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  Activity, 
  User,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostAndRelated() {
      try {
        setLoading(true);
        // Query current post by slug
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
          setPost(null);
          setLoading(false);
          return;
        }

        const currentPost: any = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setPost(currentPost);

        // Fetch remaining published items to resolve related posts
        const allSnap = await getDocs(collection(db, "blogPosts"));
        const allFetched = allSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as any))
          .filter((p: any) => p.published && p.id !== currentPost.id);

        // Match related posts based on matching tags
        const matched = allFetched.filter((oth: any) => {
          const currentTags = currentPost.tags || [];
          const otherTags = oth.tags || [];
          return currentTags.some((tag: string) => otherTags.includes(tag));
        });

        setRelatedPosts(matched.slice(0, 3));
      } catch (err) {
        console.error("Error fetching single post details: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPostAndRelated();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex flex-col justify-center items-center py-24 text-center">
        <Activity className="w-8 h-8 text-[#E07B39] animate-spin mb-4" />
        <p className="text-xs font-mono text-[#A0A0B0] animate-pulse">INCIDENT_LOG_DECRYPTING...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] py-24 text-center px-4 space-y-4">
        <ShieldCheck className="w-16 h-16 text-red-500 mx-auto opacity-50" />
        <h2 className="text-2xl font-bold font-space text-[#F0F0F0]">Writeup Sealed or Purged</h2>
        <p className="text-xs text-[#A0A0B0] max-w-sm mx-auto leading-relaxed">
          The requested case file is restricted or does not exist inside our active index.
        </p>
        <div className="pt-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-xs font-mono text-[#E07B39] border border-[#2A2A4A] rounded-lg hover:border-[#E07B39]/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> BACK_TO_LOGBOOK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A]" id="blog-detail-wrapper">
      {/* 1. Header Hero Banner */}
      <section className="relative py-16 bg-[#121224] border-b border-[#2A2A4A]">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-[#E07B39] font-mono hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> BACK_TO_LOGBOOK_DIR
          </Link>

          <div className="space-y-3 text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F0F0] font-space tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Post meta details info row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#A0A0B0] pt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#E07B39]" /> {post.date || "2026-06"}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#E07B39]" /> {post.readTime || "5 min read"}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#E07B39]" /> BY_OPERATOR: ELVIS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Layout */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        
        {/* Writeup Body Block */}
        <div className="p-8 bg-[#121224] border border-[#2A2A4A]/60 rounded-xl space-y-6">
          <div 
            className="prose prose-invert max-w-none 
              prose-headings:font-space prose-headings:text-[#F0F0F0] prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-3
              prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:mb-5 prose-p:text-[#A0A0B0]
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-5 prose-ul:text-[#A0A0B0]
              prose-code:font-mono prose-code:text-[#E07B39] prose-code:bg-[#0D0D1A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-[#080811] prose-pre:p-5 prose-pre:rounded-lg prose-pre:border prose-pre:border-[#2A2A4A] prose-pre:text-xs prose-pre:overflow-x-auto
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Footer pills list */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-[#2A2A4A]/40">
            <span className="text-xs font-mono text-[#A0A0B0] flex items-center gap-1 mr-2">
              <Tag className="w-4 h-4 text-[#E07B39]" /> SIGN_KEYS:
            </span>
            {post.tags?.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#1A1A2E] text-xs font-mono text-[#E07B39] border border-[#2A2A4A]/60 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Related Posts Column */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-6" id="related-posts-panel">
            <h3 className="font-space font-bold text-xl text-[#F0F0F0] border-l-4 border-[#E07B39] pl-3">
              Correlated Case Logs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((oth) => (
                <Link
                  key={oth.id}
                  to={`/blog/${oth.slug}`}
                  className="p-5 bg-[#1A1A2E] border border-[#2A2A4A] rounded-xl hover:border-[#E07B39]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-mono text-[#E07B39]">{oth.date}</span>
                    <h4 className="font-space font-bold text-base text-[#F0F0F0] line-clamp-1 hover:text-[#E07B39]">
                      {oth.title}
                    </h4>
                    <p className="text-xs text-[#A0A0B0] line-clamp-2">
                      {oth.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-mono text-[#E07B39] justify-end">
                    <span>EXECUTE_PARSE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
