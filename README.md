<!-- README.md: cdocs 프로젝트 개요 및 사용 가이드 | 생성일: 2026-04-09 -->

# cdocs

VitePress 기반 기술 문서 포털. Docker Compose로 개발/프로덕션 환경을 제공합니다.

## 프로젝트 구조

```
cdocs/
├── docs/                    # 문서 소스
│   ├── .vitepress/          # VitePress 설정 및 테마
│   ├── public/              # 정적 파일 (이미지, PDF 등)
│   │   └── files/
│   ├── guide/               # 사용 가이드
│   ├── 2025/                # 연도별 프로젝트 문서
│   └── 2026/
├── sample/                  # 샘플 문서 템플릿
├── Dockerfile               # 프로덕션 멀티스테이지 빌드
├── docker-compose.yml       # 프로덕션 환경
├── docker-compose.dev.yml   # 개발 환경 (HMR + 볼륨 마운트)
└── nginx.conf               # nginx 서빙 설정
```

## 빠른 시작

### 개발 환경 (Docker Compose)

```bash
# 시작 — 파일 변경 자동 감지 + 브라우저 자동 새로고침
docker compose -f docker-compose.dev.yml up -d

# 로그 확인
docker compose -f docker-compose.dev.yml logs -f

# 중지
docker compose -f docker-compose.dev.yml down
```

### 프로덕션 환경 (Docker Compose)

```bash
# 빌드 및 시작
docker compose up -d --build

# 로그 확인
docker compose logs -f

# 중지
docker compose down

# 완전 삭제 (이미지 포함)
docker compose down --rmi all --volumes
```

### 로컬 실행 (Node.js)

```bash
npm install

# 개발 모드 (파일 변경 감지 + 자동 재시작)
npm run docs:watch

# 단순 개발 서버
npm run docs:dev

# 프로덕션 빌드
npm run docs:build
```

접속: http://localhost:3030

## 원격 서버 업데이트 (개발 환경)

다른 서버에서 `docker-compose.dev.yml`로 운영 중일 때, 최신 코드를 반영하는 방법입니다.

### 문서만 변경된 경우

`package.json` 변경 없이 문서 콘텐츠만 업데이트할 때:

```bash
# 서버에서 생성/수정한 문서가 있으면 임시 저장
git stash

# 최신 코드 가져오기
git pull

# 임시 저장한 문서 복원
git stash pop

# 컨테이너 재시작 (볼륨 마운트로 변경 사항 자동 반영)
docker compose -f docker-compose.dev.yml restart
```

### 의존성(package.json)이 변경된 경우

`node_modules`는 Docker named volume으로 관리되어, `git pull`만으로는 갱신되지 않습니다.
반드시 볼륨을 삭제한 뒤 다시 시작해야 합니다.

```bash
# 컨테이너 중지
docker compose -f docker-compose.dev.yml down

# node_modules 볼륨 삭제 (볼륨명 확인: docker volume ls | grep node_modules)
docker volume rm cdocs_node_modules

# 최신 코드 가져오기
git stash
git pull
git stash pop

# 다시 시작 (npm install 자동 실행)
docker compose -f docker-compose.dev.yml up -d
```

### 변경 사항이 전혀 반영되지 않을 때

캐시 문제로 반영이 안 되면 컨테이너를 완전히 재생성합니다:

```bash
docker compose -f docker-compose.dev.yml down
docker volume rm cdocs_node_modules
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

> **참고:** 볼륨 이름은 프로젝트 디렉토리명에 따라 달라질 수 있습니다. `docker volume ls | grep node_modules`로 정확한 이름을 확인하세요.

## 문서 추가

모든 문서는 `docs/` 하위에 **연도/프로젝트/파일.md** 형태로 저장합니다.
파일을 추가하면 사이드바와 홈페이지 카드가 **자동으로 반영**됩니다 — `config.ts` 수정이 필요 없습니다.

### 새 프로젝트 추가

```bash
mkdir -p docs/2026/my-project

cat > docs/2026/my-project/index.md << 'EOF'
---
title: My Project 개요
description: 프로젝트 설명
---

프로젝트 소개 내용을 작성합니다.
EOF
```

### 기존 프로젝트에 페이지 추가

```bash
cat > docs/2026/my-project/setup.md << 'EOF'
---
title: 설치 가이드
description: 설치 방법 안내
---

설치 관련 내용을 작성합니다.
EOF
```

## 문서 삭제

해당 `.md` 파일 또는 프로젝트 디렉토리를 삭제하면 사이드바와 홈페이지에서 자동으로 제거됩니다.

```bash
# 단일 페이지 삭제
rm docs/2026/my-project/setup.md

# 프로젝트 전체 삭제
rm -rf docs/2026/my-project
```

## 정적 파일

이미지, PDF 등은 `docs/public/` 에 저장합니다.

```md
![다이어그램](/images/diagram.png)
[보고서 다운로드](/files/report.pdf)
```

## 기술 스택

- [VitePress](https://vitepress.dev/) — 정적 사이트 생성
- [Vue 3](https://vuejs.org/) — 커스텀 컴포넌트
- [Mermaid](https://mermaid.js.org/) — 다이어그램
- [nginx](https://nginx.org/) — 프로덕션 서빙
