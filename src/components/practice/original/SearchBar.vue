<script setup>
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
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentCity"
      @input="$emit('update-city', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentCity }}</strong>
    </p>
  </div>
</template>
