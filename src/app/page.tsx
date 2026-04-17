import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { BlogGrid } from '@/components/blog-grid';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { PinterestSection, InstagramSection } from '@/components/social-section';
import { Button } from '@/components/ui/button';
import { getPublishedPosts, getTrendingPosts, getVisibleSections, getPostsByIds } from '@/lib/db';
import type { BlogPost, DynamicSection } from '@/lib/types';

export const revalidate = 60;

const HomePage = async () => {
  let posts: BlogPost[] = [];
  let trendingPosts: BlogPost[] = [];
  let sections: DynamicSection[] = [];
  let sectionPosts: Record<string, BlogPost[]> = {};

  try {
    [posts, trendingPosts, sections] = await Promise.all([
      getPublishedPosts(),
      getTrendingPosts(),
      getVisibleSections(),
    ]);

    // Fetch posts for each dynamic section
    const sectionPostResults = await Promise.all(
      sections.map(async (section) => ({
        sectionId: section.id,
        posts: await getPostsByIds(section.post_ids),
      })),
    );
    sectionPosts = Object.fromEntries(
      sectionPostResults.map(({ sectionId, posts: p }) => [sectionId, p]),
    );
  } catch {
    // Supabase not configured yet
  }

  const featuredPosts = posts.slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-28 md:py-40">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-stone-100 via-white to-amber-50/30" />
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-amber-100/20 blur-3xl" />
          <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-stone-200/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-100/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200/50 bg-white/60 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <p className="text-[11px] tracking-[0.2em] text-stone-500 uppercase">
                Curated for you
              </p>
            </div>

            <h1 className="mb-6 text-5xl font-extralight tracking-[0.08em] text-stone-800 md:text-7xl lg:text-8xl">
              Avyanna
              <span className="mt-2 block text-3xl font-light tracking-[0.3em] text-stone-400 md:text-4xl lg:text-5xl">
                DEALS
              </span>
            </h1>

            <div className="mx-auto mb-6 h-[1px] w-12 bg-linear-to-r from-transparent via-stone-400 to-transparent" />

            <p className="mx-auto max-w-lg text-base leading-relaxed font-light text-stone-400 md:text-lg">
              Today&apos;s best deals from Amazon and Myntra — updated daily at 9AM.
            </p>

            <div className="mt-12 flex items-center justify-center gap-4">
              <Link href="/blog">
                <Button className="rounded-xl bg-stone-900 px-8 py-6 text-xs tracking-[0.15em] text-white uppercase shadow-lg shadow-stone-300/30 transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-400/20">
                  Explore the Blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-[1px] w-full bg-linear-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Featured Posts */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="mb-1 text-[11px] tracking-[0.2em] text-stone-300 uppercase">Fresh</p>
              <h2 className="text-xl font-light tracking-wide text-stone-700">Latest Posts</h2>
            </div>
            <Link
              href="/blog"
              className="group flex items-center gap-2 rounded-lg px-4 py-2 transition-colors hover:bg-stone-50"
            >
              <span className="text-xs tracking-wider text-stone-400 uppercase transition-colors group-hover:text-stone-600">
                View all
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-stone-400 transition-all group-hover:translate-x-0.5 group-hover:text-stone-600" />
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-linear-to-b from-stone-50 to-white py-24 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                <Sparkles className="h-5 w-5 text-stone-400" />
              </div>
              <p className="mb-2 text-sm text-stone-500">No posts yet</p>
              <p className="mx-auto max-w-xs text-xs text-stone-300">
                Connect your Supabase database and create your first post from the{' '}
                <Link href="/admin" className="text-stone-500 underline hover:text-stone-700">
                  admin panel
                </Link>
              </p>
            </div>
          ) : (
            <BlogGrid posts={featuredPosts} />
          )}
        </section>

        {/* Trending Now */}
        {trendingPosts.length > 0 && (
          <>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="h-[1px] w-full bg-linear-to-r from-transparent via-stone-200 to-transparent" />
            </div>

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] tracking-[0.2em] text-amber-400 uppercase">
                      Hot
                    </p>
                    <h2 className="text-xl font-light tracking-wide text-stone-700">
                      Trending Now
                    </h2>
                  </div>
                </div>
                <Link
                  href="/blog?filter=trending"
                  className="group flex items-center gap-2 rounded-lg px-4 py-2 transition-colors hover:bg-stone-50"
                >
                  <span className="text-xs tracking-wider text-stone-400 uppercase transition-colors group-hover:text-stone-600">
                    View all
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-400 transition-all group-hover:translate-x-0.5 group-hover:text-stone-600" />
                </Link>
              </div>
              <BlogGrid posts={trendingPosts.slice(0, 6)} />
            </section>
          </>
        )}

        {/* Dynamic Sections */}
        {sections.map((section) => {
          const sectionData = sectionPosts[section.id] ?? [];
          if (sectionData.length === 0) return null;
          return (
            <div key={section.id}>
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="h-[1px] w-full bg-linear-to-r from-transparent via-stone-200 to-transparent" />
              </div>

              <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    {section.subtitle && (
                      <p className="mb-1 text-[11px] tracking-[0.2em] text-stone-300 uppercase">
                        {section.subtitle}
                      </p>
                    )}
                    <h2 className="text-xl font-light tracking-wide text-stone-700">
                      {section.title}
                    </h2>
                  </div>
                  <Link
                    href={`/blog?section=${section.slug}`}
                    className="group flex items-center gap-2 rounded-lg px-4 py-2 transition-colors hover:bg-stone-50"
                  >
                    <span className="text-xs tracking-wider text-stone-400 uppercase transition-colors group-hover:text-stone-600">
                      View all
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-stone-400 transition-all group-hover:translate-x-0.5 group-hover:text-stone-600" />
                  </Link>
                </div>
                <BlogGrid posts={sectionData.slice(0, 6)} />
              </section>
            </div>
          );
        })}

        {/* Divider */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-[1px] w-full bg-linear-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Pinterest */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PinterestSection />
        </div>

        {/* Divider */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-[1px] w-full bg-linear-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Instagram */}
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <InstagramSection />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
