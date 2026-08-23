<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

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

const filterHistory = ref([])

watch(chargefilter, (newValue, oldValue) => {
  filterHistory.value.push({
    from: oldValue,
    to: newValue,
    time: new Date().toLocaleTimeString(),
  })
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
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="city"
        @input="(e) => (city = e.target.value)"
        placeholder="도시명을 입력해주세요"
      />
      <p>입력된 도시: <strong>{{ city }}</strong></p>

      <div class="grade-filter">
        <button
          :class="{ active: chargefilter === 'excellent' }"
          @click="toggleChargeFilter('excellent')"
        >
          🔋 발전 우수만 보기
        </button>
        <button
          :class="{ active: chargefilter === 'poor' }"
          @click="toggleChargeFilter('poor')"
        >
          🪫 발전 미흡만 보기
        </button>
      </div>
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
        <p>오늘 누적 일사량: {{ item.insolation }}kWh/m²</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (> 25)</span>
        <br />

        <span v-if="item.insolation >= 1.5" class="badge charge">🔋 태양광 발전 우수</span>
        <span v-else class="badge discharge">🪫 태양광 발전 미흡</span>

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

