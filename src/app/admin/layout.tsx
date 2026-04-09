'use client';

import { usePathname } from 'next/navigation';

import { AdminSidebar } from '@/components/admin-sidebar';
import { AuthGuard } from '@/components/auth-guard';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-stone-50/50">
        <AdminSidebar />
        <div className="flex-1 p-4 pt-18 md:p-10 md:pt-10">{children}</div>
      </div>
    </AuthGuard>
  );
};

export default AdminLayout;
