"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createPost, updatePost, uploadImage } from "@/lib/db";
import { BlogPost, AffiliateLink } from "@/lib/types";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";

interface PostFormProps {
  post?: BlogPost;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [category, setCategory] = useState(post?.category ?? "lifestyle");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(
    post?.affiliate_links ?? [{ label: "", url: "" }]
  );

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!post) {
      setSlug(generateSlug(value));
    }
  }

  function addAffiliateLink() {
    setAffiliateLinks([...affiliateLinks, { label: "", url: "", image: "", price: "" }]);
  }

  function removeAffiliateLink(index: number) {
    setAffiliateLinks(affiliateLinks.filter((_, i) => i !== index));
  }

  function updateAffiliateLink(index: number, field: keyof AffiliateLink, value: string) {
    const updated = [...affiliateLinks];
    updated[index] = { ...updated[index], [field]: value };
    setAffiliateLinks(updated);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      alert("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const postData = {
      title,
      slug,
      content,
      cover_image: coverImage,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      affiliate_links: affiliateLinks.filter((l) => l.label && l.url),
      excerpt,
      published,
    };

    try {
      if (post) {
        await updatePost(post.id, postData);
      } else {
        await createPost(postData);
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      alert("Failed to save post. Please check your Supabase connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
            Title
          </Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter post title"
            className="h-11 text-base border-stone-200 focus-visible:ring-stone-300"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
            Slug
          </Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            className="h-11 text-base border-stone-200 focus-visible:ring-stone-300"
            required
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
          Cover Image
        </Label>
        <div className="flex gap-3">
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Image URL or upload"
            className="h-11 text-base border-stone-200 focus-visible:ring-stone-300"
          />
          <label className="cursor-pointer shrink-0">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center h-11 w-11 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
              ) : (
                <Upload className="w-4 h-4 text-stone-400" />
              )}
            </span>
          </label>
        </div>
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover preview"
            className="w-full max-h-48 object-cover rounded-xl mt-3 border border-stone-100"
          />
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
          Excerpt
        </Label>
        <Textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description for blog cards"
          className="text-base border-stone-200 focus-visible:ring-stone-300 resize-none"
          rows={2}
        />
      </div>

      {/* Category & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
            Category
          </Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 border border-stone-200 rounded-lg px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
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
          <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
            Tags (comma separated)
          </Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="h-11 text-base border-stone-200 focus-visible:ring-stone-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
          Content
        </Label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      {/* Affiliate Links */}
      <div className="space-y-4">
        <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
          Affiliate Products
        </Label>
        {affiliateLinks.map((link, i) => (
          <div key={i} className="relative border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50/50">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeAffiliateLink(i)}
              className="absolute top-3 right-3 h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
              <Input
                value={link.label}
                onChange={(e) => updateAffiliateLink(i, "label", e.target.value)}
                placeholder="Product name"
                className="h-10 text-sm border-stone-200 focus-visible:ring-stone-300 bg-white"
              />
              <Input
                value={link.price || ""}
                onChange={(e) => updateAffiliateLink(i, "price", e.target.value)}
                placeholder="Price (e.g. $29.99)"
                className="h-10 text-sm border-stone-200 focus-visible:ring-stone-300 bg-white"
              />
            </div>
            <Input
              value={link.url}
              onChange={(e) => updateAffiliateLink(i, "url", e.target.value)}
              placeholder="Affiliate URL (https://...)"
              className="h-10 text-sm border-stone-200 focus-visible:ring-stone-300 bg-white"
            />
            <Input
              value={link.image || ""}
              onChange={(e) => updateAffiliateLink(i, "image", e.target.value)}
              placeholder="Product image URL (https://...)"
              className="h-10 text-sm border-stone-200 focus-visible:ring-stone-300 bg-white"
            />
            {link.image && (
              <img
                src={link.image}
                alt={link.label}
                className="w-20 h-20 object-cover rounded-lg border border-stone-100"
              />
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAffiliateLink}
          className="text-sm text-stone-500 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* Published */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 rounded border-stone-300 text-stone-800 focus:ring-stone-300"
        />
        <Label htmlFor="published" className="text-base text-stone-600 cursor-pointer">
          Publish this post
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-stone-100">
        <Button
          type="submit"
          disabled={saving}
          className="bg-stone-800 hover:bg-stone-700 text-white text-sm px-6 h-11 rounded-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : post ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          className="text-stone-500 text-sm h-11 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
