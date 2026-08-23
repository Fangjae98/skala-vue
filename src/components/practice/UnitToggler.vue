<script setup>
import { useConfigStore } from '@/stores/configStore.js'
import { storeToRefs } from 'pinia' // 16교시 p.205: state는 storeToRefs 필수

const configStore = useConfigStore()
const { unit } = storeToRefs(configStore)
</script>

<template>
  <div class="unit-toggler">
    <span>날씨단위:</span>
    <el-switch
      :model-value="unit === 'fahrenheit'"
      active-text="화씨(℉)"
      inactive-text="섭씨(℃)"
      @change="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
</style>
