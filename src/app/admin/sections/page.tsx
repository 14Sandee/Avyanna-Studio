'use client';

import { Plus, Trash2, PenSquare, Eye, EyeOff, Loader2, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllSections, deleteSection, updateSection } from '@/lib/db';
import type { DynamicSection } from '@/lib/types';

const SectionsPage = () => {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await getAllSections();
      setSections(data);
    } catch {
      // Supabase not configured
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    setDeleting(id);
    try {
      await deleteSection(id);
      setSections(sections.filter((s) => s.id !== id));
    } catch {
      alert('Failed to delete section.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleVisibility = async (section: DynamicSection) => {
    setToggling(section.id);
    try {
      await updateSection(section.id, { is_visible: !section.is_visible });
      setSections(
        sections.map((s) => (s.id === section.id ? { ...s, is_visible: !s.is_visible } : s)),
      );
    } catch {
      alert('Failed to update section.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wide text-stone-800">Sections</h1>
          <p className="mt-1 text-sm text-stone-400">Manage dynamic homepage sections</p>
        </div>
        <Link href="/admin/sections/edit/new">
          <Button className="bg-stone-800 text-sm text-white hover:bg-stone-700">
            <Plus className="mr-2 h-4 w-4" />
            New Section
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-stone-400" />
          <p className="mt-2 text-sm text-stone-400">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-20 text-center">
          <LayoutGrid className="mx-auto mb-3 h-8 w-8 text-stone-300" />
          <p className="mb-1 text-sm text-stone-400">No sections yet</p>
          <p className="mb-4 text-xs text-stone-300">
            Create dynamic sections like &quot;Under $99&quot; or &quot;Editor&apos;s Picks&quot;
          </p>
          <Link href="/admin/sections/edit/new">
            <Button variant="outline" size="sm" className="text-xs text-stone-500">
              <Plus className="mr-1 h-3 w-3" />
              Create Section
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-4 transition-colors hover:bg-stone-100/50"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-stone-700">{section.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  {section.subtitle && (
                    <span className="text-[10px] text-stone-400">{section.subtitle}</span>
                  )}
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal tracking-wider uppercase"
                  >
                    {section.post_ids.length} posts
                  </Badge>
                  {section.is_visible ? (
                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                      <Eye className="h-3 w-3" /> Visible
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-stone-400">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </span>
                  )}
                  <span className="text-[10px] text-stone-300">Order: {section.display_order}</span>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-stone-700"
                  onClick={() => handleToggleVisibility(section)}
                  disabled={toggling === section.id}
                  title={section.is_visible ? 'Hide section' : 'Show section'}
                >
                  {toggling === section.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : section.is_visible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Link href={`/admin/sections/edit/${section.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-400 hover:text-stone-700"
                    title="Edit section"
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-red-500"
                  onClick={() => handleDelete(section.id)}
                  disabled={deleting === section.id}
                  title="Delete section"
                >
                  {deleting === section.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionsPage;
