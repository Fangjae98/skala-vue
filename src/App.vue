<script setup>
import { computed } from 'vue'
import UnitToggler from './components/practice/UnitToggler.vue'
import { useSunThemeStore } from '@/stores/sunThemeStore.js'

const sunTheme = useSunThemeStore()

const NAV_ITEMS = [
  { to: '/', label: '🌤️ 날씨 대시보드' },
  { to: '/sunmap', label: '☀️ SunMap' },
  { to: '/learning', label: '📘 학습노트' },
  { to: '/about', label: '💪 서비스 소개' },
]

const PHASE_META = {
  day: { label: '낮', dot: '#f2a032' },
  dusk: { label: '노을', dot: '#e07a5f' },
  night: { label: '밤', dot: '#7f8cc4' },
}
const phaseMeta = computed(() => PHASE_META[sunTheme.phase])
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="logo">
        <span class="logo-dot"></span>
        <span class="logo-text">SunMap Weather</span>
      </div>

      <nav class="nav-pills">
        <RouterLink v-for="item in NAV_ITEMS" :key="item.to" :to="item.to" class="nav-pill">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="utility-bar">
        <span class="sun-clock">
          <span class="clock-text">{{ sunTheme.clockLabel }}</span>
        </span>
        <UnitToggler />
        <span class="phase-indicator">
          <span class="phase-dot" :style="{ background: phaseMeta.dot }"></span>
          {{ phaseMeta.label }}
        </span>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>

<style scoped>
.app-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px 60px;
}
.app-header {
  position: sticky;
  top: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 14px 24px;
  margin: 0 -20px 24px;
  background: var(--app-header-bg);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--app-border);
  transition: background 400ms ease, border-color 400ms ease;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.logo-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 32%, #ffe6a8, #f2a032 62%, #e07d12);
  box-shadow: 0 0 14px rgba(240, 160, 40, 0.55);
  display: block;
}
.logo-text {
  font-weight: 900;
  font-size: 17px;
  letter-spacing: -0.02em;
  color: var(--app-heading);
}

.nav-pills {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.nav-pill {
  padding: 9px 15px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--app-text);
  text-decoration: none;
  transition: background 220ms ease;
}
.nav-pill:hover {
  background: var(--app-btn-bg);
}
.nav-pill.router-link-active {
  background: var(--app-btn-bg-hover);
}

.utility-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-left: auto;
}
.sun-clock {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 12px;
  border-radius: 11px;
  background: var(--app-chip-bg);
  border: 1px solid var(--app-border);
}
.clock-text {
  font: 700 13px/1 'Space Grotesk', ui-monospace, monospace;
  letter-spacing: 0.02em;
  color: var(--app-text);
}
.phase-indicator {
  display: flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
  color: var(--app-text);
  opacity: 0.85;
}
.phase-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: block;
}

.app-main {
  padding: 0;
}
</style>
