<script setup>
import { useThemeStore } from '@/stores/themeStore.js'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
</script>

<template>
  <el-switch
    v-model="isDark"
    active-text="🌙 다크"
    inactive-text="☀️ 라이트"
    @change="themeStore.toggleTheme"
  />
</template>
