// NOAA 근사식 기반 태양 위치 계산. korea-map 목업의 solar.js를 ES 모듈로 이식.
const RAD = Math.PI / 180

// 전국 대표 지점 — 사이트 전체 낮/밤 테마와 SunMap 태양 위치 계산의 기준 좌표
export const REFERENCE_LOCATION = { lat: 36.3504, lon: 127.3845, tz: 9, name: '대전' }

export function solarPosition(date, lat, lon) {
  const y = date.getUTCFullYear()
  const start = Date.UTC(y, 0, 1)
  const dayOfYear =
    Math.floor((Date.UTC(y, date.getUTCMonth(), date.getUTCDate()) - start) / 86400000) + 1
  const frac = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  const g = ((2 * Math.PI) / 365) * (dayOfYear - 1 + (frac - 12) / 24)
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(g) -
      0.032077 * Math.sin(g) -
      0.014615 * Math.cos(2 * g) -
      0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g)
  const tst = (frac * 60 + eqtime + 4 * lon + 1440) % 1440
  const ha = (tst / 4 - 180) * RAD
  const latR = lat * RAD
  let cosZ = Math.sin(latR) * Math.sin(decl) + Math.cos(latR) * Math.cos(decl) * Math.cos(ha)
  cosZ = Math.max(-1, Math.min(1, cosZ))
  const zenith = Math.acos(cosZ)
  const elevation = 90 - zenith / RAD
  const azS = Math.atan2(
    Math.sin(ha),
    Math.cos(ha) * Math.sin(latR) - Math.tan(decl) * Math.cos(latR),
  )
  const azimuth = ((azS / RAD + 180 + 360) % 360)
  return { elevation, azimuth, declination: decl / RAD }
}

// 0 = 완전한 밤, 1 = 완전한 낮
export function daylight(elevation) {
  return Math.max(0, Math.min(1, (elevation + 6) / 12))
}

export function phase(elevation) {
  if (elevation > 8) return 'day'
  if (elevation > -6) return 'dusk'
  return 'night'
}

export function sunTimes(date, lat, lon, tzOffsetHours) {
  const probe = new Date(date.getTime())
  const result = { rise: null, set: null }
  let prev = null
  for (let i = 0; i <= 288; i++) {
    probe.setUTCHours(0, 0, 0, 0)
    probe.setUTCMinutes(i * 5 - tzOffsetHours * 60)
    const e = solarPosition(probe, lat, lon).elevation
    if (prev !== null) {
      if (prev < 0 && e >= 0 && result.rise === null) result.rise = (i * 5) / 60
      if (prev >= 0 && e < 0 && result.set === null) result.set = (i * 5) / 60
    }
    prev = e
  }
  return result
}
