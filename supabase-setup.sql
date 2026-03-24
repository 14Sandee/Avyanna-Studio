-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create posts table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null default '',
  cover_image text not null default '',
  category text not null default 'lifestyle',
  tags text[] default '{}',
  affiliate_links jsonb default '[]',
  excerpt text not null default '',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table posts enable row level security;

-- 3. Public can read published posts
create policy "Public can read published posts"
  on posts for select
  using (published = true);

-- 4. Authenticated users can do everything (admin)
create policy "Authenticated users full access"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 5. Allow anon to read all for the blog (simpler policy)
-- If you want fully public reads regardless of published status for admin preview:
create policy "Anon can read all posts"
  on posts for select
  to anon
  using (true);

-- 6. Allow anon insert/update/delete (for simple admin without auth initially)
-- IMPORTANT: Remove these policies once you add proper auth!
create policy "Anon can insert posts"
  on posts for insert
  to anon
  with check (true);

create policy "Anon can update posts"
  on posts for update
  to anon
  using (true)
  with check (true);

create policy "Anon can delete posts"
  on posts for delete
  to anon
  using (true);

-- 7. Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- 8. Allow public access to images bucket
create policy "Public image access"
  on storage.objects for select
  to anon
  using (bucket_id = 'images');

create policy "Anyone can upload images"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'images');

