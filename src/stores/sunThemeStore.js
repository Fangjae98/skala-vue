import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { solarPosition, daylight, phase, sunTimes, REFERENCE_LOCATION } from '@/utils/solarPosition.js'

const { lat: LAT, lon: LON, tz: TZ } = REFERENCE_LOCATION

// 낮/노을/밤 3단계 팔레트 — 목업(SunMap Weather Platform v1.1)의 배색 사용
const PALETTES = {
  day: {
    pageBg: 'linear-gradient(178deg, #9fd3ef 0%, #cfe9f8 38%, #f4f1e6 100%)',
    heroBg: 'linear-gradient(168deg, #7cc3e8 0%, #b9dcf0 46%, #f2e7cd 100%)',
    headerBg: 'rgba(255,255,255,.66)',
    cardBg: 'rgba(255,255,255,.74)',
    cardBorder: 'rgba(20,45,70,.10)',
    chipBg: 'rgba(20,45,70,.06)',
    inputBg: 'rgba(255,255,255,.8)',
    text: '#14212c',
    textSecondary: 'rgba(20,33,44,.62)',
    heading: '#0f1a22',
    accentText: '#a85a06',
    shadow: 'rgba(16,40,70,.16)',
    btnBg: 'rgba(255,255,255,.7)',
    btnBgHover: 'rgba(255,255,255,.92)',
    btnBorder: 'rgba(20,45,70,.14)',
  },
  dusk: {
    pageBg: 'linear-gradient(178deg, #4a5d8d 0%, #a97a86 46%, #e8b183 100%)',
    heroBg: 'linear-gradient(168deg, #3e4f7d 0%, #a06f80 50%, #e8a86f 100%)',
    headerBg: 'rgba(255,248,240,.6)',
    cardBg: 'rgba(255,250,244,.66)',
    cardBorder: 'rgba(30,25,50,.14)',
    chipBg: 'rgba(40,30,60,.09)',
    inputBg: 'rgba(255,250,244,.72)',
    text: '#241d2e',
    textSecondary: 'rgba(36,29,46,.62)',
    heading: '#1c1524',
    accentText: '#8f3f10',
    shadow: 'rgba(30,20,10,.24)',
    btnBg: 'rgba(255,250,244,.6)',
    btnBgHover: 'rgba(255,250,244,.88)',
    btnBorder: 'rgba(30,25,50,.18)',
  },
  night: {
    pageBg: 'linear-gradient(178deg, #0a1030 0%, #131b3d 46%, #1d2547 100%)',
    heroBg: 'linear-gradient(168deg, #0b1235 0%, #17204a 52%, #232c58 100%)',
    headerBg: 'rgba(14,20,46,.72)',
    cardBg: 'rgba(30,38,72,.62)',
    cardBorder: 'rgba(255,255,255,.10)',
    chipBg: 'rgba(255,255,255,.07)',
    inputBg: 'rgba(255,255,255,.08)',
    text: '#eaf0ff',
    textSecondary: 'rgba(234,240,255,.62)',
    heading: '#ffffff',
    accentText: '#f0b45c',
    shadow: 'rgba(0,0,0,.5)',
    btnBg: 'rgba(255,255,255,.08)',
    btnBgHover: 'rgba(255,255,255,.16)',
    btnBorder: 'rgba(255,255,255,.16)',
  },
}

const CSS_VAR_MAP = {
  pageBg: '--app-bg',
  heroBg: '--app-hero-bg',
  headerBg: '--app-header-bg',
  cardBg: '--app-card-bg',
  cardBorder: '--app-border',
  chipBg: '--app-chip-bg',
  inputBg: '--app-input-bg',
  text: '--app-text',
  textSecondary: '--app-text-secondary',
  heading: '--app-heading',
  accentText: '--app-accent',
  shadow: '--app-shadow',
  btnBg: '--app-btn-bg',
  btnBgHover: '--app-btn-bg-hover',
  btnBorder: '--app-btn-border',
}

const pad = (n) => (n < 10 ? '0' + n : '' + n)

export const useSunThemeStore = defineStore('sunTheme', () => {
  // 실시간 기준 — 30초마다 갱신
  const now = ref(new Date())

  setInterval(() => {
    now.value = new Date()
  }, 30000)

  const effectiveDate = computed(() => now.value)

  const sunPos = computed(() => solarPosition(effectiveDate.value, LAT, LON))
  const daylightFactor = computed(() => daylight(sunPos.value.elevation))
  const currentPhase = computed(() => phase(sunPos.value.elevation))
  const times = computed(() => sunTimes(effectiveDate.value, LAT, LON, TZ))
  const palette = computed(() => PALETTES[currentPhase.value])

  const clockLabel = computed(() => {
    const d = effectiveDate.value
    return pad(d.getHours()) + ':' + pad(d.getMinutes())
  })

  watch(
    palette,
    (p) => {
      const root = document.documentElement.style
      for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
        root.setProperty(cssVar, p[key])
      }
    },
    { immediate: true },
  )

  // Element Plus 자체 컴포넌트(el-button/el-input 등)의 다크 스타일은
  // html.dark 클래스로만 활성화되므로, 야간 위상일 때 자동으로 맞춤
  watch(
    currentPhase,
    (p) => {
      document.documentElement.classList.toggle('dark', p === 'night')
    },
    { immediate: true },
  )

  return {
    now,
    effectiveDate,
    sunPos,
    daylightFactor,
    phase: currentPhase,
    times,
    palette,
    clockLabel,
  }
})
