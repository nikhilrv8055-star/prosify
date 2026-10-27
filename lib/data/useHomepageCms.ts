'use client';

import { useState, useEffect } from 'react';
import { CmsSectionConfig } from '@/lib/data/serverStore';

const STORAGE_KEY = 'prosify_homepage_cms';

export function useHomepageCms() {
  const [sections, setSections] = useState<Record<string, CmsSectionConfig>>({});

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CmsSectionConfig[] = JSON.parse(raw);
        const map: Record<string, CmsSectionConfig> = {};
        parsed.forEach((s) => {
          map[s.id] = s;
        });
        setSections(map);
      }
    } catch {}
  };

  const fetchLive = () => {
    fetch('/api/cms/homepage', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.sections && Array.isArray(data.sections)) {
          const map: Record<string, CmsSectionConfig> = {};
          data.sections.forEach((s: CmsSectionConfig) => {
            map[s.id] = s;
          });
          setSections(map);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.sections));
          } catch {}
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadFromStorage();
    fetchLive();

    const handleUpdate = () => {
      loadFromStorage();
    };

    window.addEventListener('prosify_cms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('prosify_cms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getSection = (id: string, defaultTitle: string, defaultSubtitle: string): { title: string; subtitle: string; isEnabled: boolean } => {
    const sec = sections[id];
    if (!sec) {
      return { title: defaultTitle, subtitle: defaultSubtitle, isEnabled: true };
    }
    return {
      title: sec.title || defaultTitle,
      subtitle: sec.subtitle || defaultSubtitle,
      isEnabled: sec.isEnabled !== undefined ? sec.isEnabled : true,
    };
  };

  return { sections, getSection };
}
