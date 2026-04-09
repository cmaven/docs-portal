---
title: 커스터마이즈 가이드
description: VitePress 테마, 색상, 폰트, 레이아웃 등 포털 외관 커스터마이징 방법
---

<!-- customization.md: VitePress 기반 포털 커스터마이즈 가이드 | 수정일: 2026-04-09 -->

Tech Docs Portal의 테마 색상, 폰트, 레이아웃을 변경하는 방법을 안내합니다.  
모든 스타일은 `docs/.vitepress/theme/style.css` 한 파일에서 관리됩니다.

---

## 테마 색상 변경

VitePress의 색상은 `:root`와 `.dark`에 CSS 변수를 오버라이드하여 변경합니다.

### Light 모드 색상

```css
/* docs/.vitepress/theme/style.css */
:root {
  --vp-c-brand-1: #11999e;          /* 주요 색상 (링크, 버튼, 강조) */
  --vp-c-brand-2: #0e8589;          /* 호버 색상 */
  --vp-c-brand-3: #0b7174;          /* 활성 색상 */
  --vp-c-brand-soft: rgba(17, 153, 158, 0.14); /* 브랜드 반투명 배경 */

  --vp-c-bg: #f3f6f6;               /* 페이지 배경 */
  --vp-c-bg-alt: #eaf0f0;           /* 보조 배경 (navbar 등) */
  --vp-c-bg-elv: #ffffff;           /* 카드/팝업 배경 */
  --vp-c-bg-soft: #eaf5f5;          /* 연한 배경 */

  --vp-c-text-1: #40514e;           /* 기본 텍스트 */
  --vp-c-text-2: #6b7a77;           /* 보조 텍스트 */
  --vp-c-text-3: #8a9290;           /* 비활성 텍스트 */

  --vp-c-border: rgba(207, 212, 211, 0.6);   /* 테두리 */
  --vp-c-divider: rgba(207, 212, 211, 0.4);  /* 구분선 */
}
```

### Dark 모드 색상

```css
.dark {
  --vp-c-brand-1: #30e3ca;          /* 다크모드 주요 색상 */
  --vp-c-brand-2: #28c8b0;
  --vp-c-brand-3: #20ad96;
  --vp-c-brand-soft: rgba(48, 227, 202, 0.14);

  --vp-c-bg: #1a1f1e;               /* 다크 페이지 배경 */
  --vp-c-bg-alt: #161a19;
  --vp-c-bg-elv: #222827;
  --vp-c-bg-soft: #242a29;

  --vp-c-text-1: #d0d5d3;
  --vp-c-text-2: #8a9290;
  --vp-c-text-3: #6b7a77;

  --vp-c-border: rgba(48, 227, 202, 0.12);
  --vp-c-divider: rgba(48, 227, 202, 0.08);
}
```

### 색상 변경 예시

주요 색상을 파란색으로 변경하려면:

```css
:root {
  --vp-c-brand-1: #3b82f6;          /* 파란색 */
  --vp-c-brand-2: #2563eb;
  --vp-c-brand-soft: rgba(59, 130, 246, 0.14);
}
.dark {
  --vp-c-brand-1: #60a5fa;          /* 다크모드 밝은 파란색 */
}
```

> 변경 후 개발 서버에서 바로 확인할 수 있습니다 (Hot Reload).

---

## 폰트 변경

VitePress 폰트는 `--vp-font-family-base`(본문)와 `--vp-font-family-mono`(코드) 변수로 제어합니다.

### 현재 사용 중인 폰트

| 용도 | 폰트 | CSS 변수 |
|------|------|----------|
| 본문 (sans-serif) | SUITE Variable | `--vp-font-family-base` |
| 코드 (monospace) | D2Coding Ligature | `--vp-font-family-mono` |

### 폰트 변경 방법

`style.css` 상단의 `@import`와 `:root` 변수를 함께 수정합니다:

