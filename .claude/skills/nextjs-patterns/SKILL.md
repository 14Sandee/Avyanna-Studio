---
name: nextjs-patterns
description: Load when working with Next.js App Router, layouts, routing, server actions, metadata, or middleware.
---

## Overview

Patterns and best practices for Next.js 14+ App Router development. Covers file-based routing, nested layouts, data fetching, server actions, metadata API, route handlers, and middleware.

## Core Patterns

### File-Based Routing

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI (wraps page in Suspense)
├── error.tsx           # Error boundary ('use client' required)
├── not-found.tsx       # 404 UI
├── dashboard/
│   ├── layout.tsx      # Dashboard layout (persistent sidebar)
│   ├── page.tsx        # /dashboard
│   └── settings/
│       └── page.tsx    # /dashboard/settings
├── (marketing)/        # Route group — no URL segment
│   ├── about/page.tsx  # /about
│   └── blog/page.tsx   # /blog
└── api/
    └── users/
        └── route.ts    # API route handler
```

### Layouts

```tsx
// app/dashboard/layout.tsx — persists across dashboard pages
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

- Layouts don't re-render on navigation — state is preserved
- Use `template.tsx` instead if you need re-mounting on every navigation
- Root layout must include `<html>` and `<body>` tags

### Server Actions

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({ title: z.string().min(1).max(200) });

export async function createPost(formData: FormData) {
  const parsed = schema.safeParse({ title: formData.get('title') });
  if (!parsed.success) return { error: parsed.error.flatten() };

  await db.posts.create({ data: parsed.data });
  revalidatePath('/posts');
}

// In component
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

### Metadata API

```tsx
// Static
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your dashboard',
};

// Dynamic
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    openGraph: { images: [post.image] },
  };
}
```

### Route Handlers

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ?? '1';
  const users = await getUsers(parseInt(page));
  return NextResponse.json({ data: users });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json({ data: user }, { status: 201 });
}
```

### Middleware

```typescript
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### Data Fetching in Server Components

```tsx
// Direct async/await — no useEffect needed
export default async function PostsPage() {
  const posts = await db.posts.findMany();
  return <PostList posts={posts} />;
}

// With Suspense for streaming
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />  {/* Streams in when ready */}
      </Suspense>
    </div>
  );
}
```

## Common Mistakes

- **Using `useEffect` for data fetching in server components** — fetch directly with async/await
- **Forgetting `'use client'` on error.tsx** — error boundaries must be client components
- **Putting all components in a single layout** — use nested layouts for different sections
- **Using `router.push` for simple links** — use `<Link>` for static navigation
- **Not validating server action input** — always validate with Zod
- **Hardcoding metadata** — use `generateMetadata` for dynamic pages
- **Massive middleware** — keep middleware light, it runs on every matched request

## Checklist

- [ ] Pages are server components by default
- [ ] Layouts used for persistent shared UI
- [ ] Route groups organize without affecting URLs
- [ ] Server actions validate input with Zod
- [ ] `revalidatePath`/`revalidateTag` called after mutations
- [ ] Metadata set for all public-facing pages
- [ ] Loading and error states defined for key routes
- [ ] Middleware is lean and only matches needed paths
