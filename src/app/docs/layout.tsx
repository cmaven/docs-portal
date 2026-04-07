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

  for (const page of allPages) {
    if (page.url.startsWith('/docs/2025')) urls2025.add(page.url);
    else if (page.url.startsWith('/docs/2026')) urls2026.add(page.url);
  }

  return (
    <DocsLayout
      tree={source.pageTree}
      tabs={[
        { title: '2025', url: '/docs/2025/project-alpha', urls: urls2025 },
        { title: '2026', url: '/docs/2026/project-gamma', urls: urls2026 },
      ]}
      sidebar={{ footer: <VersionSelector /> }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
