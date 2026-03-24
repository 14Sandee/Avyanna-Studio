import Link from "next/link";
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-stone-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl tracking-[0.25em] font-light text-white uppercase mb-4">
              Avyanna Studio
            </h3>
            <p className="text-base text-stone-400 leading-relaxed">
              Curating beauty, style, and intentional living. Your destination for aesthetic inspiration.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm tracking-[0.15em] uppercase text-stone-500 mb-5">Explore</h4>
            <div className="flex flex-col gap-3">
              <Link href="/blog" className="text-base text-stone-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/blog?category=fashion" className="text-base text-stone-400 hover:text-white transition-colors">
                Fashion
              </Link>
              <Link href="/blog?category=beauty" className="text-base text-stone-400 hover:text-white transition-colors">
                Beauty
              </Link>
              <Link href="/blog?category=lifestyle" className="text-base text-stone-400 hover:text-white transition-colors">
                Lifestyle
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm tracking-[0.15em] uppercase text-stone-500 mb-5">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://pin.it/4HEUB8kyH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-all"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center">
          <p className="text-sm text-stone-500 tracking-wide">
            &copy; {new Date().getFullYear()} Avyanna Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
