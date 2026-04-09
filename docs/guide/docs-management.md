---
title: 문서 관리 가이드
description: 디렉토리 구조, 페이지 추가, 자동 사이드바, 버전 관리
---

Tech Docs Portal의 문서를 추가하고 관리하는 방법을 안내합니다.

---

## 디렉토리 구조

모든 문서는 `docs/` 하위에 **연도/프로젝트/파일.md** 형태로 저장합니다.

```
docs/
├── .vitepress/          # VitePress 설정
│   ├── config.ts        # 메인 설정 (수정 불필요)
│   └── theme/           # 테마 파일
├── public/              # 정적 파일 (이미지, PDF 등)
│   ├── images/
│   └── files/
├── guide/               # 가이드 섹션
│   ├── index.md
│   └── ...
├── 2025/                # 연도별 분류
│   ├── project-alpha/
│   │   ├── index.md     # 프로젝트 개요
│   │   ├── architecture.md
│   │   └── api-guide.md
│   └── project-beta/
│       ├── index.md
│       └── setup.md
└── 2026/
    └── new-project/
        └── index.md
```

---

## 자동 사이드바

VitePress 설정이 `docs/` 디렉토리를 자동으로 스캔합니다.
**파일을 원하는 위치에 넣으면 사이드바에 자동 등록됩니다.**
`config.ts` 수정이 필요 없습니다.

### 사이드바 표시 순서

- `index.md`는 항상 첫 번째로 정렬됩니다.
- 그 외 파일은 파일명 알파벳 순으로 정렬됩니다.
- frontmatter의 `title`이 사이드바 표시 이름으로 사용됩니다.

---

## 자동 서버 재시작

개발 서버(`npm run docs:watch`)는 파일/디렉토리 변경을 실시간으로 감지합니다.

| 변경 유형 | 동작 |
|-----------|------|
| `.md` 파일 내용 수정 | 브라우저 자동 새로고침 (Hot Reload) |
| 새 `.md` 파일 추가 | 서버 자동 재시작 후 사이드바 반영 |
| 디렉토리 추가/삭제 | 서버 자동 재시작 후 사이드바 반영 |

::: tip
새 파일이나 폴더를 추가한 뒤 잠시 기다리면 서버가 자동으로 재시작됩니다.
수동으로 재시작할 필요가 없습니다.
:::

---

## 자동 홈페이지 카드

홈페이지(/)는 `docs/` 디렉토리를 스캔하여 프로젝트 카드를 자동 생성합니다.
각 `index.md`의 frontmatter `title`과 `description`이 카드에 표시됩니다.

```yaml
---
title: Project Alpha
description: Terraform 기반 인프라 자동화 프로젝트
---
```

`config.ts` 수정 없이 파일을 추가하면 홈페이지 카드가 자동으로 나타납니다.

---

## 문서 추가 예제

### 예제 1: 기존 프로젝트에 페이지 추가

```bash
# .md 파일 생성
cat > docs/2025/project-alpha/deployment.md << 'EOF'
---
title: 배포 가이드
description: Project Alpha 배포 방법
---

배포 관련 내용을 작성합니다.
EOF
```

서버가 자동으로 재시작되고 사이드바에 등록됩니다.

### 예제 2: 새 프로젝트 추가

```bash
# 디렉토리 생성 후 index.md 작성
mkdir -p docs/2026/new-project

cat > docs/2026/new-project/index.md << 'EOF'
---
title: New Project 개요
description: 새 프로젝트 설명
---

프로젝트 소개 내용을 작성합니다.
EOF
```

홈페이지 카드와 사이드바에 자동으로 반영됩니다.

---

## 버전 관리

동일 프로젝트의 여러 버전을 관리할 때는 폴더를 분리합니다.

```
docs/2025/
├── my-project/       # v1 (현재)
│   ├── index.md
│   └── guide.md
└── my-project-v2/   # v2 (신규)
    ├── index.md
    └── guide.md
```

### 버전 선택기

`VersionSelector` 컴포넌트는 프로젝트 버전 폴더(`-v2`, `-v3` 등)를 자동으로 감지합니다.
해당 프로젝트 페이지에 접속하면 사이드바에 버전 드롭다운이 자동으로 표시됩니다.
별도 설정 없이 폴더 구조만으로 동작합니다.

---

## 정적 파일 (이미지, 다운로드)

정적 파일은 `docs/public/` 디렉토리에 저장합니다.

```
docs/public/
├── images/        # 이미지 파일
│   └── diagram.png
└── files/         # 다운로드 파일 (PDF, Excel 등)
    ├── report.pdf
    └── template.xlsx
```

Markdown에서 사용:

```md
![다이어그램](/images/diagram.png)
[보고서 다운로드](/files/report.pdf)
```

---

## Docker 실행

### 개발 환경

```bash
# 개발 서버 시작 (파일 변경 자동 감지 + 브라우저 자동 새로고침)
docker compose -f docker-compose.dev.yml up -d

# 로그 확인
docker compose -f docker-compose.dev.yml logs -f

# 중지
docker compose -f docker-compose.dev.yml down
```

### 프로덕션 환경

```bash
# 프로덕션 서버 시작
docker compose up -d

# 로그 확인
docker compose logs -f

# 중지
docker compose down
```

::: info
개발 환경은 볼륨 마운트로 실행되어 `.md` 파일 수정이 즉시 반영됩니다.
프로덕션 환경은 빌드된 정적 파일을 제공합니다.
:::

---

## 로컬 실행

```bash
# 개발 모드 (파일 변경 감지 + Hot Reload)
npm run docs:watch

# 단순 개발 서버 (감지 없음)
npm run docs:dev

# 프로덕션 빌드
npm run docs:build
```

---

## 요약 체크리스트

| 단계 | 작업 |
|------|------|
| 1 | `docs/연도/프로젝트/` 디렉토리 생성 |
| 2 | `.md` 파일 작성 (frontmatter `title` 필수) |
| 3 | 서버 자동 재시작 대기 (약 2~3초) |
| 4 | 브라우저에서 사이드바 및 홈페이지 카드 확인 |

::: tip config.ts 수정 불필요
파일을 `docs/` 하위에 넣기만 하면 사이드바와 홈페이지 카드가 자동으로 반영됩니다.
`docs/.vitepress/config.ts`를 수정할 필요가 없습니다.
:::
