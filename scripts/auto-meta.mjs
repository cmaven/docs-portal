/**
 * auto-meta.mjs: MDX 문서 디렉토리의 meta.json 및 frontmatter 자동 생성
 * 상세: content/docs/ 스캔 후 누락된 meta.json과 frontmatter를 자동 생성
 * 생성일: 2026-04-08
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, basename, relative } from 'path';

const CONTENT_DIR = 'content/docs';
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

const stats = { metaCreated: 0, metaSkipped: 0, frontmatterAdded: 0, frontmatterSkipped: 0 };

function toTitle(name) {
  return name
    .replace(/^\d+[-_]/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function getSubdirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);
}

async function getMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isFile() && e.name.endsWith('.mdx')).map(e => e.name);
}

async function ensureFrontmatter(filePath) {
  const content = await readFile(filePath, 'utf-8');
  if (content.startsWith('---')) {
    stats.frontmatterSkipped++;
    return;
  }

  const name = basename(filePath, '.mdx');
  const title = name === 'index' ? toTitle(basename(join(filePath, '..'))) + ' 개요' : toTitle(name);
  const frontmatter = `---\ntitle: ${title}\ndescription: \n---\n\n`;
  const newContent = frontmatter + content;

  console.log(`  + frontmatter: ${relative('.', filePath)}`);
  if (!isDryRun) {
    await writeFile(filePath, newContent, 'utf-8');
  }
  stats.frontmatterAdded++;
}

async function processDir(dir, isRoot = false) {
  const mdxFiles = await getMdxFiles(dir);
  const subdirs = await getSubdirs(dir);
  const metaPath = join(dir, 'meta.json');
  const hasExistingMeta = await stat(metaPath).then(() => true).catch(() => false);

  // frontmatter 확인
  for (const f of mdxFiles) {
    await ensureFrontmatter(join(dir, f));
  }

  // meta.json 생성
  if (mdxFiles.length > 0 || subdirs.length > 0) {
    if (hasExistingMeta && !isForce) {
      stats.metaSkipped++;
    } else {
      const pages = [];
      const mdxNames = mdxFiles.map(f => f.replace('.mdx', ''));
      if (mdxNames.includes('index')) {
        pages.push('index');
      }
      mdxNames.filter(n => n !== 'index').sort().forEach(n => pages.push(n));
      subdirs.sort().forEach(d => pages.push(d));

      const dirName = basename(dir);
      const meta = { title: toTitle(dirName), pages };
      if (isRoot) {
        meta.root = true;
        meta.defaultOpen = true;
      }

      const label = hasExistingMeta ? '덮어쓰기' : '생성';
      console.log(`  + meta.json ${label}: ${relative('.', metaPath)}`);
      if (!isDryRun) {
        await writeFile(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf-8');
      }
      stats.metaCreated++;
    }
  }

  // 재귀 탐색
  for (const sub of subdirs) {
    await processDir(join(dir, sub), false);
  }
}

async function updateRootMeta() {
  const rootMetaPath = join(CONTENT_DIR, 'meta.json');
  const rootMeta = JSON.parse(await readFile(rootMetaPath, 'utf-8'));
  const subdirs = await getSubdirs(CONTENT_DIR);
  const mdxFiles = await getMdxFiles(CONTENT_DIR);
  const mdxNames = mdxFiles.map(f => f.replace('.mdx', ''));

  const allEntries = new Set([...rootMeta.pages]);
  for (const name of [...mdxNames, ...subdirs]) {
    if (!allEntries.has(name)) {
      allEntries.add(name);
      console.log(`  + 최상위 meta.json에 추가: ${name}`);
    }
  }

  const newPages = [...allEntries];
  if (JSON.stringify(newPages) !== JSON.stringify(rootMeta.pages)) {
    rootMeta.pages = newPages;
    if (!isDryRun) {
      await writeFile(rootMetaPath, JSON.stringify(rootMeta, null, 2) + '\n', 'utf-8');
    }
  }
}

async function main() {
  console.log(`\n📄 auto-meta: content/docs/ 스캔 중...`);
  if (isDryRun) console.log('   (dry-run 모드 — 실제 변경 없음)\n');
  if (isForce) console.log('   (force 모드 — 기존 meta.json 덮어쓰기)\n');

  const rootDirs = await getSubdirs(CONTENT_DIR);

  // 루트 레벨 MDX frontmatter 확인
  const rootMdx = await getMdxFiles(CONTENT_DIR);
  for (const f of rootMdx) {
    await ensureFrontmatter(join(CONTENT_DIR, f));
  }

  // 각 카테고리 처리
  for (const dir of rootDirs) {
    await processDir(join(CONTENT_DIR, dir), true);
  }

  // 최상위 meta.json 동기화
  await updateRootMeta();

  console.log(`\n✅ 완료`);
  console.log(`   meta.json 생성: ${stats.metaCreated}, 스킵: ${stats.metaSkipped}`);
  console.log(`   frontmatter 추가: ${stats.frontmatterAdded}, 스킵: ${stats.frontmatterSkipped}\n`);
}

main().catch(e => { console.error('오류:', e.message); process.exit(1); });
