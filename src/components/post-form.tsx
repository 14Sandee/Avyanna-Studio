'use client';

import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPost, updatePost, uploadImage } from '@/lib/db';
import type { BlogPost, AffiliateLink } from '@/lib/types';

interface PostFormProps {
  post?: BlogPost;
}

export const PostForm = ({ post }: PostFormProps) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '');
  const [category, setCategory] = useState(post?.category ?? 'lifestyle');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [isTrending, setIsTrending] = useState(post?.is_trending ?? false);
  const [platform, setPlatform] = useState(post?.platform ?? '');
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(
    post?.affiliate_links ?? [{ label: '', url: '' }],
  );

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post) {
      setSlug(generateSlug(value));
    }
  };

  const addAffiliateLink = () => {
    setAffiliateLinks([...affiliateLinks, { label: '', url: '', image: '', price: '' }]);
  };

  const removeAffiliateLink = (index: number) => {
    setAffiliateLinks(affiliateLinks.filter((_, i) => i !== index));
  };

  const updateAffiliateLink = (index: number, field: keyof AffiliateLink, value: string) => {
    const updated = [...affiliateLinks];
    updated[index] = { ...updated[index], [field]: value };
    setAffiliateLinks(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      alert('Failed to upload image. You can also paste an image URL directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const postData = {
      title,
      slug,
      content,
      cover_image: coverImage,
      category,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      affiliate_links: affiliateLinks.filter((l) => l.label && l.url),
      excerpt,
      published,
      is_trending: isTrending,
      platform: platform || null,
    };

    try {
      if (post) {
        await updatePost(post.id, postData);
      } else {
        await createPost(postData);
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      alert('Failed to save post. Please check your Supabase connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">Title</Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter post title"
            className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
            required
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label className="text-xs tracking-widest text-stone-400 uppercase">Cover Image</Label>
        <div className="flex gap-3">
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Image URL or upload"
            className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
          />
          <label className="shrink-0 cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <span className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-white transition-colors hover:bg-stone-50">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
              ) : (
                <Upload className="h-4 w-4 text-stone-400" />
              )}
            </span>
          </label>
        </div>
        {coverImage && (
          <div className="relative mt-3 h-48 w-full">
            <Image
              src={coverImage}
              alt="Cover preview"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="rounded-xl border border-stone-100 object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label className="text-xs tracking-widest text-stone-400 uppercase">Excerpt</Label>
        <Textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description for blog cards"
          className="resize-none border-stone-200 text-base focus-visible:ring-stone-300"
          rows={2}
        />
      </div>

      {/* Category, Platform & Tags */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-base focus:ring-2 focus:ring-stone-300 focus:outline-none"
          >
            <option value="fashion">Fashion</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="beauty">Beauty</option>
            <option value="home-decor">Home Decor</option>
            <option value="wellness">Wellness</option>
            <option value="travel">Travel</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">Platform</Label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-base focus:ring-2 focus:ring-stone-300 focus:outline-none"
          >
            <option value="">None</option>
            <option value="amazon">Amazon</option>
            <option value="myntra">Myntra</option>
            <option value="flipkart">Flipkart</option>
            <option value="ajio">Ajio</option>
            <option value="nykaa">Nykaa</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-widest text-stone-400 uppercase">
            Tags (comma separated)
          </Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="h-11 border-stone-200 text-base focus-visible:ring-stone-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label className="text-xs tracking-widest text-stone-400 uppercase">Content</Label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      {/* Affiliate Links */}
      <div className="space-y-4">
        <Label className="text-xs tracking-widest text-stone-400 uppercase">
          Affiliate Products
        </Label>
        {affiliateLinks.map((link, i) => (
          <div
            key={i}
            className="relative space-y-3 rounded-xl border border-stone-200 bg-stone-50/50 p-4"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeAffiliateLink(i)}
              className="absolute top-3 right-3 h-8 w-8 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 gap-3 pr-10 md:grid-cols-2">
              <Input
                value={link.label}
                onChange={(e) => updateAffiliateLink(i, 'label', e.target.value)}
                placeholder="Product name"
                className="h-10 border-stone-200 bg-white text-sm focus-visible:ring-stone-300"
              />
              <Input
                value={link.price || ''}
                onChange={(e) => updateAffiliateLink(i, 'price', e.target.value)}
                placeholder="Price (e.g. $29.99)"
                className="h-10 border-stone-200 bg-white text-sm focus-visible:ring-stone-300"
              />
            </div>
            <Input
              value={link.url}
              onChange={(e) => updateAffiliateLink(i, 'url', e.target.value)}
              placeholder="Affiliate URL (https://...)"
              className="h-10 border-stone-200 bg-white text-sm focus-visible:ring-stone-300"
            />
            <Input
              value={link.image || ''}
              onChange={(e) => updateAffiliateLink(i, 'image', e.target.value)}
              placeholder="Product image URL (https://...)"
              className="h-10 border-stone-200 bg-white text-sm focus-visible:ring-stone-300"
            />
            {link.image && (
              <div className="relative h-20 w-20">
                <Image
                  src={link.image}
                  alt={link.label}
                  fill
                  sizes="80px"
                  className="rounded-lg border border-stone-100 object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAffiliateLink}
          className="rounded-lg text-sm text-stone-500"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Published & Trending */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-stone-800 focus:ring-stone-300"
          />
          <Label htmlFor="published" className="cursor-pointer text-base text-stone-600">
            Publish this post
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_trending"
            checked={isTrending}
            onChange={(e) => setIsTrending(e.target.checked)}
            className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-300"
          />
          <Label htmlFor="is_trending" className="cursor-pointer text-base text-stone-600">
            Mark as Trending
          </Label>
        </div>
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
          ) : post ? (
            'Update Post'
          ) : (
            'Create Post'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
          className="h-11 rounded-lg text-sm text-stone-500"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
