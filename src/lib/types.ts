export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  affiliate_links: AffiliateLink[];
  excerpt: string;
  published: boolean;
  is_trending: boolean;
  platform: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateLink {
  label: string;
  url: string;
  image?: string;
  price?: string;
}

export interface Category {
  name: string;
  slug: string;
}

export interface DynamicSection {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  is_visible: boolean;
  post_ids: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}
