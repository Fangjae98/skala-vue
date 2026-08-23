<script setup>
import { Search } from '@element-plus/icons-vue' // 아이콘 사용 시 별도 패키지 필요 (아래 참고)

defineEmits(['update-city']) // 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록
defineProps({
  currentCity: {
    type: String,
    default: '',
  },
}) // 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지)
</script>

<template>
  <div class="search-inner">
    <el-input
      :model-value="currentCity"
      @update:model-value="$emit('update-city', $event)"
      placeholder="지역 검색 (예: 강릉, 제주)"
      clearable
      :prefix-icon="Search"
    />
  </div>
</template>

<style scoped>
.search-inner {
  flex: 1 1 240px;
  max-width: 320px;
}
.search-inner :deep(.el-input__wrapper) {
  border-radius: 12px;
  background: var(--app-input-bg);
  box-shadow: 0 0 0 1px var(--app-border) inset;
}
</style>
