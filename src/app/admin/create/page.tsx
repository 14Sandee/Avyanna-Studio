'use client';

import { PostForm } from '@/components/post-form';

const CreatePostPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-800">Create Post</h1>
        <p className="mt-1 text-sm text-stone-400">Write a new blog post</p>
      </div>
      <PostForm />
    </div>
  );
};

export default CreatePostPage;
