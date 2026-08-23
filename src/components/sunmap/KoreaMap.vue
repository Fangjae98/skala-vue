<script setup>
import { ref, computed, onMounted } from 'vue'
import { geoMercator, geoPath, geoBounds } from 'd3-geo'
import { feature } from 'topojson-client'
import { daylight } from '@/utils/solarPosition.js'
import RegionMarker from './RegionMarker.vue'

// world-atlas의 국가 경계 TopoJSON(정적 지형 데이터, CORS 허용)만 사용한다 —
// 기상 관측치가 아니므로 백엔드 프록시가 필요 없다.
const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json'
const W = 1000
const H = 1300
const BBOX = { type: 'MultiPoint', coordinates: [[124.0, 32.6], [131.6, 39.4]] }

let topoPromise = null
function loadGeo() {
  if (!topoPromise) {
    topoPromise = fetch(TOPO_URL)
      .then((r) => r.json())
      .then((topo) => feature(topo, topo.objects.countries).features)
  }
  return topoPromise
}

// rgb(...) 문자열끼리 t(0~1) 비율로 색을 섞는다
function mix(a, b, t) {
  const pa = a.match(/\d+/g).map(Number)
  const pb = b.match(/\d+/g).map(Number)
  return 'rgb(' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',') + ')'
}

const props = defineProps({
  regions: {
    type: Array,
    default: () => [], // { id, name, lat, lon, grade, clouds }
  },
  sunElevation: {
    type: Number,
    default: 45,
  },
  sunAzimuth: {
    type: Number,
    default: 180,
  },
  selectedId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['region-select'])

const svgPaths = ref([])
const projectionReady = ref(false)
const loadFailed = ref(false)
let projection = null

onMounted(async () => {
  try {
    const features = await loadGeo()
    projection = geoMercator().fitExtent(
      [
        [-70, -50],
        [W + 70, H + 50],
      ],
      BBOX,
    )
    const pathGen = geoPath(projection)
    const near = features.filter((f) => {
      const b = geoBounds(f)
      return b[0][0] < 134 && b[1][0] > 121 && b[0][1] < 42 && b[1][1] > 30
    })
    svgPaths.value = near.map((f) => pathGen(f)).filter(Boolean)
    projectionReady.value = true
  } catch {
    loadFailed.value = true
  }
})

const k = computed(() => daylight(props.sunElevation))
const night = computed(() => k.value < 0.35)

const seaStyle = computed(() => ({
  background: `linear-gradient(${mix('rgb(14,22,48)', 'rgb(168,214,238)', k.value)}, ${mix('rgb(9,15,36)', 'rgb(206,234,246)', k.value)})`,
}))
const landFill = computed(() => mix('rgb(30,40,72)', 'rgb(247,244,232)', k.value))
const landStroke = computed(() => mix('rgb(70,86,132)', 'rgb(196,206,190)', k.value))

const glowStyle = computed(() => {
  const rad = ((props.sunAzimuth - 180) * Math.PI) / 180
  const gx = 50 + Math.sin(rad) * 58
  const gy = 50 + Math.cos(rad) * 58
  return {
    background: `radial-gradient(120% 120% at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255,214,140,${(0.75 * k.value).toFixed(2)}) 0%, rgba(255,214,140,0) 62%)`,
    opacity: k.value < 0.06 ? 0 : 1,
  }
})

const markers = computed(() => {
  if (!projectionReady.value || !projection) return []
  return props.regions.map((r) => {
    const [x, y] = projection([r.lon, r.lat])
    return { ...r, xPct: (x / W) * 100, yPct: (y / H) * 100 }
  })
})
</script>

<template>
  <div class="korea-map">
    <div class="sea" :style="seaStyle"></div>
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid meet" class="land-svg">
      <path
        v-for="(d, i) in svgPaths"
        :key="i"
        :d="d"
        :fill="landFill"
        :stroke="landStroke"
        stroke-width="1.4"
      />
    </svg>
    <div class="glow" :style="glowStyle"></div>
    <div class="markers">
      <div
        v-for="m in markers"
        :key="m.id"
        class="marker-pos"
        :style="{ left: m.xPct + '%', top: m.yPct + '%' }"
      >
        <RegionMarker
          :region="m"
          :selected="m.id === selectedId"
          :night="night"
          @select="emit('region-select', $event)"
        />
      </div>
    </div>
    <div v-if="loadFailed" class="map-message">지형 데이터를 불러올 수 없습니다.</div>
    <div v-else-if="!projectionReady" class="map-message">지도를 불러오는 중...</div>
  </div>
</template>

<style scoped>
.korea-map {
  position: relative;
  width: 100%;
  aspect-ratio: 1000 / 1300;
  overflow: hidden;
  border-radius: 18px;
}
.sea {
  position: absolute;
  inset: 0;
  transition: background 900ms ease;
}
.land-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.land-svg path {
  transition: fill 900ms ease, stroke 900ms ease;
}
.glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: soft-light;
  transition: background 900ms ease, opacity 900ms ease;
}
.markers {
  position: absolute;
  inset: 0;
}
.marker-pos {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.map-message {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: #7b8794;
  background: rgba(245, 245, 244, 0.7);
}
</style>
