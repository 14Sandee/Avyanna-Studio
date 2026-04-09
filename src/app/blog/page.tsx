'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import { BlogGrid } from '@/components/blog-grid';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getPublishedPosts, getCategories, getPostsByCategory, searchPosts } from '@/lib/db';
import type { BlogPost } from '@/lib/types';

const BlogContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; count: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
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
        } else if (activeCategory) {
          const results = await getPostsByCategory(activeCategory);
          setPosts(results);
        } else {
          const results = await getPublishedPosts();
          setPosts(results);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory, searchQuery]);

  const handleCategoryClick = (slug: string | null) => {
    setActiveCategory(slug);
    setSearchQuery('');
  };

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="bg-linear-to-b from-stone-50 to-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-3 text-3xl font-light tracking-widest text-stone-800 uppercase">
              The Blog
            </h1>
            <p className="text-sm text-stone-400">
              Stories, guides, and inspiration for intentional living.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory(null);
                }}
                placeholder="Search posts..."
                className="border-stone-200 pl-10 focus-visible:ring-stone-300"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={activeCategory === null && !searchQuery ? 'default' : 'secondary'}
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
