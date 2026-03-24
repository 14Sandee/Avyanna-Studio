import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { AffiliateCard } from "@/components/affiliate-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostBySlug, getRelatedPosts } from "@/lib/db";
import { ArrowLeft, Share2, Clock } from "lucide-react";

export const revalidate = 60;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getPostBySlug>> = null;
  let relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>> = [];

  try {
    post = await getPostBySlug(slug);
    if (post) {
      relatedPosts = await getRelatedPosts(slug, post.category);
    }
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Fix content that might have been saved incorrectly by the editor
  function cleanContent(html: string): string {
    if (!html) return "";
    let cleaned = html;
    // Strip <pre><code> wrappers (editor bug saved HTML as code block)
    cleaned = cleaned.replace(/<pre><code[^>]*>/gi, "").replace(/<\/code><\/pre>/gi, "");
    // Unescape HTML entities
    cleaned = cleaned
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/''/g, "'");
    // If there are no HTML tags at all, wrap in <p>
    if (!cleaned.includes("<")) {
      cleaned = `<p>${cleaned}</p>`;
    }
    return cleaned;
  }

  const content = cleanContent(post.content);
  const readTime = Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
  let affiliateLinks: Array<{ label: string; url: string; image?: string; price?: string }> = [];
  try {
    const raw = post.affiliate_links;
    if (Array.isArray(raw)) {
      affiliateLinks = raw;
    } else if (typeof raw === "string") {
      affiliateLinks = JSON.parse(raw);
    }
  } catch {
    affiliateLinks = [];
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero / Cover Image */}
        <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized={!post.cover_image.includes('unsplash') && !post.cover_image.includes('supabase')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          {/* Header Card — full width */}
          <div className="max-w-3xl bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-stone-200/30 border border-stone-100 mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="text-xs tracking-wider uppercase font-normal px-3 py-1 rounded-full"
              >
                {post.category.replace(/-/g, " ")}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-stone-400">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-800 leading-snug mb-4">
              {post.title}
            </h1>

            <p className="text-base text-stone-400">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Article */}
            <article className="prose overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>

            {/* Sidebar — sticky on desktop */}
            <aside className="w-full">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Affiliate Products */}
                {affiliateLinks.length > 0 && (
                  <AffiliateCard links={affiliateLinks} />
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                    <h4 className="text-sm tracking-[0.12em] uppercase text-stone-400 mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs font-normal tracking-wide"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                  <h4 className="text-sm tracking-[0.12em] uppercase text-stone-400 mb-3">
                    Share
                  </h4>
                  <div className="flex gap-2">
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                        `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`
                      )}&description=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-sm text-stone-500">
                        Pinterest
                      </Button>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        post.title
                      )}&url=${encodeURIComponent(
                        `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-sm text-stone-500">
                        Twitter
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-lg tracking-wide font-light text-stone-600 mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
