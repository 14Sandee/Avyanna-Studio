'use client';

import { Loader2, X, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSectionById, createSection, updateSection, getAllPosts } from '@/lib/db';
import type { BlogPost } from '@/lib/types';

const SectionEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [saving, setSaving] = useState(false);
  const [loadingSection, setLoadingSection] = useState(!isNew);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [displayOrder, setDisplayOrder] = useState(0);

  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [postSearch, setPostSearch] = useState('');

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      setSlug(generateSlug(value));
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getAllPosts();
        setAllPosts(posts);
      } catch {
        // ignore
      } finally {
        setLoadingPosts(false);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    if (isNew) return;
    const loadSection = async () => {
      try {
        const section = await getSectionById(params.id as string);
        if (section) {
          setTitle(section.title);
          setSubtitle(section.subtitle);
          setSlug(section.slug);
          setIsVisible(section.is_visible);
          setSelectedPostIds(section.post_ids);
          setDisplayOrder(section.display_order);
        }
      } catch {
        // ignore
      } finally {
        setLoadingSection(false);
      }
    };
    loadSection();
  }, [isNew, params.id]);

  const togglePost = (postId: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
    );
  };

  const filteredPosts = allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      post.category.toLowerCase().includes(postSearch.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sectionData = {
      title,
      subtitle,
      slug,
      is_visible: isVisible,
      post_ids: selectedPostIds,
      display_order: displayOrder,
    };

    try {
      if (isNew) {
        await createSection(sectionData);
      } else {
        await updateSection(params.id as string, sectionData);
      }
      router.push('/admin/sections');
      router.refresh();
    } catch {
      alert('Failed to save section. Please check your Supabase connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingSection) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-stone-400" />
        <p className="mt-2 text-sm text-stone-400">Loading section...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-800">
          {isNew ? 'Create Section' : 'Edit Section'}
        </h1>
        <p className="mt-1 text-sm text-stone-400">
          {isNew
            ? 'Add a new dynamic section to your homepage'
            : 'Update section settings and posts'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs tracking-widest text-stone-400 uppercase">Title</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Under $99"
              className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs tracking-widest text-stone-400 uppercase">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="under-99"
              className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
              required
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">Subtitle</Label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Budget-friendly picks"
            className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
          />
        </div>

        {/* Display Order */}
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">Display Order</Label>
          <Input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
            className="h-11 w-32 border-stone-200 text-base focus-visible:ring-stone-300"
          />
          <p className="text-xs text-stone-300">Lower numbers appear first on the homepage</p>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_visible"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-stone-800 focus:ring-stone-300"
          />
          <Label htmlFor="is_visible" className="cursor-pointer text-base text-stone-600">
            Show this section on the homepage
          </Label>
        </div>

        {/* Post Multi-Select */}
        <div className="space-y-3">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">
            Select Posts ({selectedPostIds.length} selected)
          </Label>

          {/* Selected posts chips */}
          {selectedPostIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPostIds.map((id) => {
                const post = allPosts.find((p) => p.id === id);
                if (!post) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600"
                  >
                    {post.title.length > 30 ? `${post.title.slice(0, 30)}...` : post.title}
                    <button
                      type="button"
                      onClick={() => togglePost(id)}
                      className="rounded-full p-0.5 transition-colors hover:bg-stone-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Search posts */}
          <Input
            value={postSearch}
            onChange={(e) => setPostSearch(e.target.value)}
            placeholder="Search posts to add..."
            className="h-10 border-stone-200 text-sm focus-visible:ring-stone-300"
          />

          {/* Post list */}
          {loadingPosts ? (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-4 w-4 animate-spin text-stone-400" />
            </div>
          ) : (
            <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-stone-200 p-2">
              {filteredPosts.length === 0 ? (
                <p className="py-4 text-center text-xs text-stone-400">No posts found</p>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = selectedPostIds.includes(post.id);
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => togglePost(post.id)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-stone-100 text-stone-800'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          isSelected ? 'border-stone-800 bg-stone-800' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{post.title}</p>
                        <p className="text-[10px] text-stone-400">
                          {post.category.replace(/-/g, ' ')} &middot;{' '}
                          {post.published ? 'Published' : 'Draft'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-stone-100 pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 rounded-lg bg-stone-800 px-6 text-sm text-white hover:bg-stone-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isNew ? (
              'Create Section'
            ) : (
              'Update Section'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/sections')}
            className="h-11 rounded-lg text-sm text-stone-500"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SectionEditPage;
