import type { BlogPost } from '@/lib/types';

import { BlogCard } from './blog-card';

export const BlogGrid = ({ posts }: { posts: BlogPost[] }) => {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm tracking-wide text-stone-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};
