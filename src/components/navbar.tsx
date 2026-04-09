'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/admin', label: 'Studio' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-stone-100/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <Link href="/" className="flex flex-col">
              <span className="text-base font-light tracking-[0.25em] text-stone-800 uppercase">
                Avyanna
              </span>
              <span className="-mt-0.5 text-[9px] tracking-[0.35em] text-stone-400 uppercase">
                Studio
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-[15px] tracking-[0.05em] text-stone-500 transition-all duration-200 hover:bg-stone-50 hover:text-stone-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-lg p-2 transition-colors hover:bg-stone-50 md:hidden"
            >
              {open ? (
                <X className="h-6 w-6 text-stone-600" />
              ) : (
                <Menu className="h-6 w-6 text-stone-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Menu panel */}
          <div className="absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl">
            <div className="px-8 pt-24">
              <div className="mb-8">
                <span className="text-base font-light tracking-[0.25em] text-stone-800 uppercase">
                  Avyanna Studio
                </span>
                <div className="mt-3 h-[1px] w-8 bg-stone-200" />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-stone-50 py-4 text-lg tracking-wide text-stone-600 transition-colors hover:text-stone-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
