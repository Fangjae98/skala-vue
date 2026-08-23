import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 전국 주요 관측지점 9곳
const REGION_COORDS = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'city_03', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'city_04', name: '강릉', lat: 37.7519, lon: 128.8761 },
  { id: 'city_05', name: '대전', lat: 36.3504, lon: 127.3845 },
  { id: 'city_06', name: '광주', lat: 35.1595, lon: 126.8526 },
  { id: 'city_07', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'city_08', name: '대구', lat: 35.8714, lon: 128.6014 },
  { id: 'city_09', name: '제주', lat: 33.4996, lon: 126.5312 },
]

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const useWeatherStore = defineStore('weather', () => {
  // { id, name, lat, lon, temp, status, humidity, windSpeed, clouds, radiation }
  const regionList = ref([])
  const isLoading = ref(false)
  const lastFetchedAt = ref(null)

  const fetchAllRegions = async () => {
    isLoading.value = true
    try {
      const [weatherResponses, radiationResponses] = await Promise.all([
        Promise.all(
          REGION_COORDS.map((region) =>
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
              params: {
                lat: region.lat,
                lon: region.lon,
                appid: API_KEY,
                units: 'metric',
                lang: 'kr',
              },
            }),
          ),
        ),
        // Open-Meteo: 일일 일사량 총합(MJ/m²)
        Promise.all(
          REGION_COORDS.map((region) =>
            axios.get('https://api.open-meteo.com/v1/forecast', {
              params: {
                latitude: region.lat,
                longitude: region.lon,
                daily: 'shortwave_radiation_sum',
                timezone: 'Asia/Seoul',
                forecast_days: 1,
              },
            }),
          ),
        ),
      ])

      regionList.value = weatherResponses.map((res, idx) => ({
        ...REGION_COORDS[idx],
        temp: res.data.main.temp,
        status: res.data.weather[0].description,
        main: res.data.weather[0].main,
        humidity: res.data.main.humidity,
        windSpeed: res.data.wind.speed,
        clouds: res.data.clouds.all,
        radiation: radiationResponses[idx].data.daily.shortwave_radiation_sum[0] ?? null,
      }))
      lastFetchedAt.value = new Date()
    } catch {
      ElMessage.error('날씨 데이터를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      isLoading.value = false
    }
  }

  return { regionList, isLoading, lastFetchedAt, fetchAllRegions }
})
