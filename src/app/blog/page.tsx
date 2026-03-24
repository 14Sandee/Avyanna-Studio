"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogGrid } from "@/components/blog-grid";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getPublishedPosts, getCategories, getPostsByCategory, searchPosts } from "@/lib/db";
import { BlogPost } from "@/lib/types";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

function BlogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; count: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    async function load() {
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
    }
    load();
  }, [activeCategory, searchQuery]);

  function handleCategoryClick(slug: string | null) {
    setActiveCategory(slug);
    setSearchQuery("");
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-light tracking-[0.1em] text-stone-800 uppercase mb-3">
              The Blog
            </h1>
            <p className="text-sm text-stone-400">
              Stories, guides, and inspiration for intentional living.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory(null);
                }}
                placeholder="Search posts..."
                className="pl-10 border-stone-200 focus-visible:ring-stone-300"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={activeCategory === null && !searchQuery ? "default" : "secondary"}
                className="cursor-pointer text-xs tracking-wider uppercase font-normal px-3 py-1"
                onClick={() => handleCategoryClick(null)}
              >
                All
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.slug}
                  variant={activeCategory === cat.slug ? "default" : "secondary"}
                  className="cursor-pointer text-xs tracking-wider uppercase font-normal px-3 py-1"
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-stone-400 text-sm tracking-wide animate-pulse">
                Loading posts...
              </p>
            </div>
          ) : (
            <BlogGrid posts={posts} />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-stone-400 text-sm animate-pulse">Loading...</p>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}