-- 9. Seed some demo blog posts
insert into posts (title, slug, content, cover_image, category, tags, affiliate_links, excerpt, published) values
(
  'The Art of Minimalist Fashion: Capsule Wardrobe Essentials',
  'minimalist-fashion-capsule-wardrobe',
  '<p>Building a capsule wardrobe is the ultimate expression of intentional living. It''s about curating a collection of timeless pieces that effortlessly mix and match, creating endless outfit possibilities with fewer items.</p><h2>Why Go Minimal?</h2><p>A minimalist wardrobe saves time, reduces decision fatigue, and ensures you always look polished. The key is investing in quality over quantity — pieces that last seasons, not weeks.</p><h2>The Essential Pieces</h2><p>Start with a neutral color palette: crisp whites, soft beiges, classic blacks, and warm taupes.</p><ul><li>A well-fitted blazer in a neutral tone</li><li>Classic straight-leg jeans in dark wash</li><li>White cotton button-down shirt</li><li>Cashmere crew-neck sweater</li><li>Tailored trousers</li><li>Little black dress</li><li>Quality leather accessories</li></ul>',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
  'fashion',
  ARRAY['minimalism', 'capsule wardrobe', 'fashion tips'],
  '[{"label": "Shop Classic Blazer", "url": "#"}, {"label": "View Cashmere Collection", "url": "#"}]'::jsonb,
  'Build a timeless capsule wardrobe with these essential pieces that mix and match effortlessly.',
  true
),
(
  'Morning Rituals: Creating a Peaceful Start to Your Day',
  'morning-rituals-peaceful-start',
  '<p>How you start your morning sets the tone for your entire day. Creating intentional morning rituals can transform not just your productivity, but your overall well-being.</p><h2>The Golden Hour</h2><p>The first hour after waking is sacred. Before reaching for your phone, take a moment to breathe deeply and set your intentions for the day ahead.</p><h2>A Simple Morning Routine</h2><ul><li>Wake up at a consistent time</li><li>Hydrate with warm lemon water</li><li>10 minutes of meditation or journaling</li><li>Light stretching or yoga</li><li>Nourishing breakfast</li><li>Review your top 3 priorities</li></ul>',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  'lifestyle',
  ARRAY['morning routine', 'wellness', 'productivity'],
  '[{"label": "Shop Meditation Cushion", "url": "#"}, {"label": "View Journal Collection", "url": "#"}]'::jsonb,
  'Transform your mornings with intentional rituals that nurture your mind, body, and spirit.',
  true
),
(
  'Clean Beauty Essentials: A Guide to Non-Toxic Skincare',
  'clean-beauty-non-toxic-skincare',
  '<p>The clean beauty movement is more than a trend — it''s a commitment to putting only the best ingredients on your skin.</p><h2>What is Clean Beauty?</h2><p>Clean beauty refers to products made without ingredients shown or suspected to be harmful. This includes parabens, sulfates, phthalates, and synthetic fragrances.</p><h2>Building Your Clean Routine</h2><ul><li>Gentle cleanser with natural surfactants</li><li>Hydrating toner with rose water</li><li>Vitamin C serum for brightening</li><li>Lightweight moisturizer with hyaluronic acid</li><li>Mineral sunscreen (SPF 30+)</li></ul>',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
  'beauty',
  ARRAY['clean beauty', 'skincare', 'non-toxic'],
  '[{"label": "Shop Clean Skincare Set", "url": "#"}, {"label": "View Vitamin C Serums", "url": "#"}]'::jsonb,
  'Discover the essentials of clean, non-toxic skincare for a radiant, healthy complexion.',
  true
),
(
  'Creating a Cozy Home: Scandinavian-Inspired Decor Ideas',
  'cozy-home-scandinavian-decor',
  '<p>Scandinavian design embodies the perfect balance of beauty and functionality. With its emphasis on natural materials, clean lines, and warm textures, it creates spaces that feel both elegant and inviting.</p><h2>Key Principles</h2><p>Hygge — the Danish concept of cozy contentment — is at the heart of Scandinavian interiors.</p><h2>Essential Elements</h2><ul><li>Natural wood furniture in light tones</li><li>Linen and cotton textiles in neutral hues</li><li>Ceramic vases and handmade pottery</li><li>Warm ambient lighting with candles</li><li>Indoor plants for a touch of green</li></ul>',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
  'home-decor',
  ARRAY['home decor', 'scandinavian', 'minimalism'],
  '[{"label": "Shop Linen Throws", "url": "#"}, {"label": "View Ceramic Collection", "url": "#"}]'::jsonb,
  'Transform your space with Scandinavian-inspired decor that blends beauty with everyday comfort.',
  true
),
(
  'The Ultimate Self-Care Sunday Routine',
  'self-care-sunday-routine',
  '<p>Dedicating one day a week to self-care isn''t indulgent — it''s essential. A well-planned Sunday routine recharges your energy and prepares you for the week ahead.</p><h2>Your Self-Care Blueprint</h2><ul><li>Sleep in and enjoy a slow morning</li><li>Prepare a nourishing brunch</li><li>At-home spa treatment</li><li>Read a book or listen to a podcast</li><li>Gentle movement: yoga or a nature walk</li><li>Meal prep for the week</li><li>Set intentions and plan your week</li></ul>',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  'wellness',
  ARRAY['self-care', 'wellness', 'sunday routine'],
  '[{"label": "Shop Spa Set", "url": "#"}, {"label": "View Aromatherapy Collection", "url": "#"}]'::jsonb,
  'Recharge and reset with the ultimate self-care Sunday routine for mind, body, and soul.',
  true
),
(
  'Weekend Getaway: Hidden Gems for the Modern Traveler',
  'weekend-getaway-hidden-gems',
  '<p>You don''t need a two-week vacation to feel refreshed. Sometimes, a quick weekend escape to a lesser-known destination is all you need to reset and find inspiration.</p><h2>Planning the Perfect Getaway</h2><p>The best weekend trips are simple: a charming boutique hotel, a few local restaurants, and plenty of time to wander.</p><h2>What to Pack</h2><ul><li>A versatile carry-on bag</li><li>Comfortable walking shoes</li><li>A good book</li><li>Your favorite camera</li><li>A lightweight jacket</li></ul>',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  'travel',
  ARRAY['travel', 'weekend getaway', 'hidden gems'],
  '[{"label": "Shop Travel Essentials", "url": "#"}, {"label": "View Carry-On Bags", "url": "#"}]'::jsonb,
  'Discover charming hidden gems perfect for a rejuvenating weekend escape.',
  true
);
