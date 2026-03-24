"use client";

import { useState, useEffect, use } from "react";
import { PostForm } from "@/components/post-form";
import { getPostById } from "@/lib/db";
import { BlogPost } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch {
        // Post not found
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 text-sm">Post not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-800">
          Edit Post
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Update &ldquo;{post.title}&rdquo;
        </p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
