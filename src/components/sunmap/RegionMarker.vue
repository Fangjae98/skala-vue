<script setup>
import { computed } from 'vue'
import { GRADE_META } from '@/utils/solarGrade.js'

// Props Down: 부모(KoreaMap)가 좌표를 계산해 위치를 잡고, 이 컴포넌트는 마커 내용만 그린다.
const props = defineProps({
  region: {
    type: Object,
    required: true, // { id, name, grade, clouds }
  },
  selected: {
    type: Boolean,
    default: false,
  },
  night: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select']) // Emit Up: 클릭된 지역 id만 상위로 올린다

const meta = computed(() => GRADE_META[props.region.grade])
const size = computed(() => {
  if (props.region.grade === 'excellent') return 30
  if (props.region.grade === 'normal') return 25
  if (props.region.grade === 'poor') return 21
  return 21
})
</script>

<template>
  <button
    type="button"
    class="region-marker"
    :class="{ selected }"
    :aria-label="`${region.name} 태양광 ${meta.label}`"
    @click="emit('select', region.id)"
  >
    <span
      class="dot"
      :class="{ unknown: region.grade === 'unknown' }"
      :style="{
        width: size + 'px',
        height: size + 'px',
        background: region.grade === 'unknown' ? undefined : meta.color,
        borderColor: selected ? (night ? '#fff' : '#1d2a3a') : 'rgba(255,255,255,.85)',
        borderWidth: selected ? '3px' : '2px',
        boxShadow: night ? `0 0 14px ${meta.color}` : 'none',
      }"
    >
      <span v-if="region.grade !== 'unknown'" class="panel-count">{{ meta.panelCount }}</span>
    </span>
    <span class="chip" :class="{ night }">
      <b>{{ region.name }}</b>
      <span class="chip-value">{{ region.clouds }}%</span>
    </span>
  </button>
</template>

<style scoped>
.region-marker {
  position: relative;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-family: inherit;
}
.dot {
  position: relative;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border-style: solid;
  transition: all 300ms ease;
}
.dot.unknown {
  background: repeating-linear-gradient(45deg, #c7ced6 0 4px, #dde3e9 4px 8px);
}
.panel-count {
  font: 700 10px/1 'Space Grotesk', ui-monospace, monospace;
  color: rgba(28, 26, 14, 0.78);
}
.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  color: #17242f;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(12, 20, 40, 0.14);
  transition: all 300ms ease;
}
.chip.night {
  background: rgba(16, 22, 44, 0.82);
  color: #e8eefc;
}
.chip-value {
  font: 600 11px/1 'Space Grotesk', ui-monospace, monospace;
  opacity: 0.75;
}
.region-marker.selected .chip {
  outline: 2px solid #e8952a;
}
</style>
