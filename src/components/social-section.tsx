function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import Image from "next/image";
import { Button } from "@/components/ui/button";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

const pinterestPins = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
];

const instagramPosts = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80",
];

export function PinterestSection() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-50/50 mb-4">
          <PinterestIcon className="w-4 h-4 text-red-400" />
          <span className="text-sm tracking-[0.1em] uppercase text-red-400 font-light">
            Pinterest
          </span>
        </div>
        <h2 className="text-2xl font-light tracking-wide text-stone-700">
          Inspiration Board
        </h2>
        <p className="text-base text-stone-400 mt-2">Curated aesthetic picks for your journey</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pinterestPins.map((pin, i) => (
          <a
            key={i}
            href="https://pin.it/4HEUB8kyH"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-1"
          >
            <Image
              src={pin}
              alt="Pinterest inspiration"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm">
                <PinterestIcon className="w-4 h-4 text-red-500" />
                <span className="text-sm text-stone-700">Save Pin</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="text-center mt-8">
        <a href="https://pin.it/4HEUB8kyH" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="text-sm font-normal text-stone-500 border-stone-200 px-6 py-5 rounded-xl hover:shadow-md transition-all">
            View Pinterest Profile
          </Button>
        </a>
      </div>
    </section>
  );
}

export function InstagramSection() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-pink-50/50 mb-4">
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span className="text-sm tracking-[0.1em] uppercase text-pink-400 font-light">
            Instagram
          </span>
        </div>
        <h2 className="text-2xl font-light tracking-wide text-stone-700">
          Follow Along
        </h2>
        <p className="text-base text-stone-400 mt-2">@avyannastudio</p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {instagramPosts.map((post, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl aspect-square shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-0.5"
          >
            <Image
              src={post}
              alt="Instagram post"
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <InstagramIcon className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          </a>
        ))}
      </div>
      <div className="text-center mt-8">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="text-sm font-normal text-stone-500 border-stone-200 px-6 py-5 rounded-xl hover:shadow-md transition-all">
            Follow @avyannastudio
          </Button>
        </a>
      </div>
    </section>
  );
}
