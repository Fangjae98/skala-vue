<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null

// 생성 단계(Creation) = <script setup> 본문 그 자체
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (Dom 접근 불가)')

// 부착 단계(Mounting)
onMounted(() => {
  console.log('2. [onMounted] 화면에 완벽히 부착되었습니다! (API 호출/DOM 조작 적기)')
  // 실무 활용 시뮬레이션: 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// 갱신 단계(Updating) - count 변수가 바뀌어서 화면이 리렌더링(새로고침)될 때마다 매번 실행
onUpdated(() => {
  console.log(`3. [onUpdated] 데이터가 변경되어 화면을 새로 그림 (현재 count: ${count.value})`)
})

// 소멸 단계(Unmounting) - v-if="false" 등으로 이 컴포넌트가 화면에서 완전히 파괴되어 사라질 때 실행된
onUnmounted(() => {
  // 주의: 여기서 타이머를 안 꺼주면 컴포넌트가 사라져도 백그라운드에서 영원히 타이머가 돕니다! (메모리 누수)
  clearInterval(timerId)
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <h3>⏱️ 라이프사이클 훅 흐름 탐색기</h3>
  <div class="counter-display">
    <p>실시간 타이머 카운트: {{ count }}</p>
    <button @click="count++">수동으로 숫자 올리기</button>
  </div>
</template>

<style scoped>
.counter-display {
  background: #e3fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #99e9f2;
  text-align: center;
}
</style>
