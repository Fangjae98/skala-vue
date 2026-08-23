<script setup>
defineProps({
  chargefilter: {
    type: String,
    default: null, // null | 'excellent' | 'poor'
  },
})

defineEmits(['toggle-charge-filter'])
</script>

<template>
  <div class="charge-filter">
    <button
      type="button"
      class="filter-pill"
      :class="{ active: chargefilter === 'excellent' }"
      @click="$emit('toggle-charge-filter', 'excellent')"
    >
      🔋 발전 우수만
    </button>
    <button
      type="button"
      class="filter-pill"
      :class="{ active: chargefilter === 'poor' }"
      @click="$emit('toggle-charge-filter', 'poor')"
    >
      🪫 발전 미흡만
    </button>
  </div>
</template>

<style scoped>
.charge-filter {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.filter-pill {
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid var(--app-border);
  background: transparent;
  color: var(--app-text);
  transition: all 200ms ease;
}
.filter-pill.active {
  background: var(--app-btn-bg-hover);
  border-color: var(--app-accent);
  color: var(--app-accent);
}
</style>
