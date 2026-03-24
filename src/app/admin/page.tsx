"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllPosts, deletePost } from "@/lib/db";
import { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PenSquare,
  Trash2,
  Plus,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch {
      // Supabase not configured
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete post.");
    } finally {
      setDeleting(null);
    }
  }

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide text-stone-800">
            Dashboard
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Manage your blog posts
          </p>
        </div>
        <Link href="/admin/create">
          <Button className="bg-stone-800 hover:bg-stone-700 text-white text-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
          <p className="text-xs tracking-wider uppercase text-stone-400 mb-1">
            Total Posts
          </p>
          <p className="text-2xl font-light text-stone-800">{posts.length}</p>
        </div>
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
          <p className="text-xs tracking-wider uppercase text-stone-400 mb-1">
            Published
          </p>
          <p className="text-2xl font-light text-stone-800">{publishedCount}</p>
        </div>
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
          <p className="text-xs tracking-wider uppercase text-stone-400 mb-1">
            Drafts
          </p>
          <p className="text-2xl font-light text-stone-800">
            {posts.length - publishedCount}
          </p>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400 mx-auto" />
          <p className="text-stone-400 text-sm mt-2">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <FileText className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-400 text-sm mb-1">No posts yet</p>
          <p className="text-stone-300 text-xs mb-4">
            Create your first blog post to get started.
          </p>
          <Link href="/admin/create">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-stone-500"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-100 hover:bg-stone-100/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt=""
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-stone-700 truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] tracking-wider uppercase font-normal"
                    >
                      {post.category.replace(/-/g, " ")}
                    </Badge>
                    {post.published ? (
                      <span className="flex items-center gap-1 text-[10px] text-green-600">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-stone-400">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                    <span className="text-[10px] text-stone-300">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-4">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-400 hover:text-blue-600"
                    title="View post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Link href={`/admin/edit/${post.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-400 hover:text-stone-700"
                    title="Edit post"
                  >
                    <PenSquare className="w-4 h-4" />
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
