/**
 * docs/layout.tsx: 문서 페이지 레이아웃 (연도별 탭, 버전 선택)
 * 수정일: 2026-04-07
 */
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { VersionSelector } from '@/components/version-selector';

export default function Layout({ children }: { children: ReactNode }) {
  const allPages = source.getPages();
  const urls2025 = new Set<string>();
  const urls2026 = new Set<string>();
  const urlsGuide = new Set<string>();

  for (const page of allPages) {
    if (page.url.startsWith('/docs/2025')) urls2025.add(page.url);
    else if (page.url.startsWith('/docs/2026')) urls2026.add(page.url);
    else if (page.url.startsWith('/docs/guide')) urlsGuide.add(page.url);
  }

  return (
    <DocsLayout
      tree={source.pageTree}
      tabs={[
        { title: '2025', url: '/docs/2025/project-alpha', urls: urls2025 },
        { title: '2026', url: '/docs/2026/project-gamma', urls: urls2026 },
        { title: 'Guide', url: '/docs/guide', urls: urlsGuide },
      ]}
      sidebar={{ footer: (
        <div key="sidebar-footer" className="flex items-center gap-2">
          <VersionSelector />
          <a
            href="/docs/guide"
            className="inline-flex items-center justify-center rounded-md
              text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent
              transition-colors"
            style={{ width: '32px', height: '32px' }}
            title="Guide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </a>
        </div>
      ) }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
