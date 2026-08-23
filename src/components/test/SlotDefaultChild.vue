<template>
  <div class="base-card">
    <slot>
      <p>기본 콘텐츠 영역입니다.</p>
    </slot>
  </div>
</template>

<style scoped>
.base-card {
  margin-top: 12px;
  padding: 14px 18px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #f8f9fa;
}
</style>
