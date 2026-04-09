import { supabase } from './supabase';
import type { BlogPost } from './types';

// --- Blog CRUD ---

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();

  if (error) return null;
  return data;
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

  if (error) return null;
  return data;
};

export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const getRelatedPosts = async (
  currentSlug: string,
  category: string,
  limit = 3,
): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .neq('slug', currentSlug)
    .limit(limit);

  if (error) throw error;
  return data ?? [];
};

export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const createPost = async (
  post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>,
): Promise<BlogPost> => {
  const { data, error } = await supabase.from('posts').insert(post).select().single();

  if (error) throw error;
  return data;
};

export const updatePost = async (
  id: string,
  post: Partial<Omit<BlogPost, 'id' | 'created_at'>>,
): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
};

// --- Categories ---

export const getCategories = async (): Promise<{ name: string; slug: string; count: number }[]> => {
  const { data, error } = await supabase.from('posts').select('category').eq('published', true);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }

  return Object.entries(counts).map(([slug, count]) => ({
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    slug,
    count,
  }));
};

// --- Image Upload ---

export const uploadImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
};
