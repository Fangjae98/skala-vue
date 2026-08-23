<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import ChargeFilterBar from './ChargeFilterBar.vue'

const city = ref('')
const search = ref('도시를 검색하거나 클릭하세요')
const chargefilter = ref(null)

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', insolation: '3.2' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', insolation: '0.0' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', insolation: '0.7' },
  { id: 'city_04', name: '광주', temp: 27, status: '맑음', insolation: '3.7' },
  { id: 'city_05', name: '대전', temp: 26, status: '구름', insolation: '0.4' },
])

const showDetail = (name, status) => {
  alert(`${name}: ${status}`)
}

const filteredWeatherList = computed(() => {
  const query = city.value.trim()
  let list = weatherList.value

  if (query) {
    list = list.filter((item) => item.name.includes(query))
  }

  if (chargefilter.value === 'excellent') {
    list = list.filter((item) => item.insolation >= 1.5)
  } else if (chargefilter.value === 'poor') {
    list = list.filter((item) => item.insolation < 1.5)
  }

  return list
})

const toggleChargeFilter = (grade) => {
  chargefilter.value = chargefilter.value === grade ? null : grade
}

watch(chargefilter, (newValue, oldValue) => {
  console.log(`[필터 변경 이력] ${oldValue ?? '전체'} → ${newValue ?? '전체'}`)
})

watch(search, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`[watchEffect 호출] '${city.value}'에 매칭되는 API 데이터를 필터링합니다`)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-city="city" @update-city="(val) => (city = val)" />
      <ChargeFilterBar :chargefilter="chargefilter" @toggle-charge-filter="toggleChargeFilter" />
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
        일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ search }}
    </div>
  </div>
</template>
