/**
 * layout.config.tsx: 레이아웃 공통 설정 (nav, GitHub, 링크)
 * 수정일: 2026-04-07
 */
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  githubUrl: 'https://github.com/cmaven',
  nav: {
    title: (
      <span className="font-semibold">Tech Docs Portal</span>
    ),
  },
  links: [],
};
