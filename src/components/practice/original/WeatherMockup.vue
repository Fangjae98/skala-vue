<script setup>
import { ref } from 'vue'

const city = ref('')
const search = ref('도시를 클릭하거나 검색하세요')

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const showDetail = (name, status) => {
  window.alert(`${name}: ${status}`)
}
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
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="search = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}도</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
      <br />
    </section>

    <div class="status-bar">
      {{ search }}
    </div>
  </div>
</template>
