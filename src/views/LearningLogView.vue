<script setup>
import WeatherMockup from '@/components/practice/WeatherMockup.vue'
import WeatherComposition from '@/components/practice/WeatherComposition.vue'
import WeatherParent from '@/components/practice/WeatherParent.vue'
import WeatherAxios from '@/components/practice/WeatherAxios.vue'
import AxiosJson from '@/components/practice/AxiosJson.vue'
import OriginalUnitToggler from '@/components/practice/original/UnitToggler.vue'

const archive = [
  { n: '과제 1', title: 'Mockup', desc: 'Vue 3 기본 문법으로 날씨 카드 목업 구성.' },
  { n: '과제 2', title: 'Composition', desc: 'ref/computed/watch로 검색, 필터, 로그 상태 구성.' },
  { n: '과제 3', title: 'Component', desc: 'SearchBar/ChargeFilterBar/WeatherCard로 컴포넌트 분리, Props Down,Emit Up 패턴 적용.' },
  { n: '과제 4', title: 'Router', desc: 'Vue Router로 페이지 전환. 현재 서비스 라우팅(router/index.js)으로 원본 코드만 참고로 남김.' },
  { n: '과제 5', title: 'Store', desc: 'Pinia로 단위(℃/℉) 전역 상태 관리. 현재 storeToRefs 적용 버전이 헤더에서 사용중으로 원본 코드 참고로 남김.' },
  { n: '과제 6', title: 'Axios', desc: 'OpenWeatherMap 실시간 호출과 JSONPlaceholder CRUD로 axios 통신 검증.' },
]

// 과제 4는 별도 컴포넌트 파일이 아니라 App.vue 안의 라우팅 마크업 자체였던 원본 코드를 그대로 남겨둔다.
const ROUTER_SNIPPET = `<nav class="navigation-bar">
  <RouterLink to="/">🌤️ 날씨 대시보드</RouterLink>
  <RouterLink to="/sunmap">☀️ SunMap</RouterLink>
  <RouterLink to="/about">💪 서비스 소개</RouterLink>
</nav>
<main>
  <RouterView />
</main>`

const STORE_SNIPPET = `export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const unitSymbol = computed(() =>
    unit.value === 'celsius' ? '℃' : '℉'
  )
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }
  return { unit, unitSymbol, toggleUnit }
})`
</script>

<template>
  <div class="learning-log">
    <h1>학습노트</h1>
    <p class="lede">과제 결과물을 모아둔 아카이브입니다.</p>

    <div class="archive-grid">
      <div v-for="a in archive" :key="a.n" class="archive-card">
        <p class="archive-n">{{ a.n }}</p>
        <p class="archive-title">{{ a.title }}</p>
        <p class="archive-desc">{{ a.desc }}</p>
      </div>
    </div>

    <el-collapse>
      <el-collapse-item title="과제 1: Mockup" name="1"><WeatherMockup /></el-collapse-item>
      <el-collapse-item title="과제 2: Composition" name="2"><WeatherComposition /></el-collapse-item>
      <el-collapse-item title="과제 3: Component" name="3"><WeatherParent /></el-collapse-item>

      <el-collapse-item title="과제 4: Router (원본 참고)" name="4">
        <p class="ref-note">
          현재 <code>router/index.js</code> + <code>App.vue</code>의 실제 nav가 이 역할을 하고 있습니다.
        </p>
        <pre class="code-ref">{{ ROUTER_SNIPPET }}</pre>
      </el-collapse-item>

      <el-collapse-item title="과제 5: Store (원본 참고)" name="5">
        <p class="ref-note">
          현재 헤더의 단위 토글은 <code>storeToRefs</code>를 적용 버전 사용중. 아래는 과제 중 만든,
          <code>storeToRefs</code> 없이 스토어를 참조한 원본 컴포넌트와 스토어입니다.
        </p>
        <OriginalUnitToggler />
        <pre class="code-ref">{{ STORE_SNIPPET }}</pre>
      </el-collapse-item>

      <el-collapse-item title="과제 6: Axios" name="6">
        <WeatherAxios />
        <AxiosJson />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.learning-log {
  max-width: 900px;
  margin: 0 auto;
}
.lede {
  color: var(--app-text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}
.archive-card {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
}
.archive-n {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-secondary);
}
.archive-title {
  margin: 0 0 4px;
  font-weight: 900;
  color: var(--app-heading);
}
.archive-desc {
  margin: 0;
  font-size: 12px;
  color: var(--app-text-secondary);
  line-height: 1.5;
}

.ref-note {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--app-text-secondary);
}
.code-ref {
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--app-chip-bg);
  font-family: 'Space Grotesk', ui-monospace, monospace;
  font-size: 12.5px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
}
</style>
