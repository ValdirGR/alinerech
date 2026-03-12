'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { SectionKey, SiteSectionRecord } from '@/lib/content/types';

export function usePublishedSection<TContent>(params: {
  sectionKey: SectionKey;
  fallback: TContent;
  normalize: (value: unknown) => TContent;
  initialContent?: TContent;
}) {
  const [content, setContent] = useState<TContent>(params.initialContent ?? params.fallback);
  const [record, setRecord] = useState<SiteSectionRecord<TContent> | null>(null);

  useEffect(() => {
    // Skip client-side fetch when content was already provided by the server
    if (params.initialContent) {
      return;
    }

    let isMounted = true;
    const supabase = createClient();

    const loadSection = async () => {
      const { data, error } = await supabase
        .from('site_sections')
        .select('id, section_key, status, version, content, is_current, published_at, updated_at')
        .eq('section_key', params.sectionKey)
        .eq('status', 'published')
        .eq('is_current', true)
        .maybeSingle();

      if (!isMounted || error || !data) {
        return;
      }

      const normalizedContent = params.normalize(data.content);

      setContent(normalizedContent);
      setRecord({
        id: data.id,
        sectionKey: data.section_key as SectionKey,
        status: data.status,
        version: data.version,
        content: normalizedContent,
        isCurrent: data.is_current,
        publishedAt: data.published_at,
        updatedAt: data.updated_at,
      });
    };

    void loadSection();

    return () => {
      isMounted = false;
    };
  }, [params]);

  return { content, record };
}