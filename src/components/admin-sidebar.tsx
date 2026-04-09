'use client';

import { LayoutDashboard, PenSquare, LogOut, Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/create', label: 'New Post', icon: PenSquare },
];

const SidebarContent = ({
  pathname,
  onSignOut,
  onLinkClick,
}: {
  pathname: string;
  onSignOut: () => void;
  onLinkClick?: () => void;
}) => {
  return (
    <>
      {/* Header */}
      <div className="border-b border-stone-100 p-6">
        <h2 className="text-sm font-light tracking-[0.2em] text-stone-700 uppercase">
          Avyanna Studio
        </h2>
        <p className="mt-1 text-xs tracking-wider text-stone-300 uppercase">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive =
            pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-all duration-200 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md shadow-stone-300/30'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}

        <div className="mt-4 border-t border-stone-100 pt-4">
          <Link
            href="/"
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-stone-400 transition-all hover:bg-stone-50 hover:text-stone-600"
          >
            <Globe className="h-5 w-5" />
            View Site
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-stone-100 p-4">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-base text-stone-400 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </>
  );
};

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/admin/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-64 flex-col border-r border-stone-100 bg-white md:flex">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-stone-100 bg-white/90 px-4 backdrop-blur-xl md:hidden">
        <h2 className="text-sm font-light tracking-[0.2em] text-stone-700 uppercase">Admin</h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 transition-colors hover:bg-stone-50"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-stone-600" />
          ) : (
            <Menu className="h-5 w-5 text-stone-600" />
          )}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 flex h-full w-[280px] flex-col bg-white shadow-2xl">
            <SidebarContent
              pathname={pathname}
              onSignOut={handleSignOut}
              onLinkClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
