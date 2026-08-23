// Open-Meteo의 일일 일사량 총합(shortwave_radiation_sum, MJ/m²)으로 태양광 발전 가능성 등급을 매김
export const GRADE_META = {
  excellent: { label: '우수', color: '#e08c12', panelCount: 5 },
  normal: { label: '보통', color: '#d9ac2b', panelCount: 3 },
  poor: { label: '미흡', color: '#7f93a8', panelCount: 1 },
  unknown: { label: '측정 데이터 없음', color: '#9aa5b1', panelCount: 0 },
}

export function gradeFromRadiation(radiation) {
  if (radiation === null || radiation === undefined) return 'unknown'
  if (radiation >= 18) return 'excellent'
  if (radiation >= 10) return 'normal'
  return 'poor'
}

// OpenWeatherMap의 weather[0].main(영문 대분류)을 이모지로 매핑
const CONDITION_GLYPH = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
}

export function glyphForCondition(main) {
  return CONDITION_GLYPH[main] || '🌤️'
}
