<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'
import { gradeFromRadiation, GRADE_META, glyphForCondition } from '@/utils/solarGrade.js'

const configStore = useConfigStore()

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
}) // 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)

const emit = defineEmits(['select-card', 'click-detail']) // 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)

const hasSolarData = computed(() => props.cityItem.radiation !== undefined)
const grade = computed(() => gradeFromRadiation(props.cityItem.radiation))
const gradeMeta = computed(() => GRADE_META[grade.value])
const glyph = computed(() => glyphForCondition(props.cityItem.main))
const solarBarPct = computed(() =>
  hasSolarData.value ? Math.max(4, Math.min(100, (props.cityItem.radiation / 24) * 100)) : 0,
)
</script>

<template>
  <div
    class="weather-card"
    role="button"
    tabindex="0"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
    @keydown.enter="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <div class="card-top">
      <div>
        <p class="card-name">{{ cityItem.name }}</p>
        <p class="card-status">
          {{ cityItem.status }}
          <template v-if="cityItem.humidity !== undefined">· 습도 {{ cityItem.humidity }}%</template>
          <template v-if="cityItem.clouds !== undefined">· 구름 {{ cityItem.clouds }}%</template>
        </p>
      </div>
      <span class="card-glyph">{{ glyph }}</span>
    </div>

    <div class="card-temp-row">
      <span class="card-temp">{{ configStore.convertTemp(cityItem.temp) }}{{ configStore.unitSymbol }}</span>
      <span v-if="cityItem.windSpeed !== undefined" class="card-wind">풍속 {{ cityItem.windSpeed }}m/s</span>
    </div>

    <div v-if="hasSolarData" class="solar-block">
      <div class="solar-label-row">
        <span>일사량 {{ cityItem.radiation.toFixed(1) }} MJ/m²</span>
        <span :style="{ color: gradeMeta.color }">☀️ 발전 {{ gradeMeta.label }}</span>
      </div>
      <div class="solar-bar">
        <div class="solar-bar-fill" :style="{ width: solarBarPct + '%', background: gradeMeta.color }"></div>
      </div>
    </div>
    <p v-else-if="cityItem.insolation !== undefined" class="legacy-line">
      일사량(과거 목업값): {{ cityItem.insolation }}kWh/m²
    </p>

    <div class="card-bottom">
      <span class="temp-tag" :class="{ hot: cityItem.temp >= 25 }">
        {{ cityItem.temp >= 25 ? '🔥 더움' : '❄️ 선선함' }}
      </span>
      <el-button
        class="detail-btn"
        type="default"
        size="small"
        @click.stop="emit('click-detail', cityItem.id)"
      >
        상세보기
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  display: block;
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding: 18px 20px;
  margin-bottom: 12px;
  border-radius: 18px;
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
  color: var(--app-text);
  box-shadow: 0 14px 30px -26px var(--app-shadow);
  transition: transform 220ms ease, box-shadow 220ms ease;
  font-family: inherit;
}
.weather-card:focus-visible {
  outline: 2px solid var(--app-accent);
  outline-offset: 2px;
}
.weather-card:hover {
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.card-name {
  margin: 0;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--app-heading);
}
.card-status {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--app-text-secondary);
}
.card-glyph {
  font-size: 26px;
  line-height: 1;
}

.card-temp-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.card-temp {
  font: 700 36px/1 'Space Grotesk', ui-monospace, monospace;
  letter-spacing: -0.02em;
  color: var(--app-heading);
}
.card-wind {
  font-size: 13px;
  color: var(--app-text-secondary);
  padding-bottom: 5px;
}

.solar-block {
  margin-top: 14px;
}
.solar-label-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-secondary);
  margin-bottom: 6px;
}
.solar-bar {
  height: 7px;
  border-radius: 4px;
  background: var(--app-chip-bg);
  overflow: hidden;
}
.solar-bar-fill {
  height: 100%;
  border-radius: 4px;
}
.legacy-line {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}
.temp-tag {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--app-chip-bg);
  color: var(--app-text-secondary);
}
.temp-tag.hot {
  color: #c0392b;
}
.detail-btn {
  cursor: pointer;
}
</style>
