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