```css
/* 1. 폰트 import 추가 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

/* 2. 변수 변경 */
:root {
  --vp-font-family-base: 'Noto Sans KR', -apple-system, sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', Consolas, monospace;
}
```

---

## 레이아웃 조정

### 사이드바 너비

`:root`의 `--vp-sidebar-width` 변수로 조정합니다:

```css
:root {
  --vp-sidebar-width: 260px;        /* 기본값: 260px */
  --vp-layout-max-width: 100vw;     /* 전체 레이아웃 최대 너비 */
}
```

### TOC(우측 목차) 너비

VitePress의 scoped CSS를 오버라이드하려면 `!important`가 필요합니다:

```css
.VPDoc .aside {
  max-width: 220px !important;
}
.VPDoc .aside-container {
  width: 220px !important;
}
```

### 콘텐츠 영역 확장

사이드바와 TOC 사이 공간을 최대한 활용하려면:

```css
/* 콘텐츠 영역을 사이드바~TOC 사이 전체로 확장 */
.VPDoc.has-aside .content-container {
  max-width: none !important;
}
.VPDoc .container {
  justify-content: flex-start !important;
}
.VPDoc .content {
  margin: 0 !important;
  padding-right: 16px !important;
  padding-left: 16px !important;
  max-width: none !important;
}
```

---

## 사이드바 배경색

```css
/* Light 모드 */
:root {
  --vp-sidebar-bg-color: #ffffff;
}

/* Dark 모드 */
.dark {
  --vp-sidebar-bg-color: #1a1f1e;
}
```

---

## 제목 스타일

### H1 / H2 구분선

```css
/* H1 하단 구분선 */
.vp-doc h1 {
  padding-bottom: 0.4em;
  border-bottom: 1px solid var(--vp-c-border);
  margin-bottom: 1em;
}

/* H2 하단 구분선 */
.vp-doc h2 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--vp-c-border);
  border-top: none;
  margin-bottom: 0.8em;
}
```

구분선을 제거하려면:

```css
.vp-doc h1,
.vp-doc h2 {
  border-bottom: none;
  padding-bottom: 0;
}
```

### H3 좌측 강조 바

```css
/* H3 좌측 민트색 세로 바 */
.vp-doc h3 {
  padding-left: 0.6em;
  border-left: 3px solid var(--vp-c-brand-1);
  margin-top: 2rem;
}
```

---

## 테이블 스타일

테이블 헤더의 배경색과 글자색을 변경합니다:

```css
/* Light 모드: 민트 반투명 헤더 */
.vp-doc thead {
  background: rgba(17, 153, 158, 0.18);
}
.vp-doc thead th {
  color: #0b7174;
  font-weight: 700;
  border-bottom: 2px solid rgba(17, 153, 158, 0.3);
}

/* Dark 모드 */
.dark .vp-doc thead {
  background: rgba(48, 227, 202, 0.12);
}
.dark .vp-doc thead th {
  color: #30e3ca;
}
```

짝수 행 배경과 호버 효과:

```css
.vp-doc tbody tr:nth-child(even) {
  background-color: var(--vp-c-bg-soft);
}
.vp-doc tbody tr:hover {
  background-color: var(--vp-c-brand-soft);
}
```

---

## 코드블록 스타일

### 코드블록 배경색

```css
/* Light 모드: 흰색 배경 */
:root {
  --vp-code-block-bg: #ffffff;
}

/* Dark 모드: 고대비 어두운 배경 */
.dark {
  --vp-code-block-bg: #0d1117;
}
```

### 코드블록 테두리/그림자

```css
.vp-doc div[class*='language-'] {
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

---

## 인라인 코드 스타일

```css
/* Light 모드: 민트 배경 + 테두리 */
.vp-doc :not(pre) > code {
  padding: 2px 6px !important;
  border-radius: 4px !important;
  background-color: rgba(17, 153, 158, 0.1) !important;
  color: #0e8589 !important;
  font-weight: 500;
  border: 1px solid rgba(17, 153, 158, 0.15);
}

