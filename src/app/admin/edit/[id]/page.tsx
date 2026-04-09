'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect, use } from 'react';

import { PostForm } from '@/components/post-form';
import { getPostById } from '@/lib/db';
import type { BlogPost } from '@/lib/types';

const EditPostPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch {
        // Post not found
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-stone-400">Post not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-800">Edit Post</h1>
        <p className="mt-1 text-sm text-stone-400">Update &ldquo;{post.title}&rdquo;</p>
      </div>
      <PostForm post={post} />
    </div>
  );
};

export default EditPostPage;
