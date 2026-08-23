<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import SearchBar from '@/components/practice/SearchBar.vue'
import ChargeFilterBar from '@/components/practice/ChargeFilterBar.vue'
import WeatherCard from '@/components/practice/WeatherCard.vue'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useSunThemeStore } from '@/stores/sunThemeStore.js'
import { gradeFromRadiation } from '@/utils/solarGrade.js'

const router = useRouter()
const route = useRoute()

const weatherStore = useWeatherStore()
const { regionList, isLoading } = storeToRefs(weatherStore)
const sunTheme = useSunThemeStore()

const searchQuery = ref('')
const chargeFilter = ref(null) // null | 'excellent' | 'poor'
const selectedCityInfo = ref('')

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (regionList.value.length === 0) {
    weatherStore.fetchAllRegions()
  }
})

watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  let list = regionList.value
  const query = searchQuery.value.trim()
  if (query) {
    list = list.filter((item) => item.name.includes(query))
  }
  if (chargeFilter.value) {
    list = list.filter((item) => gradeFromRadiation(item.radiation) === chargeFilter.value)
  }
  return list
})

const toggleChargeFilter = (value) => {
  chargeFilter.value = chargeFilter.value === value ? null : value
}

const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}

// ---- 히어로 섹션: 태양 궤적 ----
const pad = (n) => (n < 10 ? '0' + n : '' + n)
const hm = (dec) => {
  if (dec === null || dec === undefined) return '--:--'
  const h = Math.floor(dec)
  const m = Math.round((dec - h) * 60)
  return pad(h) + ':' + pad(m % 60)
}
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const dateLabel = computed(() => {
  const d = sunTheme.effectiveDate
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())} (${WEEKDAYS[d.getDay()]})`
})

const HERO_COPY = {
  day: {
    headline: '태양이 내리쬐는 시간, 발전 조건이 좋습니다',
    subline: '전국 관측지점의 실시간 날씨와 태양광 발전 등급을 확인하세요.',
  },
  dusk: {
    headline: '해가 지평선에 걸렸습니다 — 발전 효율이 빠르게 떨어지는 시간',
    subline: '노을이 지는 시간대에는 예상 발전량이 낮아집니다.',
  },
  night: {
    headline: '태양이 지평선 아래 있습니다 — 야간 모드',
    subline: '야간에는 일사량이 없어 태양광 발전이 멈춥니다.',
  },
}
const heroCopy = computed(() => HERO_COPY[sunTheme.phase])
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-top">
        <div>
          <p class="hero-date">{{ dateLabel }}</p>
          <h1 class="hero-headline">{{ heroCopy.headline }}</h1>
          <p class="hero-subline">{{ heroCopy.subline }}</p>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <p class="hero-stat-label">태양 고도</p>
            <p class="hero-stat-value">{{ sunTheme.sunPos.elevation.toFixed(1) }}°</p>
            <p class="hero-stat-sub">방위 {{ sunTheme.sunPos.azimuth.toFixed(0) }}°</p>
          </div>
          <div class="hero-stat">
            <p class="hero-stat-label">일출 / 일몰</p>
            <p class="hero-stat-value small">{{ hm(sunTheme.times.rise) }}<br />{{ hm(sunTheme.times.set) }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="filter-row">
      <SearchBar :current-city="searchQuery" @update-city="(val) => (searchQuery = val)" />
      <ChargeFilterBar :chargefilter="chargeFilter" @toggle-charge-filter="toggleChargeFilter" />
      <span class="filter-spacer"></span>
      <span v-if="selectedCityInfo" class="selected-info">{{ selectedCityInfo }}</span>
    </div>

    <div class="card-grid" v-loading="isLoading">
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump"
      />
    </div>
    <el-empty v-if="!isLoading && filteredWeatherList.length === 0" description="조건에 맞는 지역이 없습니다." />
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: 26px 30px;
  background: var(--app-hero-bg);
  border: 1px solid var(--app-border);
  box-shadow: 0 18px 40px -28px var(--app-shadow);
  margin-bottom: 30px;
  transition: background 400ms ease;
}
.hero-top {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}
.hero-date {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}
.hero-headline {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--app-heading);
  max-width: 560px;
}
.hero-subline {
  margin: 10px 0 0;
  font-size: 15px;
  max-width: 460px;
  color: var(--app-text-secondary);
  line-height: 1.6;
}
.hero-stats {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}
.hero-stat {
  min-width: 120px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
}
.hero-stat-label {
  margin: 0 0 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-secondary);
}
.hero-stat-value {
  margin: 0;
  font: 700 24px/1 'Space Grotesk', monospace;
  color: var(--app-heading);
}
.hero-stat-value.small {
  font-size: 16px;
  line-height: 1.35;
}
.hero-stat-sub {
  margin: 6px 0 0;
  font-size: 11px;
  color: var(--app-text-secondary);
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.filter-spacer {
  flex: 1;
}
.selected-info {
  font-size: 13px;
  color: var(--app-text-secondary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 16px;
  min-height: 60px;
}
</style>
