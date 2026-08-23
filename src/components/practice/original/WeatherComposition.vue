<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
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

// selectedCityInfo의 문구 변화를 감시하여 후속 로그를 처리합니다.
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
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="city"
        @input="(e) => (city = e.target.value)"
        placeholder="도시명을 입력해주세요"
      />
      <p>
        입력된 도시: <strong> {{ city }} </strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>
      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="search = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}도</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (> 25)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
      <br />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ search }}
    </div>
  </div>
</template>
