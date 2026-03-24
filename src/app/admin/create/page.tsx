"use client";

import { PostForm } from "@/components/post-form";

export default function CreatePostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-800">
          Create Post
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Write a new blog post
        </p>
      </div>
      <PostForm />
    </div>
  );
}
