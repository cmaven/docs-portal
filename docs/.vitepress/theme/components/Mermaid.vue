<!--
  Mermaid.vue: Mermaid 다이어그램 렌더링 컴포넌트
  생성일: 2026-04-08 | 수정일: 2026-04-08
-->
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({ chart: { type: String, required: true } })
const container = ref(null)
const { isDark } = useData()

/**
 * mermaid.render()/parse()는 측정·에러 렌더링용으로 document.body 에 임시 SVG/div 를
 * 남길 수 있고, SPA 라우팅으로 컴포넌트가 언마운트돼도 이 잔여 노드가 화면에 남아
 * "Syntax error in text — mermaid version …" 가 다른 페이지까지 따라다니는 문제를
 * 일으킨다. body 직속의 고아 mermaid 노드를 안전하게 제거.
 */
function cleanupOrphanMermaid() {
  if (typeof document === 'undefined') return
  const selectors = [
    'body > svg[aria-roledescription="error"]',
    'body > svg[id^="mermaid-"]',
    'body > svg[id^="dmermaid-"]',
    'body > div[id^="dmermaid-"]',
    'body > [id^="d"][id*="mermaid"]',
  ]
  document.querySelectorAll(selectors.join(',')).forEach((el) => el.remove())
}

async function render() {
  if (!container.value) return
  cleanupOrphanMermaid()
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    // 측정용 hidden div(body 직속)와 렌더 SVG의 폰트 metric을 일치시키기 위해
    // 'inherit' 대신 본문에서 실제로 쓰이는 폰트 스택을 명시.
    fontFamily: "'SUITE Variable', 'SUITE-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    theme: isDark.value ? 'dark' : 'default',
    flowchart: {
      htmlLabels: true,
      useMaxWidth: true,
      // 박스 padding을 키워 한글 폰트의 ascender/descender 비대칭으로 인한
      // 시각적 위/아래 공백 차이가 비율적으로 작게 보이도록 완화 (기본 8 → 16)
      padding: 16,
    },
  })

  const code = props.chart.replaceAll('\\n', '\n')

  // 사전 파싱: 실패하면 mermaid 가 body 에 에러 SVG 를 만들기 전에 우리가 가로채서
  // 컴포넌트 내부에만 메시지를 표시. 페이지 전체로 에러가 새는 것을 막는다.
  try {
    await mermaid.parse(code)
  } catch (err) {
    cleanupOrphanMermaid()
    const msg = (err && err.message ? err.message : String(err)).replace(/</g, '&lt;')
    container.value.innerHTML = `<pre style="color:#c00;white-space:pre-wrap;font-size:0.85em;margin:0">Mermaid 구문 오류:\n${msg}</pre>`
    return
  }

  const id = 'mermaid-' + Math.random().toString(36).slice(2)
  try {
    const { svg } = await mermaid.render(id, code)
    container.value.innerHTML = svg
  } catch (err) {
    const msg = (err && err.message ? err.message : String(err)).replace(/</g, '&lt;')
    container.value.innerHTML = `<pre style="color:#c00;white-space:pre-wrap;font-size:0.85em;margin:0">Mermaid 렌더링 실패:\n${msg}</pre>`
  } finally {
    cleanupOrphanMermaid()
  }
}

onMounted(render)
onUnmounted(cleanupOrphanMermaid)
watch(isDark, render)
</script>

<template>
  <div class="my-6 flex justify-center overflow-x-auto rounded-lg border p-4" style="border-color: var(--vp-c-border); background: var(--vp-c-bg-elv);">
    <div ref="container" class="mermaid-wrapper" />
  </div>
</template>
