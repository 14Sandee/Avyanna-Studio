"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const user = await getUser();
        if (!user) {
          router.replace("/admin/login");
        } else {
          setAuthenticated(true);
        }
      } catch {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    if (pathname === "/admin/login") {
      setLoading(false);
      setAuthenticated(true);
    } else {
      check();
    }
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400 mx-auto mb-3" />
          <p className="text-xs tracking-[0.15em] uppercase text-stone-400">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
