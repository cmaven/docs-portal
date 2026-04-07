/**
 * version-selector.tsx: 사이드바 하단 버전 선택 + html[data-version] 설정
 * 수정일: 2026-04-07
 */
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface VersionDef {
  label: string;
  pathKey: string;
  url: string;
}

const projectVersions: Record<string, VersionDef[]> = {
  'project-alpha': [
    { label: 'v1', pathKey: '/docs/2025/project-alpha', url: '/docs/2025/project-alpha' },
    { label: 'v2', pathKey: '/docs/2025/project-alpha-v2', url: '/docs/2025/project-alpha-v2' },
  ],
};

function detectProject(pathname: string): { versions: VersionDef[]; current: VersionDef } | null {
  for (const versions of Object.values(projectVersions)) {
    for (const v of versions) {
      if (pathname === v.pathKey || pathname.startsWith(v.pathKey + '/')) {
        return { versions, current: v };
      }
    }
  }
  return null;
}

export function VersionSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const detected = detectProject(pathname);

  useEffect(() => {
    const sidebar = document.querySelector('#nd-sidebar');
    if (!sidebar) return;

    const isV2 = detected?.current.label === 'v2';

    // 같은 이름 폴더를 순서로 구분: 첫번째=v1, 두번째=v2
    const folderBtns = sidebar.querySelectorAll('button[aria-expanded]');
    const nameCount: Record<string, number> = {};
    const versionedNames = ['Project Alpha'];

    folderBtns.forEach((btn) => {
      const name = btn.textContent?.trim() || '';
      const container = btn.parentElement;
      if (!container) return;

      if (!versionedNames.includes(name)) return;

      nameCount[name] = (nameCount[name] || 0) + 1;
      const index = nameCount[name]; // 1=first(v1), 2=second(v2)

      // 기본: v1 표시, v2 숨김. v2 선택 시: v1 숨김, v2 표시.
      const shouldHide = isV2 ? index === 1 : index === 2;

      if (shouldHide) {
        (container as HTMLElement).style.display = 'none';
      } else {
        (container as HTMLElement).style.display = '';
        if (detected && btn.getAttribute('aria-expanded') === 'false') {
          (btn as HTMLElement).click();
        }
      }
    });
  }, [pathname, detected]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!detected) return null;

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium
          bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-primary/15
          transition-colors border border-fd-border"
        aria-label="Select version"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
        {detected.current.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1.5 min-w-[80px] rounded-lg border border-fd-border
          bg-fd-popover p-1 shadow-lg z-50">
          {detected.versions.map((v) => (
            <button
              key={v.label}
              onClick={() => { router.push(v.url); setOpen(false); }}
              className={`w-full text-left rounded-md px-3 py-1.5 text-xs transition-colors
                ${detected.current.label === v.label
                  ? 'bg-fd-primary/15 text-fd-primary font-semibold'
                  : 'text-fd-foreground hover:bg-fd-accent'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
