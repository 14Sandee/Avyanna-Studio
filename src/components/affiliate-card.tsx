import Image from "next/image";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { AffiliateLink } from "@/lib/types";

export function AffiliateCard({ links }: { links: AffiliateLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-stone-50 to-white rounded-2xl p-6 border border-stone-100 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <ShoppingBag className="w-4 h-4 text-stone-400" />
        <h4 className="text-sm tracking-[0.1em] uppercase text-stone-400">
          Shop This Post
        </h4>
      </div>
      <div className="flex flex-col gap-4">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group block rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all duration-300"
          >
            {/* Product image */}
            {link.image && (
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={link.image}
                  alt={link.label}
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            )}

            {/* Product info */}
            <div className="p-4">
              <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors leading-snug">
                {link.label}
              </p>
              {link.price && (
                <p className="text-sm text-stone-500 mt-1">{link.price}</p>
              )}
              <div className="flex items-center gap-1.5 mt-3 text-xs tracking-wider uppercase text-stone-400 group-hover:text-stone-700 transition-colors">
                <span>Shop Now</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
