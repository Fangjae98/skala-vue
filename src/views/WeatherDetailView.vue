<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { gradeFromRadiation, GRADE_META, glyphForCondition } from '@/utils/solarGrade.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  if (weatherStore.regionList.length === 0) {
    weatherStore.fetchAllRegions()
  }
})

const cityData = computed(() =>
  weatherStore.regionList.find((r) => r.id === route.params.cityId) || null,
)
const gradeMeta = computed(() =>
  cityData.value ? GRADE_META[gradeFromRadiation(cityData.value.radiation)] : null,
)
const glyph = computed(() => (cityData.value ? glyphForCondition(cityData.value.main) : ''))

const stats = computed(() => {
  if (!cityData.value) return []
  const c = cityData.value
  return [
    { label: '습도', value: c.humidity + '%' },
    { label: '풍속', value: c.windSpeed + 'm/s' },
    { label: '구름량', value: c.clouds + '%' },
    { label: '일사량', value: c.radiation.toFixed(1) + ' MJ/m²' },
    { label: '발전 등급', value: gradeMeta.value.label },
  ]
})
</script>

<template>
  <div class="detail-page">
    <button type="button" class="back-btn" @click="router.push('/')">← 대시보드로</button>

    <div v-if="weatherStore.isLoading" v-loading="true" class="detail-card" style="min-height: 200px" />

    <section v-else-if="cityData" class="detail-card">
      <div class="detail-top">
        <div>
          <p class="detail-kicker">📍 지정 지역</p>
          <h1 class="detail-name">{{ cityData.name }}</h1>
          <p class="detail-status">{{ cityData.status }}</p>
        </div>
        <div class="detail-temp-row">
          <span class="detail-temp">{{ configStore.convertTemp(cityData.temp) }}{{ configStore.unitSymbol }}</span>
          <span class="detail-glyph">{{ glyph }}</span>
        </div>
      </div>

      <div class="stat-grid">
        <div v-for="s in stats" :key="s.label" class="stat-chip">
          <p class="stat-label">{{ s.label }}</p>
          <p class="stat-value" :style="s.label === '발전 등급' ? { color: gradeMeta.color } : {}">
            {{ s.value }}
          </p>
        </div>
      </div>
    </section>

    <div v-else class="detail-card">
      <p>해당 지역의 상세 데이터가 존재하지 않습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 720px;
  margin: 0 auto;
}
.back-btn {
  border: 0;
  background: transparent;
  color: var(--app-text);
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 0;
  margin-bottom: 14px;
  opacity: 0.75;
}
.detail-card {
  border-radius: 22px;
  padding: 28px 30px;
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
  box-shadow: 0 18px 40px -28px var(--app-shadow);
}
.detail-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.detail-kicker {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}
.detail-name {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--app-heading);
}
.detail-status {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--app-text-secondary);
}
.detail-temp-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}
.detail-temp {
  font: 700 56px/1 'Space Grotesk', monospace;
  letter-spacing: -0.03em;
  color: var(--app-heading);
}
.detail-glyph {
  font-size: 40px;
  line-height: 1;
  padding-bottom: 6px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-top: 26px;
}
.stat-chip {
  padding: 15px 16px;
  border-radius: 14px;
  background: var(--app-chip-bg);
}
.stat-label {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-secondary);
}
.stat-value {
  margin: 0;
  font: 700 20px/1 'Space Grotesk', monospace;
  color: var(--app-heading);
}
</style>
