"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/admin", label: "Studio" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex flex-col">
              <span className="text-base tracking-[0.25em] font-light text-stone-800 uppercase">
                Avyanna
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-stone-400 -mt-0.5">
                Studio
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[15px] tracking-[0.05em] text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-50 transition-colors"
            >
              {open ? (
                <X className="w-6 h-6 text-stone-600" />
              ) : (
                <Menu className="w-6 h-6 text-stone-600" />
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
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl">
            <div className="pt-24 px-8">
              <div className="mb-8">
                <span className="text-base tracking-[0.25em] font-light text-stone-800 uppercase">
                  Avyanna Studio
                </span>
                <div className="w-8 h-[1px] bg-stone-200 mt-3" />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-lg tracking-wide text-stone-600 hover:text-stone-900 border-b border-stone-50 transition-colors"
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
}
