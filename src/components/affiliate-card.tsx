import { ExternalLink, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

import type { AffiliateLink } from '@/lib/types';

export const AffiliateCard = ({ links }: { links: AffiliateLink[] }) => {
  if (links.length === 0) return null;

  return (
    <div className="rounded-2xl border border-stone-100 bg-linear-to-b from-stone-50 to-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <ShoppingBag className="h-4 w-4 text-stone-400" />
        <h4 className="text-sm tracking-widest text-stone-400 uppercase">Shop This Post</h4>
      </div>
      <div className="flex flex-col gap-4">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group block overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-300 hover:border-stone-300 hover:shadow-lg"
          >
            {/* Product image */}
            {link.image && (
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={link.image}
                  alt={link.label}
                  fill
                  sizes="300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
            )}

            {/* Product info */}
            <div className="p-4">
              <p className="text-sm leading-snug font-medium text-stone-700 transition-colors group-hover:text-stone-900">
                {link.label}
              </p>
              {link.price && <p className="mt-1 text-sm text-stone-500">{link.price}</p>}
              <div className="mt-3 flex items-center gap-1.5 text-xs tracking-wider text-stone-400 uppercase transition-colors group-hover:text-stone-700">
                <span>Shop Now</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
