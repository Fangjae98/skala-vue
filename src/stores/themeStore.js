import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 1. State — localStorage에서 꺼내 초기화
  const theme = ref(localStorage.getItem('appTheme') || 'light')

  // 2. Getters
  const isDark = computed(() => theme.value === 'dark')

  // 3. Actions
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 4. Watch — theme이 바뀔 때마다 <html> 태그와 localStorage에 부수효과 적용
  watch(
    theme,
    (newTheme) => {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      localStorage.setItem('appTheme', newTheme)
    },
    { immediate: true }, // 처음 Store가 만들어질 때도 1회 즉시 실행 (새로고침 시 저장된 테마 바로 적용)
  )

  return { theme, isDark, toggleTheme }
})
