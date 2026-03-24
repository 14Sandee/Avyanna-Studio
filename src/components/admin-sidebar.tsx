"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/create", label: "New Post", icon: PenSquare },
];

function SidebarContent({
  pathname,
  onSignOut,
  onLinkClick,
}: {
  pathname: string;
  onSignOut: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-stone-100">
        <h2 className="text-sm tracking-[0.2em] font-light text-stone-700 uppercase">
          Avyanna Studio
        </h2>
        <p className="text-xs tracking-wider text-stone-300 uppercase mt-1">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                isActive
                  ? "bg-stone-900 text-white shadow-md shadow-stone-300/30"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-stone-100 mt-4">
          <Link
            href="/"
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-all"
          >
            <Globe className="w-5 h-5" />
            View Site
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-100">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-base text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 min-h-screen bg-white border-r border-stone-100 hidden md:flex flex-col">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-stone-100 px-4 h-14 flex items-center justify-between">
        <h2 className="text-sm tracking-[0.2em] font-light text-stone-700 uppercase">
          Admin
        </h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-stone-50 transition-colors"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-stone-600" />
          ) : (
            <Menu className="w-5 h-5 text-stone-600" />
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
          <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col">
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
}
