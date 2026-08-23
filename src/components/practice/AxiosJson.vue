<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 백엔드 공용 주소
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

// 반응형 상태 데이터
const items = ref([])
const textInput = ref('')

// 1. GET: 데이터 가져오기
const handleRead = async () => {
  try {
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    console.log('GET 성공:', response.data)
  } catch (error) {
    console.error('GET 실패:', error)
  }
}
// 2. POST: 데이터 추가

const handleCreate = async () => {
  if (!textInput.value.trim()) return

  try {
    const payload = { title: textInput.value, body: '샘플 내용', userId: 1 }

    const response = await axios.post(BASE_URL, payload)
    console.log('POST 성공:', response.data)

    items.value.unshift(response.data)
    textInput.value = '' // 입력창 비우기
  } catch (error) {
    console.error('POST 실패:', error)
  }
}

// 3. PUT: 특정 데이터 수정
const handleUpdate = async (id) => {
  try {
    const editPayload = { title: '✨ 변조된 타이틀 데이터', body: '수정 완료', userId: 1 }

    const response = await axios.put(`${BASE_URL}/${id}`, editPayload)
    console.log('PUT 성공:', response.data)

    const index = items.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      items.value[index] = response.data
    }
  } catch (error) {
    console.error('PUT 실패:', error)
  }
}

// 4. DELETE: 특정 데이터 삭제
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`)
    console.log('DELETE 성공. 상태 코드:', response.status)

    items.value = items.value.filter((item) => item.id !== id)
  } catch (error) {
    console.error('DELETE 실패:', error)
  }
}

// 컴포넌트 켜지면 자동으로 GET 호출
onMounted(() => {
  handleRead()
})
</script>

<template>
  <div class="list-box">
    <h2>⚡ Axios CRUD 프로토타입 훈련</h2>
    <hr />

    <div class="input-zone">
      <input v-model="textInput" placeholder="저장할 텍스트를 입력하세요" />
      <button @click="handleCreate" class="btn-post">POST (추가)</button>
    </div>

    <ul class="item-list">
      <li v-for="item in items" :key="item.id" class="item-card">
        <div class="content">
          <span class="id-tag">ID: {{ item.id }}</span>
          <p class="title-text">{{ item.title }}</p>
        </div>
        <div class="btn-group">
          <button @click="handleUpdate(item.id)" class="btn-put">PUT (수정)</button>
          <button @click="handleDelete(item.id)" class="btn-delete">DEL (삭제)</button>
        </div>
      </li>
    </ul>
  </div>
</template>
