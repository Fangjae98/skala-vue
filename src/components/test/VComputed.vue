<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const dummy = ref(0) // computed와 무관

// 1. 일반함수: 화면이 조금이라도 렌더링되면 무조건 재실행
const getMethodResult = () => {
  console.log('X 일반 함수 실행됨')
  return count.value * 2
}
// 2. computed: count가 바뀔 때만 재연산(dumy가 바뀔 땐 이전 값 사용)
const doubleCount = computed(() => {
  console.log('V computed 연산 실행됨')
  return count.value * 2
})
</script>

<template>
  <div class="practice-section">
    <h2>computed() 캐싱 동작 비교</h2>

    <p>count: {{ count }} | dummy: {{ dummy }}</p>
    <button @click="count++">count 증가 (의존성 변경)</button>
    <button @click="dummy++">dummy 증가 (무관한 변경)</button>

    <p>일반 함수 결과: {{ getMethodResult() }}</p>
    <p>Computed 결과: {{ doubleCount }}</p>
  </div>
</template>
