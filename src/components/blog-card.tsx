import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-white border border-stone-100 hover:shadow-xl hover:shadow-stone-200/40 transition-all duration-500 hover:-translate-y-1">
        {/* Cover image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            unoptimized={!post.cover_image.includes('unsplash') && !post.cover_image.includes('supabase')}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-md text-stone-600 text-[10px] tracking-[0.12em] uppercase font-normal px-3 py-1 rounded-full shadow-sm"
            >
              {post.category.replace(/-/g, " ")}
            </Badge>
          </div>
          {/* Arrow indicator */}
          <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-700" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-[15px] font-medium text-stone-800 leading-snug group-hover:text-stone-600 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2.5 text-[13px] text-stone-400 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-stone-300 tracking-wider uppercase">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <span className="text-[11px] tracking-[0.1em] uppercase text-stone-400 group-hover:text-stone-600 transition-colors">
              Read more
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