/* Dark 모드 */
.dark .vp-doc :not(pre) > code {
  background-color: rgba(48, 227, 202, 0.12) !important;
  color: #30e3ca !important;
  border-color: rgba(48, 227, 202, 0.2);
}
```

인라인 코드의 `--vp-code-bg` 변수로도 배경을 제어할 수 있습니다:

```css
:root {
  --vp-code-bg: rgba(17, 153, 158, 0.08);
}
.dark {
  --vp-code-bg: rgba(48, 227, 202, 0.1);
}
```

---

## Callout 스타일

VitePress의 `.custom-block`은 좌측 세로라인 + 아이콘 + 반투명 배경으로 구성됩니다.

### 기본 구조

```css
.custom-block {
  border: none !important;
  border-left: 4px solid !important;  /* 좌측 색상 라인 */
  border-radius: 4px !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 16px 16px 8px 16px;
  color: var(--vp-c-text-1);
}
```

### 종류별 색상

```css
.custom-block.info    { border-left-color: #3b82f6 !important; background-color: rgba(59, 130, 246, 0.06); }
.custom-block.tip     { border-left-color: #10b981 !important; background-color: rgba(16, 185, 129, 0.06); }
.custom-block.warning { border-left-color: #f59e0b !important; background-color: rgba(245, 158, 11, 0.06); }
.custom-block.danger  { border-left-color: #ef4444 !important; background-color: rgba(239, 68, 68, 0.06); }
.custom-block.note    { border-left-color: #8b5cf6 !important; background-color: rgba(139, 92, 246, 0.06); }
```

### 타이틀 아이콘

```css
.custom-block-title::before {
  margin-right: 0.4em;
}
.custom-block.info    .custom-block-title::before { content: 'ℹ️'; }
.custom-block.tip     .custom-block-title::before { content: '✅'; }
.custom-block.warning .custom-block-title::before { content: '⚠️'; }
.custom-block.danger  .custom-block-title::before { content: '❌'; }
.custom-block.note    .custom-block-title::before { content: '📝'; }
```

### 다크모드 배경 강화

```css
.dark .custom-block.info    { background-color: rgba(59, 130, 246, 0.1); }
.dark .custom-block.tip     { background-color: rgba(16, 185, 129, 0.1); }
.dark .custom-block.warning { background-color: rgba(245, 158, 11, 0.1); }
.dark .custom-block.danger  { background-color: rgba(239, 68, 68, 0.1); }
.dark .custom-block.note    { background-color: rgba(139, 92, 246, 0.1); }
```

---

## 카테고리 드롭다운 명칭 변경

사이드바 상단의 카테고리 드롭다운 메뉴 이름을 변경하려면 2곳을 수정합니다.

### 1. config.ts — 카테고리 목록

`docs/.vitepress/config.ts`의 `generateCategories()` 함수 마지막 부분:

```ts
// 예: 'Guide' → '가이드'로 변경
categories.push({ label: '가이드', path: '/guide/' })
```

### 2. CategoryDropdown.vue — 경로 매칭

`docs/.vitepress/theme/components/CategoryDropdown.vue`의 `currentCategory` 계산:

```ts
// label과 동일하게 맞춤
if (cat.label === '가이드' && path.startsWith('/guide')) return cat.label
```

> 두 파일의 `label` 값이 일치해야 드롭다운에서 현재 선택이 올바르게 표시됩니다.

---

## 커스터마이즈 파일 요약

| 파일 | 역할 |
|------|------|
| `docs/.vitepress/theme/style.css` | 색상, 폰트, 레이아웃, 테이블, 코드블록, Callout 스타일 전체 |
| `docs/.vitepress/config.ts` | 사이트 제목, 네비게이션, 사이드바 구조, 플러그인 |
| `docs/.vitepress/theme/index.ts` | 커스텀 Vue 컴포넌트 등록, 레이아웃 확장 |
| `docs/.vitepress/theme/*.vue` | 사이드바 푸터, 네비게이션 커스텀 컴포넌트 등 |
