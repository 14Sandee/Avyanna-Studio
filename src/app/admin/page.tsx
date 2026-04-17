'use client';

import {
  PenSquare,
  Trash2,
  Plus,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllPosts, deletePost } from '@/lib/db';
import type { BlogPost } from '@/lib/types';

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch {
      // Supabase not configured
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(id);
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete post.');
    } finally {
      setDeleting(null);
    }
  };

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wide text-stone-800">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-400">Manage your blog posts</p>
        </div>
        <Link href="/admin/create">
          <Button className="bg-stone-800 text-sm text-white hover:bg-stone-700">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-100 bg-stone-50 p-5">
          <p className="mb-1 text-xs tracking-wider text-stone-400 uppercase">Total Posts</p>
          <p className="text-2xl font-light text-stone-800">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-stone-100 bg-stone-50 p-5">
          <p className="mb-1 text-xs tracking-wider text-stone-400 uppercase">Published</p>
          <p className="text-2xl font-light text-stone-800">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-stone-100 bg-stone-50 p-5">
          <p className="mb-1 text-xs tracking-wider text-stone-400 uppercase">Drafts</p>
          <p className="text-2xl font-light text-stone-800">{posts.length - publishedCount}</p>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-stone-400" />
          <p className="mt-2 text-sm text-stone-400">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-20 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-stone-300" />
          <p className="mb-1 text-sm text-stone-400">No posts yet</p>
          <p className="mb-4 text-xs text-stone-300">Create your first blog post to get started.</p>
          <Link href="/admin/create">
            <Button variant="outline" size="sm" className="text-xs text-stone-500">
              <Plus className="mr-1 h-3 w-3" />
              Create Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-4 transition-colors hover:bg-stone-100/50"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                {post.cover_image && (
                  <Image
                    src={post.cover_image}
                    alt=""
                    width={48}
                    height={48}
                    className="shrink-0 rounded-md object-cover"
                    unoptimized
                  />
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-stone-700">{post.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-normal tracking-wider uppercase"
                    >
                      {post.category.replace(/-/g, ' ')}
                    </Badge>
                    {post.published ? (
                      <span className="flex items-center gap-1 text-[10px] text-green-600">
                        <Eye className="h-3 w-3" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-stone-400">
                        <EyeOff className="h-3 w-3" /> Draft
                      </span>
                    )}
                    {post.is_trending && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600">
                        <TrendingUp className="h-3 w-3" /> Trending
                      </span>
                    )}
                    {post.platform && (
                      <Badge
                        className={`text-[9px] font-normal tracking-wider uppercase ${
                          post.platform === 'amazon'
                            ? 'bg-orange-100 text-orange-600'
                            : post.platform === 'myntra'
                              ? 'bg-pink-100 text-pink-600'
                              : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {post.platform}
                      </Badge>
                    )}
                    <span className="text-[10px] text-stone-300">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-1">
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-400 hover:text-blue-600"
                    title="View post"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Link href={`/admin/edit/${post.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-400 hover:text-stone-700"
                    title="Edit post"
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-red-500"
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  title="Delete post"
                >
                  {deleting === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
