---
name: rsc-patterns
description: Load when deciding between server and client components, working with RSC data fetching, streaming, or Suspense.
---

## Overview

React Server Components (RSC) patterns for Next.js App Router. Covers the server/client decision tree, composition patterns, data fetching, streaming with Suspense, and minimizing the client bundle.

## Core Patterns

### Server vs Client Decision Tree

```
Does this component need...
│
├─ Event handlers (onClick, onChange, onSubmit)?
│   └─ YES → Client Component
│
├─ useState, useEffect, useReducer, useRef?
│   └─ YES → Client Component
│
├─ Browser APIs (localStorage, window, navigator)?
│   └─ YES → Client Component
│
├─ Context providers that use state?
│   └─ YES → Client Component
│
└─ None of the above?
    └─ Server Component (default — no directive needed)
```

### Composition: Push Client Boundary Down

```tsx
// BAD — entire page is client
'use client';
export default function ProductPage({ id }) {
  const [qty, setQty] = useState(1);
  return (
    <div>
      <ProductDetails id={id} />    {/* This could be server! */}
      <ProductReviews id={id} />    {/* This could be server! */}
      <AddToCart qty={qty} setQty={setQty} />
    </div>
  );
}

// GOOD — only interactive part is client
// ProductPage.tsx (Server Component — no directive)
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return (
    <div>
      <ProductDetails product={product} />   {/* Server */}
      <ProductReviews productId={product.id} /> {/* Server */}
      <AddToCartButton productId={product.id} /> {/* Client */}
    </div>
  );
}

// AddToCartButton.tsx
'use client';
export function AddToCartButton({ productId }) {
  const [qty, setQty] = useState(1);
  return <button onClick={() => addToCart(productId, qty)}>Add</button>;
}
```

### Passing Server Components as Children

```tsx
// Client component that accepts server component children
'use client';
export function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
}

// Server component passes server content through
export default async function Page() {
  const data = await fetchData();
  return (
    <Modal isOpen={true}>
      <ServerRenderedContent data={data} />  {/* Still server-rendered! */}
    </Modal>
  );
}
```

### Data Fetching in Server Components

```tsx
// Direct fetch — no hooks needed
export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return <UserTable users={users} />;
}
```

### Streaming with Suspense

```tsx
export default function DashboardPage() {
  return (
    <div>
      {/* Renders immediately */}
      <h1>Dashboard</h1>

      {/* Streams in when data is ready */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentTransactions />
      </Suspense>
    </div>
  );
}

// Each component fetches independently — no waterfall
async function RevenueChart() {
  const data = await getRevenueData(); // Slow query — streams in
  return <Chart data={data} />;
}
```

### Parallel Data Fetching

```tsx
// BAD — sequential waterfall
export default async function Page() {
  const user = await getUser();        // 200ms
  const posts = await getPosts();      // 300ms
  const comments = await getComments(); // 150ms
  // Total: 650ms
}

// GOOD — parallel
export default async function Page() {
  const [user, posts, comments] = await Promise.all([
    getUser(),        // 200ms
    getPosts(),       // 300ms
    getComments(),    // 150ms
  ]);
  // Total: 300ms
}
```

### Server-Only Code

```typescript
// lib/server-only.ts
import 'server-only'; // Throws error if imported in client component

export async function getSecretData() {
  return db.secrets.findMany();
}
```

## Common Mistakes

- **Adding `'use client'` to a whole page** — only the interactive leaf components need it
- **Fetching data in client components when it could be server** — server fetches are faster and don't ship JS
- **Importing server-only modules in client components** — use `import 'server-only'` to catch this
- **Sequential fetches in server components** — use `Promise.all` for independent data
- **Not using Suspense for slow data** — wrap slow async components in Suspense for streaming
- **Passing functions as props across the boundary** — functions can't be serialized from server to client
- **Using `useEffect` for data fetching** — in server components, just `await` directly

## Checklist

- [ ] Default to server components — `'use client'` only where needed
- [ ] Interactive parts pushed to smallest possible client components
- [ ] No data fetching in `useEffect` that could be done server-side
- [ ] Independent data fetches use `Promise.all`
- [ ] Slow data wrapped in `Suspense` with skeleton fallbacks
- [ ] `server-only` package used for sensitive server code
- [ ] No functions or non-serializable values passed server → client
- [ ] Client bundle size minimized — check with `next build`
