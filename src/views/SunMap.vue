<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useSunThemeStore } from '@/stores/sunThemeStore.js'
import { gradeFromRadiation, GRADE_META } from '@/utils/solarGrade.js'
import KoreaMap from '@/components/sunmap/KoreaMap.vue'

const weatherStore = useWeatherStore()
const { regionList, isLoading } = storeToRefs(weatherStore)
const sunTheme = useSunThemeStore()

const selectedId = ref(null)

onMounted(() => {
  if (regionList.value.length === 0) {
    weatherStore.fetchAllRegions()
  }
})

const pad = (n) => (n < 10 ? '0' + n : '' + n)
const hm = (dec) => {
  if (dec === null || dec === undefined) return '--:--'
  const h = Math.floor(dec)
  const m = Math.round((dec - h) * 60)
  return pad(h) + ':' + pad(m % 60)
}

const enrichedRegions = computed(() =>
  regionList.value.map((r) => ({ ...r, grade: gradeFromRadiation(r.radiation) })),
)

const selectedRegion = computed(
  () => enrichedRegions.value.find((r) => r.id === selectedId.value) || null,
)

const ranking = computed(() =>
  enrichedRegions.value
    .filter((r) => r.radiation !== null && r.radiation !== undefined)
    .slice()
    .sort((a, b) => b.radiation - a.radiation)
    .slice(0, 6),
)

const grades = ['excellent', 'normal', 'poor', 'unknown']

const onRegionSelect = (id) => {
  selectedId.value = id
}
</script>

<template>
  <div class="sunmap-page">
    <h2>☀️ SunMap — 태양광 발전 가능성 지도</h2>
    <p class="subtitle">
      Open-Meteo의 일일 일사량(MJ/m²)을 기준으로 지역별 태양광 발전 등급을 매깁니다. · 태양 고도
      {{ sunTheme.sunPos.elevation.toFixed(1) }}° · 방위 {{ sunTheme.sunPos.azimuth.toFixed(0) }}° ·
      일출 {{ hm(sunTheme.times.rise) }} / 일몰 {{ hm(sunTheme.times.set) }}
    </p>

    <div class="sunmap-layout">
      <section class="map-panel" v-loading="isLoading">
        <KoreaMap
          :regions="enrichedRegions"
          :sun-elevation="sunTheme.sunPos.elevation"
          :sun-azimuth="sunTheme.sunPos.azimuth"
          :selected-id="selectedId"
          @region-select="onRegionSelect"
        />
      </section>

      <aside class="sidebar">
        <div class="side-card">
          <p class="side-title">태양광 발전 등급</p>
          <div v-for="g in grades" :key="g" class="legend-row">
            <span class="legend-dot" :style="{ background: GRADE_META[g].color }"></span>
            <span class="legend-label">{{ GRADE_META[g].label }}</span>
            <span class="legend-spacer"></span>
            <span class="legend-panels">패널 {{ GRADE_META[g].panelCount }}개</span>
          </div>
        </div>

        <div class="side-card">
          <p class="side-title">오늘 발전 유리 지역</p>
          <button
            v-for="(r, idx) in ranking"
            :key="r.id"
            type="button"
            class="rank-row"
            @click="onRegionSelect(r.id)"
          >
            <span class="rank-idx">{{ idx + 1 }}</span>
            <span class="rank-name">{{ r.name }}</span>
            <span class="rank-bar">
              <span
                class="rank-bar-fill"
                :style="{ width: Math.max(4, Math.min(100, (r.radiation / 24) * 100)) + '%', background: GRADE_META[r.grade].color }"
              ></span>
            </span>
            <span class="rank-value">{{ r.radiation.toFixed(1) }} MJ/m²</span>
          </button>
          <el-empty v-if="ranking.length === 0" description="데이터를 불러오는 중입니다." />
        </div>

        <div v-if="selectedRegion" class="side-card detail-card">
          <p class="side-title">📍 {{ selectedRegion.name }}</p>
          <div class="detail-grid">
            <div><p class="detail-label">기온</p><p class="detail-value">{{ selectedRegion.temp }}°</p></div>
            <div><p class="detail-label">구름량</p><p class="detail-value">{{ selectedRegion.clouds }}%</p></div>
            <div><p class="detail-label">일사량</p><p class="detail-value">{{ selectedRegion.radiation }} MJ/m²</p></div>
            <div>
              <p class="detail-label">발전 등급</p>
              <p class="detail-value" :style="{ color: GRADE_META[selectedRegion.grade].color }">
                {{ GRADE_META[selectedRegion.grade].label }}
              </p>
            </div>
          </div>
          <router-link :to="`/weather/${selectedRegion.id}`" class="detail-link">
            지역 상세보기 →
          </router-link>
        </div>
        <el-empty v-else description="지도를 클릭해서 지역을 선택하세요." />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.sunmap-page {
  max-width: 1200px;
  margin: 0 auto;
}
.subtitle {
  color: var(--app-text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 18px;
}

.sunmap-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) 340px;
  gap: 18px;
  align-items: start;
}
@media (max-width: 760px) {
  .sunmap-layout {
    grid-template-columns: 1fr;
  }
}

.map-panel {
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--app-border);
  padding: 4px;
  background: var(--app-card-bg);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.side-card {
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 14px 30px -26px var(--app-shadow);
}
.side-title {
  margin: 0 0 10px;
  font-weight: 900;
  font-size: 13px;
  color: var(--app-heading);
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: 13px;
}
.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-spacer {
  flex: 1;
}
.legend-panels {
  font-size: 12px;
  color: var(--app-text-secondary);
}
.rank-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
}
.rank-idx {
  width: 14px;
  font-size: 12px;
  opacity: 0.55;
}
.rank-name {
  width: 44px;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
}
.rank-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--app-border);
  overflow: hidden;
}
.rank-bar-fill {
  display: block;
  height: 100%;
}
.rank-value {
  font-size: 11px;
  color: var(--app-text-secondary);
  white-space: nowrap;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
.detail-label {
  margin: 0 0 3px;
  font-size: 11px;
  color: var(--app-text-secondary);
}
.detail-value {
  margin: 0;
  font-weight: 700;
  font-size: 15px;
  color: var(--app-heading);
}
.detail-link {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-accent);
}
</style>
