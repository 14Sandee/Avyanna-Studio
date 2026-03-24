import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogGrid } from "@/components/blog-grid";
import { PinterestSection, InstagramSection } from "@/components/social-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedPosts, getCategories } from "@/lib/db";
import { ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    [posts, categories] = await Promise.all([
      getPublishedPosts(),
      getCategories(),
    ]);
  } catch {
    // Supabase not configured yet
  }

  const featuredPosts = posts.slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-28 md:py-40 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-white to-amber-50/30" />
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/10 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-stone-200/50 mb-8">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">
                Curated for you
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.08em] text-stone-800 mb-6">
              Avyanna
              <span className="block text-3xl md:text-4xl lg:text-5xl tracking-[0.3em] text-stone-400 mt-2 font-light">
                STUDIO
              </span>
            </h1>

            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-stone-400 to-transparent mx-auto mb-6" />

            <p className="text-base md:text-lg text-stone-400 font-light max-w-lg mx-auto leading-relaxed">
              Where beauty meets intention. Discover curated stories on fashion, lifestyle, and the art of living well.
            </p>

            <div className="mt-12 flex items-center justify-center gap-4">
              <Link href="/blog">
                <Button className="bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-[0.15em] uppercase px-8 py-6 rounded-xl shadow-lg shadow-stone-300/30 transition-all hover:shadow-xl hover:shadow-stone-400/20 hover:-translate-y-0.5">
                  Explore the Blog
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Featured Posts */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-stone-300 mb-1">Fresh</p>
              <h2 className="text-xl font-light tracking-wide text-stone-700">
                Latest Posts
              </h2>
            </div>
            <Link
              href="/blog"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <span className="text-xs tracking-wider uppercase text-stone-400 group-hover:text-stone-600 transition-colors">
                View all
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-24 bg-gradient-to-b from-stone-50 to-white rounded-2xl border border-dashed border-stone-200">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-5 h-5 text-stone-400" />
              </div>
              <p className="text-stone-500 text-sm mb-2">No posts yet</p>
              <p className="text-stone-300 text-xs max-w-xs mx-auto">
                Connect your Supabase database and create your first post from the{" "}
                <Link href="/admin" className="underline text-stone-500 hover:text-stone-700">
                  admin panel
                </Link>
              </p>
            </div>
          ) : (
            <BlogGrid posts={featuredPosts} />
          )}
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Pinterest */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PinterestSection />
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Instagram */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <InstagramSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
