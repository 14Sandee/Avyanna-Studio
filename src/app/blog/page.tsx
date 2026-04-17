'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import { BlogGrid } from '@/components/blog-grid';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  getPublishedPosts,
  getCategories,
  getPostsByCategory,
  searchPosts,
  getTrendingPosts,
  getPostsByIds,
  getPostsByPlatform,
  getPlatforms,
  getAllSections,
} from '@/lib/db';
import type { BlogPost, DynamicSection } from '@/lib/types';

const platformStyles: Record<string, { label: string; active: string }> = {
  amazon: { label: 'Amazon', active: 'bg-orange-500 text-white hover:bg-orange-600' },
  myntra: { label: 'Myntra', active: 'bg-pink-500 text-white hover:bg-pink-600' },
  flipkart: { label: 'Flipkart', active: 'bg-blue-500 text-white hover:bg-blue-600' },
  ajio: { label: 'Ajio', active: 'bg-purple-500 text-white hover:bg-purple-600' },
  nykaa: { label: 'Nykaa', active: 'bg-rose-400 text-white hover:bg-rose-500' },
};

const BlogContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');
  const sectionParam = searchParams.get('section');
  const platformParam = searchParams.get('platform');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; count: number }[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<{ slug: string; count: number }[]>(
    [],
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [activeFilter, setActiveFilter] = useState<string | null>(filterParam);
  const [activePlatform, setActivePlatform] = useState<string | null>(platformParam);
  const [sectionTitle, setSectionTitle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, plats] = await Promise.all([getCategories(), getPlatforms()]);
        setCategories(cats);
        setAvailablePlatforms(plats);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const results = await searchPosts(searchQuery);
          setPosts(results);
          setSectionTitle(null);
        } else if (activePlatform) {
          const results = await getPostsByPlatform(activePlatform);
          setPosts(results);
          const style = platformStyles[activePlatform];
          setSectionTitle(style ? `${style.label} Deals` : `${activePlatform} Deals`);
        } else if (activeFilter === 'trending') {
          const results = await getTrendingPosts();
          setPosts(results);
          setSectionTitle('Trending Now');
        } else if (sectionParam) {
          const sections = await getAllSections();
          const section = sections.find((s: DynamicSection) => s.slug === sectionParam);
          if (section) {
            const results = await getPostsByIds(section.post_ids);
            setPosts(results);
            setSectionTitle(section.title);
          } else {
            setPosts([]);
            setSectionTitle(null);
          }
        } else if (activeCategory) {
          const results = await getPostsByCategory(activeCategory);
          setPosts(results);
          setSectionTitle(null);
        } else {
          const results = await getPublishedPosts();
          setPosts(results);
          setSectionTitle(null);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory, activeFilter, activePlatform, sectionParam, searchQuery]);

  const handleCategoryClick = (slug: string | null) => {
    setActiveCategory(slug);
    setActiveFilter(null);
    setActivePlatform(null);
    setSearchQuery('');
  };

  const handlePlatformClick = (slug: string | null) => {
    setActivePlatform(slug);
    setActiveCategory(null);
    setActiveFilter(null);
    setSearchQuery('');
  };

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="bg-linear-to-b from-stone-50 to-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-3 text-3xl font-light tracking-widest text-stone-800 uppercase">
              {sectionTitle ?? 'The Blog'}
            </h1>
            <p className="text-sm text-stone-400">
              {sectionTitle
                ? `Showing all posts in ${sectionTitle}`
                : 'Stories, guides, and inspiration for intentional living.'}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory(null);
                  setActivePlatform(null);
                }}
                placeholder="Search posts..."
                className="border-stone-200 pl-10 focus-visible:ring-stone-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-col items-center gap-3">
            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                variant={
                  activeCategory === null && !activePlatform && !activeFilter && !searchQuery
                    ? 'default'
                    : 'secondary'
                }
                className="cursor-pointer px-3 py-1 text-xs font-normal tracking-wider uppercase"
                onClick={() => handleCategoryClick(null)}
              >
                All
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.slug}
                  variant={activeCategory === cat.slug ? 'default' : 'secondary'}
                  className="cursor-pointer px-3 py-1 text-xs font-normal tracking-wider uppercase"
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>

            {/* Platform filters - only show if platforms exist */}
            {availablePlatforms.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <span className="self-center text-[10px] tracking-widest text-stone-300 uppercase">
                  Shop by
                </span>
                {availablePlatforms.map((p) => {
                  const style = platformStyles[p.slug];
                  if (!style) return null;
                  return (
                    <Badge
                      key={p.slug}
                      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-normal tracking-wider uppercase transition-all ${
                        activePlatform === p.slug
                          ? style.active
                          : 'border border-stone-200 bg-white text-stone-500 shadow-sm hover:bg-stone-50'
                      }`}
                      onClick={() => handlePlatformClick(activePlatform === p.slug ? null : p.slug)}
                    >
                      {style.label}
                      <span
                        className={`ml-1.5 text-[10px] ${activePlatform === p.slug ? 'text-white/70' : 'text-stone-300'}`}
                      >
                        {p.count}
                      </span>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <p className="animate-pulse text-sm tracking-wide text-stone-400">Loading posts...</p>
            </div>
          ) : (
            <BlogGrid posts={posts} />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

const BlogPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="animate-pulse text-sm text-stone-400">Loading...</p>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
};

export default BlogPage;
