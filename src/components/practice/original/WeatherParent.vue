<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const city = ref('')
const search = ref('도시를 검색하거나 클릭하세요')

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const showDetail = (name, status) => {
  alert(`${name}: ${status}`)
}

const filteredWeatherList = computed(() => {
  const query = city.value.trim() // 입력 시 앞뒤 공백 제거
  if (!query) {
    return weatherList.value
  } // 입력 없을 시 리스트 전체 노출
  return weatherList.value.filter((item) => item.name.includes(query)) // 검색어가 포함된 도시를 필터링하여 실시간으로 뱉어냅니다.
})

// search의 문구 변화를 감시하여 후속 로그를 처리합니다.
watch(search, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 타이핑할 때마다 변하는 searchQuery를 AI CCTV처럼 자동 추적합니다.
watchEffect(() => {
  console.log(`[watchEffect 호출] '${city.value}'에 매칭되는 API 데이터를 필터링합니다`)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-city="city" @update-city="(val) => (city = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (search = msg)"
        @click-detail="showDetail"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ search }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
