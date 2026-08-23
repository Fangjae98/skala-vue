<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cards = [
  {
    glyph: '🌤️',
    title: '지역별 날씨 대시보드',
    desc: '전국 날씨를 한눈에 비교합니다.',
    cta: '대시보드 열기',
    to: '/',
  },
  {
    glyph: '☀️',
    title: 'SunMap 발전 가능성 지도',
    desc: '지역별 예상 태양광 발전량을 비교합니다.',
    cta: '지도 열기',
    to: '/sunmap',
  },
  {
    glyph: '📘',
    title: '학습노트',
    desc: 'Vue 문법 과제 결과물을 기록합니다.',
    cta: '기록 보기',
    to: '/learning',
  },
]

const stack = [
  { label: '프론트 프레임워크', value: 'Vue 3 · Composition API' },
  { label: '상태관리', value: 'Pinia — config / sunTheme / weather' },
  { label: '날씨 데이터', value: 'OpenWeatherMap, open-meteo' },
  { label: '발전 등급 추정', value: 'API 데이터' },
  { label: '지도', value: 'Natural Earth TopoJSON, d3-geo 투영' },
  { label: '태양 위치', value: '실시간 고도, 방위각 계산' },
]
</script>

<template>
  <div class="about-page">
    <h1>서비스 소개</h1>
    <p class="lede">날씨 조회를 넘어, 지역별 태양광 발전 가능성을 보여주는 대시보드입니다.</p>

    <div class="card-grid">
      <RouterLink v-for="c in cards" :key="c.to" :to="c.to" class="about-card">
        <span class="about-glyph">{{ c.glyph }}</span>
        <span class="about-title">{{ c.title }}</span>
        <span class="about-desc">{{ c.desc }}</span>
        <span class="about-cta">{{ c.cta }} →</span>
      </RouterLink>
    </div>

    <div class="stack-box">
      <p class="stack-title">데이터 & 기술</p>
      <div class="stack-grid">
        <div v-for="s in stack" :key="s.label">
          <p class="stack-label">{{ s.label }}</p>
          <p class="stack-value">{{ s.value }}</p>
        </div>
      </div>
    </div>

    <button type="button" class="home-btn" @click="router.push('/')">홈으로 이동</button>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
}
.lede {
  margin: 0 0 28px;
  font-size: 15px;
  max-width: 620px;
  line-height: 1.65;
  color: var(--app-text-secondary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(248px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}
.about-card {
  text-align: left;
  cursor: pointer;
  padding: 22px;
  border-radius: 18px;
  border: 1px solid var(--app-border);
  background: var(--app-card-bg);
  color: var(--app-text);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 220ms ease;
}
.about-card:hover {
  transform: translateY(-3px);
}
.about-glyph {
  font-size: 24px;
  line-height: 1;
}
.about-title {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--app-heading);
}
.about-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--app-text-secondary);
}
.about-cta {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 900;
  color: var(--app-accent);
}

.stack-box {
  border-radius: 18px;
  padding: 24px;
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
  margin-bottom: 20px;
}
.stack-title {
  margin: 0 0 16px;
  font-size: 13px;
  font-weight: 900;
  color: var(--app-heading);
}
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}
.stack-label {
  margin: 0 0 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-secondary);
}
.stack-value {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.55;
  color: var(--app-text);
}

.home-btn {
  padding: 10px 16px;
  background: var(--app-btn-bg);
  color: var(--app-text);
  border: 1px solid var(--app-btn-border);
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}
</style>
