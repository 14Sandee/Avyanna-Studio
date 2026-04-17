import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/types';

export const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/40">
        {/* Cover image */}
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized={
              !post.cover_image.includes('unsplash') && !post.cover_image.includes('supabase')
            }
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute top-4 left-4 flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-normal tracking-[0.12em] text-stone-600 uppercase shadow-sm backdrop-blur-md"
            >
              {post.category.replace(/-/g, ' ')}
            </Badge>
            {post.platform && (
              <Badge
                className={`rounded-full px-2.5 py-1 text-[10px] font-normal tracking-[0.08em] uppercase shadow-sm backdrop-blur-md ${
                  post.platform === 'amazon'
                    ? 'bg-orange-500/90 text-white'
                    : post.platform === 'myntra'
                      ? 'bg-pink-500/90 text-white'
                      : post.platform === 'flipkart'
                        ? 'bg-blue-500/90 text-white'
                        : post.platform === 'ajio'
                          ? 'bg-purple-500/90 text-white'
                          : post.platform === 'nykaa'
                            ? 'bg-rose-400/90 text-white'
                            : 'bg-stone-500/90 text-white'
                }`}
              >
                {post.platform}
              </Badge>
            )}
          </div>
          {/* Arrow indicator */}
          <div className="absolute right-4 bottom-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-3.5 w-3.5 text-stone-700" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="line-clamp-2 text-[15px] leading-snug font-medium text-stone-800 transition-colors duration-300 group-hover:text-stone-600">
            {post.title}
          </h3>
          <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-stone-400">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] tracking-wider text-stone-300 uppercase">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <span className="text-[11px] tracking-widest text-stone-400 uppercase transition-colors group-hover:text-stone-600">
              Read more
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
